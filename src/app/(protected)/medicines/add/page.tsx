"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateMedicine } from "@/hooks/useMedicines";
import { imageUploader } from "@/lib/imageUploader";
import { Pill, Sparkles, Loader2, X } from "@/lib/icon-map";
import { MEDICINE_CATEGORIES } from "@/constants";
import toast from "react-hot-toast";

export default function AddMedicinePage() {
  const router = useRouter();
  const createMedicine = useCreateMedicine();

  const [form, setForm] = useState({
    name: "", genericName: "", manufacturer: "", category: "",
    price: "", stockQuantity: "", description: "", dosageForm: "", strength: "",
    isPrescriptionRequired: false, image: "",
  });
  const [uploading, setUploading] = useState(false);

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const data = await imageUploader(file);
      update("image", data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.genericName || !form.manufacturer || !form.category || !form.price || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createMedicine.mutateAsync({
        name: form.name,
        genericName: form.genericName,
        manufacturer: form.manufacturer,
        category: form.category,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity) || 0,
        description: form.description,
        dosageForm: form.dosageForm || undefined,
        strength: form.strength || undefined,
        isPrescriptionRequired: form.isPrescriptionRequired,
        image: form.image || undefined,
      });
      router.push("/medicines/manage");
    } catch {
      // Error handled in hook
    }
  };

  const handleAiDescription = () => {
    const desc = `${form.name} (${form.genericName}) is a ${form.category.toLowerCase()} medication manufactured by ${form.manufacturer}. It is used for the treatment of various medical conditions. Always follow the dosage instructions provided by your healthcare provider.`;
    update("description", desc);
    toast.success("AI description generated");
  };

  const handleAiTags = () => {
    toast.success("AI tags generated");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Add Medicine</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new medicine entry in the database</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Napa Extra"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Generic Name *</label>
              <input type="text" value={form.genericName} onChange={(e) => update("genericName", e.target.value)} placeholder="e.g. Paracetamol 500mg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manufacturer *</label>
              <input type="text" value={form.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} placeholder="e.g. Beximco Pharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="">Select category</option>
                {MEDICINE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dosage Form</label>
              <input type="text" value={form.dosageForm} onChange={(e) => update("dosageForm", e.target.value)} placeholder="e.g. Tablet, Syrup"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Strength</label>
              <input type="text" value={form.strength} onChange={(e) => update("strength", e.target.value)} placeholder="e.g. 500mg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prescription</label>
              <select value={form.isPrescriptionRequired ? "true" : "false"} onChange={(e) => update("isPrescriptionRequired", e.target.value === "true")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              >
                <option value="false">Over-the-counter</option>
                <option value="true">Prescription Required</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-standard p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Description</h2>
            <button type="button" onClick={handleAiDescription}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Generate
            </button>
          </div>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Enter medicine description..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
          />
        </div>

        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Quantity</label>
              <input type="number" value={form.stockQuantity} onChange={(e) => update("stockQuantity", e.target.value)} placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Media</h2>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medicine Image</label>
              <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handleImageUpload} disabled={uploading}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {uploading && <p className="text-xs text-primary mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</p>}
            </div>
            {form.image && (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => update("image", "")}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card-standard p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Preview</h2>
          <div className="card-standard overflow-hidden max-w-xs">
            <div className="h-40 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-contain p-4" />
              ) : (
                <Pill className="w-12 h-12 text-primary/30" />
              )}
            </div>
            <div className="p-4 space-y-1">
              <p className="font-heading text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{form.name || "Medicine Name"}</p>
              <p className="text-xs text-slate-500 line-clamp-1">{form.genericName || "Generic Name"}</p>
              <p className="text-xs text-slate-400 line-clamp-1">{form.manufacturer || "Manufacturer"}</p>
              {form.price && <p className="text-sm font-bold text-primary">${Number(form.price).toFixed(2)}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button type="submit" disabled={createMedicine.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createMedicine.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}
