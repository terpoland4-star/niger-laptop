export const company = {
  name: "Niger Laptops",
  tagline: "Votre expert informatique au Niger",
  taglineEn: "Your tech expert in Niger",

  // Informations légales (utilisées sur les CGV, la confidentialité, et les reçus)
  legal: {
    ownerName: "Zakariyaou Talatou Zoubeirou",
    rccm: "NE-NIM-01-2024-A10-00573",
    nif: "117816/P",
  },

  // Contact Information
  address:
    "Cité Sonuci, sur la latérite de chez Seyni Omar, en face de Nita et Amana, Niamey (Niger)",
  phone: ["+227 91 12 78 70", "+227 88 39 81 07"],
  email: ["zakariyaou@niger-laptops.com", "tech_support@niger-laptops.com"],

  // Social Media
  facebook: "https://www.facebook.com/100063546250480",
  googleMaps: "https://maps.app.goo.gl/AyfgGYvvXYMBTxBv8",
  website: "https://www.niger-laptops.com",

  // Developer Information
  developer: {
    name: "Hamadine AG MOCTAR",
    company: "HAM Global Words",
    phone: "+227 86 76 29 03",
    email: "hamadineagmoctar@gmail.com",
    address: "Tchangarey, Marché de Bétail, Niamey (Niger)",
  },

  // WhatsApp Configuration
  whatsapp: {
    defaultNumber: "+227 91 12 78 70",
    messageTemplate: (productName: string, imageUrl: string) =>
      `Bonjour Niger Laptops, je suis intéressé par le produit: ${productName}. Image: ${imageUrl}`,
  },
};

export const colors = {
  sahel: {
    sand: "oklch(0.85 0.08 70)",
    orange: "oklch(0.65 0.18 40)",
    earth: "oklch(0.25 0.04 60)",
    light: "oklch(0.95 0.02 70)",
    dark: "oklch(0.15 0.02 60)",
  },
};
