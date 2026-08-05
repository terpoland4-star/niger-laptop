import { company } from "@/data/company";

export const generateWhatsAppLink = (
  productName: string,
  imageUrl?: string,
  phoneNumber: string = company.whatsapp.defaultNumber
): string => {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const message = imageUrl
    ? `Bonjour Niger Laptops, je suis intéressé par: ${productName}\n\nImage: ${imageUrl}`
    : `Bonjour Niger Laptops, je suis intéressé par: ${productName}`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

export const generateWishlistWhatsAppLink = (
  products: Array<{ name: string; imageUrl?: string }>,
  phoneNumber: string = company.whatsapp.defaultNumber
): string => {
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  let message = "Bonjour Niger Laptops, voici ma liste d'intérêt:\n\n";
  products.forEach((product, index) => {
    message += `${index + 1}. ${product.name}`;
    if (product.imageUrl) {
      message += `\n   Image: ${product.imageUrl}`;
    }
    message += "\n";
  });

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};

export const openWhatsAppChat = (
  productName: string,
  imageUrl?: string,
  phoneNumber?: string
): void => {
  const link = generateWhatsAppLink(productName, imageUrl, phoneNumber);
  window.open(link, "_blank");
};

export const openWishlistChat = (
  products: Array<{ name: string; imageUrl?: string }>,
  phoneNumber?: string
): void => {
  const link = generateWishlistWhatsAppLink(products, phoneNumber);
  window.open(link, "_blank");
};
