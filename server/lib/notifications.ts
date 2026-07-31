interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderNotificationData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  total: number;
  items: OrderItem[];
}

function formatItemsList(items: OrderItem[]): string {
  return items
    .map((i) => `- ${i.productName} x${i.quantity} = ${i.lineTotal.toLocaleString("fr-FR")} FCFA`)
    .join("\n");
}

export async function sendDiscordNotification(order: OrderNotificationData): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[notifications] DISCORD_WEBHOOK_URL manquant, notification Discord ignorée");
    return;
  }

  const embed = {
    title: `🛒 Nouvelle commande #${order.orderNumber}`,
    color: 0xa85e43,
    fields: [
      { name: "Client", value: `${order.customerName} (${order.customerPhone})`, inline: false },
      { name: "Adresse", value: order.deliveryAddress || "Non renseignée", inline: false },
      { name: "Articles", value: formatItemsList(order.items) || "Aucun", inline: false },
      { name: "Total", value: `${order.total.toLocaleString("fr-FR")} FCFA`, inline: false },
    ],
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!res.ok) {
      console.error(`[notifications] Discord a répondu ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("[notifications] Échec envoi Discord:", err);
  }
}

async function sendSingleEmail(order: OrderNotificationData, toEmail: string): Promise<void> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !privateKey || !publicKey) {
    console.error("[notifications] Config EmailJS incomplète, email ignoré");
    return;
  }

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: toEmail,
          order_number: order.orderNumber,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          delivery_address: order.deliveryAddress || "Non renseignée",
          items_list: formatItemsList(order.items),
          total: `${order.total.toLocaleString("fr-FR")} FCFA`,
        },
      }),
    });
    if (!res.ok) {
      console.error(`[notifications] EmailJS a répondu ${res.status} pour ${toEmail}: ${await res.text()}`);
    }
  } catch (err) {
    console.error(`[notifications] Échec envoi email à ${toEmail}:`, err);
  }
}

export async function sendEmailNotifications(order: OrderNotificationData): Promise<void> {
  const recipients = ["zoubeirou.zakariya@niger-laptops.com", "moctarhamadine54@gmail.com"];
  await Promise.all(recipients.map((email) => sendSingleEmail(order, email)));
}

export async function sendOrderNotifications(order: OrderNotificationData): Promise<void> {
  await Promise.allSettled([
    sendDiscordNotification(order),
    sendEmailNotifications(order),
  ]);
}
