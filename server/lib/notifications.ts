interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  thumbnail: string | null;
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

const SITE_BASE_URL = "https://www.niger-laptops.com";

function formatItemsHtml(items: OrderItem[]): string {
  return items
    .map((i) => {
      const imgSrc = i.thumbnail
        ? encodeURI(`${SITE_BASE_URL}/${i.thumbnail}`)
        : null;
      const imgTag = imgSrc
        ? `<img src="${imgSrc}" alt="${i.productName}" width="60" height="60" style="object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:10px;">`
        : "";
      return `<div style="margin-bottom:8px;">${imgTag}<span>${i.productName} x${i.quantity} = ${i.lineTotal.toLocaleString("fr-FR")} FCFA</span></div>`;
    })
    .join("");
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
          items_html: formatItemsHtml(order.items),
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
  const recipients = ["zoubeirou.zakariya@gmail.com", "moctarhamadine54@gmail.com"];
  await Promise.all(recipients.map((email) => sendSingleEmail(order, email)));
}

export async function sendOrderNotifications(order: OrderNotificationData): Promise<void> {
  await Promise.allSettled([
    sendDiscordNotification(order),
    sendEmailNotifications(order),
  ]);
}


// --- Notifications de changement de statut (client) ---

interface StatusUpdateData {
  orderNumber: string;
  customerName: string;
  toEmail: string;
  status: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Votre commande est en attente de traitement.",
  confirmed: "Votre commande a été confirmée. Un livreur vous contactera bientôt pour confirmer votre adresse de livraison.",
  shipped: "Votre commande est en cours de livraison. Notre livreur vous contactera pour confirmer votre adresse avant son passage.",
  delivered: "Votre commande a été livrée. Merci pour votre confiance !",
  cancelled: "Votre commande a été annulée. N'hésitez pas à nous contacter pour plus d'informations.",
};

interface ReceiptEmailData {
  orderNumber: string;
  customerName: string;
  toEmail: string;
  receiptUrl: string;
  total: number;
}

export async function sendReceiptEmail(data: ReceiptEmailData): Promise<void> {
  // Réutilise le template de suivi de statut (EMAILJS_STATUS_TEMPLATE_ID),
  // faute de pouvoir créer un template dédié sur ce compte EmailJS.
  // Le bouton du template affichera "Suivre ma commande" (texte fixe du
  // template) mais pointera vers le reçu PDF — clarifié par le message.
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_STATUS_TEMPLATE_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !privateKey || !publicKey) {
    console.error("[notifications] Config EmailJS (reçu) incomplète, email ignoré");
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
          to_email: data.toEmail,
          order_number: data.orderNumber,
          customer_name: data.customerName,
          status_label: "✅ Paiement reçu",
          message: `Nous avons bien reçu votre paiement de ${data.total.toLocaleString("fr-FR")} FCFA. Cliquez sur le bouton ci-dessous pour télécharger votre reçu.`,
          tracking_url: data.receiptUrl,
        },
      }),
    });
    if (!res.ok) {
      console.error(`[notifications] EmailJS (reçu) a répondu ${res.status} pour ${data.toEmail}: ${await res.text()}`);
    }
  } catch (err) {
    console.error(`[notifications] Échec envoi email reçu à ${data.toEmail}:`, err);
  }
}

export async function sendOrderStatusUpdateEmail(data: StatusUpdateData): Promise<void> {
  if (!data.toEmail) {
    console.log(`[notifications] toEmail vide pour la commande ${data.orderNumber}, envoi ignoré`);
    return;
  }
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_STATUS_TEMPLATE_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !privateKey || !publicKey) {
    console.error("[notifications] Config EmailJS (statut) incomplète, email ignoré");
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
          to_email: data.toEmail,
          order_number: data.orderNumber,
          customer_name: data.customerName,
          status_label: STATUS_LABELS[data.status] ?? data.status,
          message: STATUS_MESSAGES[data.status] ?? "",
          tracking_url: `${SITE_BASE_URL}/suivi/${data.orderNumber}`,
        },
      }),
    });
    if (!res.ok) {
      console.error(`[notifications] EmailJS (statut) a répondu ${res.status} pour ${data.toEmail}: ${await res.text()}`);
    }
  } catch (err) {
    console.error(`[notifications] Échec envoi email statut à ${data.toEmail}:`, err);
  }
}
