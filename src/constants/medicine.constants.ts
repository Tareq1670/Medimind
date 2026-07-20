export const MEDICINE_CATEGORIES = [
  { id: "analgesics", name: "Analgesics", slug: "analgesics", description: "Pain relief medications", icon: "💊" },
  { id: "antibiotics", name: "Antibiotics", slug: "antibiotics", description: "Bacterial infection treatments", icon: "🔬" },
  { id: "cardiovascular", name: "Cardiovascular", slug: "cardiovascular", description: "Heart and blood pressure medications", icon: "❤️" },
  { id: "diabetes", name: "Diabetes", slug: "diabetes", description: "Diabetes management", icon: "🩸" },
  { id: "gastrointestinal", name: "Gastrointestinal", slug: "gastrointestinal", description: "Digestive health medications", icon: "🏥" },
  { id: "antihistamines", name: "Antihistamines", slug: "antihistamines", description: "Allergy relief medications", icon: "🤧" },
  { id: "anti-inflammatory", name: "Anti-inflammatory", slug: "anti-inflammatory", description: "Inflammation reduction medications", icon: "🩹" },
  { id: "respiratory", name: "Respiratory", slug: "respiratory", description: "Lung and breathing medications", icon: "🫁" },
  { id: "neurological", name: "Neurological", slug: "neurological", description: "Nervous system medications", icon: "🧠" },
  { id: "dermatological", name: "Dermatological", slug: "dermatological", description: "Skin care medications", icon: "🧴" },
  { id: "vitamins", name: "Vitamins & Supplements", slug: "vitamins", description: "Dietary supplements", icon: "💪" },
  { id: "other", name: "Other", slug: "other", description: "Other medications", icon: "📦" },
] as const;

export const MEDICINE_SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
  { label: "Price (Low to High)", value: "price_asc" },
  { label: "Price (High to Low)", value: "price_desc" },
  { label: "Rating (High to Low)", value: "rating_desc" },
  { label: "Newest First", value: "createdAt_desc" },
] as const;

export const MEDICINES_PER_PAGE = 12;
export const FEATURED_MEDICINES_LIMIT = 8;
