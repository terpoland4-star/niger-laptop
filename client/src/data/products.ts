export interface Product {
  id: number;
  nameEn: string;
  nameFr: string;
  category: "computers" | "storage" | "accessories";
  condition: "neuf" | "occasion";
  price: number; // in FCFA
  image: string;
  facebookUrl?: string;
  description?: string;
}

export const products: Product[] = [
  // Ordinateurs (16)
  {
    id: 1,
    nameEn: "HP Victus 15-fb3093dx",
    nameFr: "HP Victus 15-fb3093dx",
    category: "computers",
    condition: "neuf",
    price: 820000,
    image: "hp-victus-15-fb3093dx.jpg",
    description: "Powerful gaming laptop with high performance processor and dedicated graphics"
  },
  {
    id: 2,
    nameEn: "HP ProBook 450 G7",
    nameFr: "HP ProBook 450 G7",
    category: "computers",
    condition: "occasion",
    price: 350000,
    image: "hp-probook-450-g7.jpg",
    description: "Professional business laptop, well-maintained"
  },
  {
    id: 3,
    nameEn: "HP ProBook 450 G8",
    nameFr: "HP ProBook 450 G8",
    category: "computers",
    condition: "neuf",
    price: 300000,
    image: "HP ProBook 450 G8..jpg",
    description: "Latest HP ProBook model with enhanced performance"
  },
  {
    id: 4,
    nameEn: "Lenovo ThinkPad X13 Yoga",
    nameFr: "Lenovo ThinkPad X13 Yoga",
    category: "computers",
    condition: "neuf",
    price: 250000,
    image: "Lenovo ThinkPad X13 Yoga..jpg",
    description: "Premium 2-in-1 convertible laptop with touchscreen"
  },
  {
    id: 5,
    nameEn: "Lenovo ThinkPad X1 Yoga",
    nameFr: "Lenovo ThinkPad X1 Yoga",
    category: "computers",
    condition: "neuf",
    price: 230000,
    image: "Lenovo ThinkPad X1 Yoga.jpg",
    description: "Premium business 2-in-1 with exceptional build quality"
  },
  {
    id: 6,
    nameEn: "Lenovo ThinkPad T470S",
    nameFr: "Lenovo ThinkPad T470S",
    category: "computers",
    condition: "occasion",
    price: 200000,
    image: "Lenovo ThinkPad T470S.jpg",
    description: "Reliable business ultrabook, excellent condition"
  },
  {
    id: 7,
    nameEn: "Lenovo ThinkPad T14",
    nameFr: "Lenovo ThinkPad T14",
    category: "computers",
    condition: "neuf",
    price: 350000,
    image: "Lenovo ThinkPad T14.jpg",
    description: "Compact professional laptop with excellent performance"
  },
  {
    id: 8,
    nameEn: "Lenovo ThinkPad T14 Gen",
    nameFr: "Lenovo ThinkPad T14 Gen",
    category: "computers",
    condition: "neuf",
    price: 350000,
    image: "Lenovo ThinkPad T14 Gen.jpg",
    description: "Latest generation ThinkPad T14 with improved specs"
  },
  {
    id: 9,
    nameEn: "Lenovo ThinkBook 15 G2",
    nameFr: "Lenovo ThinkBook 15 G2",
    category: "computers",
    condition: "neuf",
    price: 400000,
    image: "LENOVO ThinkBook 15 G2..jpg",
    description: "Versatile 15-inch laptop for work and entertainment"
  },
  {
    id: 10,
    nameEn: "HP All-in-One 24 inches",
    nameFr: "HP Tout-en-un 24 pouces",
    category: "computers",
    condition: "neuf",
    price: 600000,
    image: "HP Tout-en-un de 24 pouces.jpg",
    description: "Complete desktop solution with integrated display"
  },
  {
    id: 11,
    nameEn: "HP ProBook Core i5 (14 inches)",
    nameFr: "HP ProBook Core i5 (14 pouces)",
    category: "computers",
    condition: "neuf",
    price: 250000,
    image: "hp-probook-core-i5-14.jpg",
    facebookUrl: "https://www.facebook.com/100063546250480/posts/898423685619165/",
    description: "Compact professional laptop with Intel Core i5"
  },
  {
    id: 12,
    nameEn: "DELL Latitude 7480 Core i7",
    nameFr: "DELL Latitude 7480 Core i7",
    category: "computers",
    condition: "occasion",
    price: 250000,
    image: "dell-latitude-7480-core-i7.jpg",
    facebookUrl: "https://www.facebook.com/100063546250480/posts/898431468951720/",
    description: "Enterprise-grade laptop with powerful i7 processor"
  },
  {
    id: 13,
    nameEn: "HP ProBook Core i5 (2nd version)",
    nameFr: "HP ProBook Core i5 (2e version)",
    category: "computers",
    condition: "neuf",
    price: 250000,
    image: "hp-probook-core-i5-14-2.jpg",
    facebookUrl: "https://www.facebook.com/100063546250480/posts/1636844288443764/",
    description: "Updated HP ProBook with enhanced features"
  },
  {
    id: 14,
    nameEn: "Lenovo ThinkPad L13 Core i5 11th Gen",
    nameFr: "Lenovo ThinkPad L13 Core i5 11e génération",
    category: "computers",
    condition: "neuf",
    price: 300000,
    image: "lenovo-thinkpad-l13-core-i5-11e.jpg",
    facebookUrl: "https://www.facebook.com/100063546250480/posts/1636800595114800/",
    description: "Latest generation ThinkPad L13 with 11th gen Intel"
  },
  {
    id: 15,
    nameEn: "Lenovo ThinkPad L13 Yoga Core i5 10th Gen",
    nameFr: "Lenovo ThinkPad L13 Yoga Core i5 10e génération",
    category: "computers",
    condition: "neuf",
    price: 280000,
    image: "lenovo-thinkpad-l13-yoga-core-i5-10e.jpg",
    facebookUrl: "https://www.facebook.com/100063546250480/posts/1636797261781800/",
    description: "Convertible ThinkPad L13 Yoga with 10th gen Intel"
  },
  {
    id: 16,
    nameEn: "AirPods Pro 2nd Generation",
    nameFr: "AirPods Pro 2e génération",
    category: "computers",
    condition: "neuf",
    price: 18000,
    image: "airpods-pro-2e-gen.jpg",
    facebookUrl: "https://www.facebook.com/100063546250480/posts/1636827308445462/",
    description: "Premium wireless earbuds with active noise cancellation"
  },

  // Stockage (3)
  {
    id: 17,
    nameEn: "Samsung Galaxy Tab S9 FE+",
    nameFr: "Samsung Galaxy Tab S9 FE+",
    category: "storage",
    condition: "neuf",
    price: 230000,
    image: "Samsung Galaxy Tab S9 FE+ (Fan Edition Plus)..jpg",
    description: "Large 13-inch tablet with excellent display"
  },
  {
    id: 18,
    nameEn: "Samsung Galaxy Tab A9+ 128GB",
    nameFr: "Samsung Galaxy Tab A9+ 128 Go",
    category: "storage",
    condition: "neuf",
    price: 185000,
    image: "Samsung Galaxy TAB A9+ ROM8_128GB.jpg",
    description: "Versatile tablet with 128GB storage"
  },
  {
    id: 19,
    nameEn: "Samsung Galaxy Tab A8",
    nameFr: "Samsung Galaxy Tab A8",
    category: "storage",
    condition: "occasion",
    price: 175000,
    image: "Samsung Galaxy TAB A8.jpg",
    description: "Reliable tablet in excellent condition"
  },

  // Accessoires
  {
    id: 20,
    nameEn: "Canon EOS R6",
    nameFr: "Canon EOS R6",
    category: "accessories",
    condition: "neuf",
    price: 450000,
    image: "Canon EOS R6.jpg",
    description: "Professional mirrorless camera with full-frame sensor"
  },
  {
    id: 21,
    nameEn: "Nikon D5300",
    nameFr: "Nikon D5300",
    category: "accessories",
    condition: "occasion",
    price: 500000,
    image: "Nikon D5300..jpg",
    description: "DSLR camera, well-maintained"
  },
  {
    id: 22,
    nameEn: "JBL Flip 7 Bluetooth Speaker",
    nameFr: "Enceinte Bluetooth JBL Flip 7",
    category: "accessories",
    condition: "neuf",
    price: 25000,
    image: "enceintes Bluetooth JBL Flip 7.jpg",
    description: "Portable waterproof Bluetooth speaker"
  },
  {
    id: 23,
    nameEn: "Grandstream GWN7664ELR",
    nameFr: "Grandstream GWN7664ELR",
    category: "accessories",
    condition: "neuf",
    price: 0, // Prix sur demande
    image: "Grandstream GWN7664ELR..jpg",
    description: "Professional network router"
  },
  {
    id: 24,
    nameEn: "Ruijie Reyee RG-AirMetro460F",
    nameFr: "Ruijie Reyee RG-AirMetro460F",
    category: "accessories",
    condition: "neuf",
    price: 0, // Prix sur demande
    image: "Ruijie Reyee RG-AirMetro460F..jpg",
    description: "Advanced wireless access point"
  },
  {
    id: 25,
    nameEn: "MikroTik hAP ax²",
    nameFr: "MikroTik hAP ax²",
    category: "accessories",
    condition: "neuf",
    price: 0, // Prix sur demande
    image: "MikroTik hAP ax² C52iG-5HaxD2HaxD-TC.jpg",
    description: "Dual-band wireless router with excellent range"
  },
  {
    id: 26,
    nameEn: "Epson EB-535W Projector",
    nameFr: "Vidéoprojecteur Epson EB-535W",
    category: "accessories",
    condition: "neuf",
    price: 300000,
    image: "vidéoprojecteur Epson EB-535W.jpg",
    description: "Professional projector for presentations"
  },
  {
    id: 27,
    nameEn: "HP Laser MFP 137fnw Printer",
    nameFr: "Imprimante HP Laser MFP 137fnw",
    category: "accessories",
    condition: "neuf",
    price: 350000,
    image: "imprimante HP Laser MFP 137fnw..jpg",
    description: "Multifunction laser printer with network connectivity"
  },
  {
    id: 28,
    nameEn: "Huafon ESS P600 600W",
    nameFr: "Huafon ESS P600",
    category: "accessories",
    condition: "neuf",
    price: 0, // Prix sur demande
    image: "Huafon ESS P600 de 600 watts..jpg",
    description: "Portable power station 600W"
  },
  {
    id: 29,
    nameEn: "Starlink Mini Roof Mount",
    nameFr: "Support de toit Starlink Mini",
    category: "accessories",
    condition: "neuf",
    price: 25000,
    image: "Support de toit Starlink Mini.jpg",
    description: "Mounting bracket for Starlink Mini"
  },
  {
    id: 30,
    nameEn: "RECRSI RE-S680",
    nameFr: "RECRSI RE-S680",
    category: "accessories",
    condition: "occasion",
    price: 15000,
    image: "RECRSI RE-S680 .jpg",
    description: "Professional audio equipment"
  },
  {
    id: 31,
    nameEn: "Baofeng BF-888S Walkie Talkie",
    nameFr: "Talkies-walkies Baofeng BF-888S",
    category: "accessories",
    condition: "neuf",
    price: 25000,
    image: "talkies-walkies Baofeng BF-888S..jpg",
    description: "Portable two-way radio communication"
  },
  {
    id: 32,
    nameEn: "Sony DualShock 4 Controller",
    nameFr: "Sony DualShock 4",
    category: "accessories",
    condition: "neuf",
    price: 20000,
    image: "Sony DualShock 4.jpg",
    description: "Wireless gaming controller for PlayStation"
  },
  {
    id: 33,
    nameEn: "Logitech GROUP Video Conference System",
    nameFr: "Logitech GROUP système de vidéoconférence",
    category: "accessories",
    condition: "neuf",
    price: 450000,
    image: "Logitech GROUP système de vidéoconférence.jpg",
    description: "Professional video conferencing solution"
  },
  {
    id: 34,
    nameEn: "Kisan Newton III Bill Counter",
    nameFr: "Trieuse de billets Kisan Newton III",
    category: "accessories",
    condition: "occasion",
    price: 1500000,
    image: "trieuse de billets Kisan Newton III .jpg",
    description: "Professional currency counting machine"
  },
  {
    id: 35,
    nameEn: "SanDisk Extreme Portable SSD 4TB",
    nameFr: "SSD Portable SanDisk Extreme 4 To",
    category: "accessories",
    condition: "neuf",
    price: 200000,
    image: "sandisk-extreme-ssd-4tb.jpg",
    description: "Up to 1050MB/s speed, water resistant, compatible with Windows and Mac"
  },
  {
    id: 36,
    nameEn: "Samsung 45W USB-C PD Adapter",
    nameFr: "Chargeur Samsung 45W USB-C",
    category: "accessories",
    condition: "neuf",
    price: 12000,
    image: "samsung-45w-pd-adapter.jpg",
    description: "Original Samsung fast charger, USB-C Power Delivery 45W"
  },
  {
    id: 37,
    nameEn: "Samsung 25W USB-C PD Adapter",
    nameFr: "Chargeur Samsung 25W USB-C",
    category: "accessories",
    condition: "neuf",
    price: 10000,
    image: "samsung-25w-pd-adapter.jpg",
    description: "Original Samsung fast charger, USB-C Power Delivery 25W"
  },
  {
    id: 38,
    nameEn: "USB-C to HDTV 11-in-1 Hub",
    nameFr: "Hub USB-C vers HDTV 11-en-1",
    category: "accessories",
    condition: "neuf",
    price: 15000,
    image: "usb-c-hdtv-11-in-1-hub.jpg",
    description: "LAN, 4K HDTV, USB 3.0, VGA, SD card reader - connect your USB-C computer to an HDTV display"
  },
  {
    id: 39,
    nameEn: "Oraimo Watch 4 Plus Smartwatch",
    nameFr: "Montre connectée Oraimo Watch 4 Plus",
    category: "accessories",
    condition: "neuf",
    price: 35000,
    image: "oraimo-watch-4-plus.jpg",
    description: "2.01\" full-touch HD screen, wireless call, 24h health monitoring"
  },
  {
    id: 40,
    nameEn: "Logitech M185 Wireless Mouse",
    nameFr: "Souris sans fil Logitech M185",
    category: "accessories",
    condition: "neuf",
    price: 10000,
    image: "logitech-m185-mouse.jpg",
    description: "Plug-and-play wireless mouse, 12-month battery life"
  },
  {
    id: 41,
    nameEn: "HP CS10 Wireless Keyboard & Mouse Combo",
    nameFr: "Ensemble clavier et souris sans fil HP CS10",
    category: "accessories",
    condition: "neuf",
    price: 20000,
    image: "hp-cs10-keyboard-mouse.jpg",
    description: "2.4GHz wireless, nano receiver, tilt-adjustable keyboard legs"
  },
  {
    id: 42,
    nameEn: "Laptop Sleeves (Various Colors & Sizes)",
    nameFr: "Housses pour laptop (plusieurs coloris/tailles)",
    category: "accessories",
    condition: "neuf",
    price: 10000,
    image: "housses-laptop.jpg",
    description: "Padded protective laptop sleeve, multiple colors and sizes available"
  },
  {
    id: 43,
    nameEn: "Laptop Backpacks",
    nameFr: "Sacs à dos pour laptop",
    category: "accessories",
    condition: "neuf",
    price: 13000,
    image: "sacs-a-dos-laptop.jpg",
    description: "Professional laptop backpacks, several models available (ThinkPad, ThinkBook and generic)"
  },
  {
    id: 44,
    nameEn: "Laptop Messenger Bags",
    nameFr: "Sacoches pour laptop",
    category: "accessories",
    condition: "neuf",
    price: 10000,
    image: "sacoches-laptop.jpg",
    description: "Laptop messenger bags and briefcases with shoulder strap, several models available"
  },
  {
    id: 45,
    nameEn: "Canon imageCLASS LBP6018L+ Printer",
    nameFr: "Imprimante laser Canon imageCLASS LBP6018L+",
    category: "accessories",
    condition: "neuf",
    price: 185000,
    image: "canon-imageclass-lbp6018l.jpg",
    description: "Black & white laser printer, USB 2.0, cartridge 925"
  },
  {
    id: 46,
    nameEn: "Canon i-SENSYS LBP6030B Printer",
    nameFr: "Imprimante laser Canon i-SENSYS LBP6030B",
    category: "accessories",
    condition: "neuf",
    price: 0, // Prix sur demande
    image: "canon-isensys-lbp6030b.jpg",
    description: "Black & white laser printer, quick first-print, cartridge 725"
  },
  {
    id: 47,
    nameEn: "Lexar NS100 1TB SSD",
    nameFr: "SSD Lexar NS100 1 To",
    category: "accessories",
    condition: "neuf",
    price: 50000,
    image: "lexar-ns100-1tb.jpg",
    description: "2.5\" SATA 6Gb/s SSD, fast and reliable"
  },
  {
    id: 48,
    nameEn: "HP Series 5 527sf Monitor 27\"",
    nameFr: "Moniteur HP Series 5 527sf 27\"",
    category: "accessories",
    condition: "neuf",
    price: 200000,
    image: "hp-527sf-monitor.jpg",
    description: "27-inch FHD monitor, 100Hz refresh rate, low blue light"
  },
  {
    id: 49,
    nameEn: "HP Series 5 524sf Monitor 23.8\"",
    nameFr: "Moniteur HP Series 5 524sf 23.8\"",
    category: "accessories",
    condition: "neuf",
    price: 185000,
    image: "hp-524sf-monitor.jpg",
    description: "23.8-inch FHD monitor, 100Hz refresh rate, Chromebook compatible"
  }
];

export const categories = {
  computers: { en: "Computers", fr: "Ordinateurs" },
  storage: { en: "Storage", fr: "Stockage" },
  accessories: { en: "Accessories", fr: "Accessoires" }
};

export const conditions = {
  neuf: { en: "New", fr: "Neuf" },
  occasion: { en: "Used", fr: "Occasion" }
};
