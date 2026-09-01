import { getProductDetail } from "./services/products";
import { resolveImageUrl } from "./lib/images";

export interface HeadData {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
  jsonLd: object | null;
  notFound?: boolean;
  initialData?: { key: string; value: unknown } | null;
}

const DEFAULT_HEAD: Omit<HeadData, "canonical"> = {
  title: "Niger Laptops - Votre expert informatique au Niger",
  description:
    "Ordinateurs portables, PC, stockage et accessoires informatiques neufs et occasion à Niamey. Qualité vérifiée, livraison au Niger, paiement sécurisé.",
  ogImage: "https://www.niger-laptops.com/logolap.png",
  jsonLd: null,
};

export async function resolveHead(url: string): Promise<HeadData> {
  const canonical = `https://www.niger-laptops.com${url}`;

  const productMatch = url.match(/^\/produit\/([^/?]+)/);
  if (productMatch) {
    const product = await getProductDetail(productMatch[1]);

    if (!product) {
      return {
        title: "Produit introuvable — Niger Laptops",
        description: "Ce produit n'est plus disponible ou n'existe pas.",
        ogImage: DEFAULT_HEAD.ogImage,
        canonical,
        jsonLd: null,
        notFound: true,
      };
    }

    return {
      title: `${product.nameFr} — Niger Laptops`,
      description: (product.descriptionFr ?? DEFAULT_HEAD.description).slice(0, 155),
      ogImage: resolveImageUrl(product.thumbnail) || DEFAULT_HEAD.ogImage,
      canonical,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.nameFr,
        image: resolveImageUrl(product.thumbnail),
        ...(product.specs?.length
          ? {
              additionalProperty: product.specs.map((s: { key: string; value: string }) => ({
                "@type": "PropertyValue",
                name: s.key,
                value: s.value,
              })),
            }
          : {}),
        offers: {
          "@type": "Offer",
          priceCurrency: "XOF",
          price: product.price,
          availability: (product.stockQuantity ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      },
      initialData: { key: `product:${product.id}`, value: product },
    };
  }

  return { ...DEFAULT_HEAD, canonical };
}
