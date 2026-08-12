import { useState, useEffect } from "react";
import {
  AdminProduct,
  ProductPayload,
  ProductSpec,
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "computers", label: "Ordinateurs" },
  { value: "storage", label: "Stockage" },
  { value: "accessories", label: "Accessoires" },
];

const CONDITIONS = [
  { value: "new", label: "Neuf" },
  { value: "used", label: "Occasion" },
];

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProduct | null;
  token: string;
  onSaved: () => void;
}

const emptyForm: ProductPayload = {
  nameFr: "",
  nameEn: "",
  category: "",
  condition: "",
  price: undefined,
  oldPrice: undefined,
  descriptionFr: "",
  descriptionEn: "",
  stockQuantity: 0,
  featured: false,
  specs: [],
};

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  token,
  onSaved,
}: ProductFormDialogProps) {
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        nameFr: product.nameFr,
        nameEn: product.nameEn,
        category: product.category,
        condition: product.condition,
        price: product.price ?? undefined,
        oldPrice: product.oldPrice ?? undefined,
        descriptionFr: product.descriptionFr ?? "",
        descriptionEn: product.descriptionEn ?? "",
        stockQuantity: product.stockQuantity,
        featured: product.featured,
        specs: product.specs ?? [],
      });
    } else {
      setForm(emptyForm);
    }
    setImageFile(null);
    setError(null);
  }, [product, open]);

  const specs = form.specs ?? [];

  const addSpec = () => {
    setForm({ ...form, specs: [...specs, { key: "", value: "" }] });
  };

  const updateSpec = (
    index: number,
    field: keyof ProductSpec,
    value: string
  ) => {
    const next = specs.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setForm({ ...form, specs: next });
  };

  const removeSpec = (index: number) => {
    setForm({ ...form, specs: specs.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const cleanedSpecs = specs.filter(s => s.key.trim() && s.value.trim());
      const payload = { ...form, specs: cleanedSpecs };
      let productId = product?.id;
      if (product) {
        await updateProduct(token, product.id, payload);
      } else {
        const res = await createProduct(token, payload);
        productId = res.data.id;
      }
      if (imageFile && productId) {
        await uploadProductImage(token, productId, imageFile);
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {product ? "Modifier le produit" : "Nouveau produit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameFr">Nom (FR)</Label>
              <Input
                id="nameFr"
                value={form.nameFr}
                onChange={e => setForm({ ...form, nameFr: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Nom (EN)</Label>
              <Input
                id="nameEn"
                value={form.nameEn}
                onChange={e => setForm({ ...form, nameEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={value => setForm({ ...form, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">État</Label>
              <Select
                value={form.condition}
                onValueChange={value => setForm({ ...form, condition: value })}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA)</Label>
              <Input
                id="price"
                type="number"
                value={form.price ?? ""}
                onChange={e =>
                  setForm({
                    ...form,
                    price: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={form.stockQuantity ?? 0}
                onChange={e =>
                  setForm({ ...form, stockQuantity: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descriptionFr">Description (FR)</Label>
            <Textarea
              id="descriptionFr"
              value={form.descriptionFr}
              onChange={e =>
                setForm({ ...form, descriptionFr: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Caractéristiques techniques</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpec}
              >
                <Plus size={14} className="mr-1" /> Ajouter
              </Button>
            </div>
            {specs.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Aucune caractéristique — ex: RAM, Processeur, Stockage...
              </p>
            )}
            <div className="space-y-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Clé (ex: RAM)"
                    value={spec.key}
                    onChange={e => updateSpec(idx, "key", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Valeur (ex: 16 Go)"
                    value={spec.value}
                    onChange={e => updateSpec(idx, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpec(idx)}
                    aria-label="Supprimer cette caractéristique"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Photo produit</Label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setImageFile(e.target.files?.[0] ?? null)}
            />
            {product?.thumbnail && !imageFile && (
              <p className="text-xs text-muted-foreground">
                Image actuelle conservée si aucun fichier choisi.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
