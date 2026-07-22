export interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  description?: string;
  price: number;
  stockQuantity?: number;
  dosageForm?: string;
  strength?: string;
  category: string;
  isPrescriptionRequired: boolean;
  image?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFormData {
  name: string;
  genericName: string;
  manufacturer: string;
  description?: string;
  price: number;
  stockQuantity?: number;
  dosageForm?: string;
  strength?: string;
  category: string;
  isPrescriptionRequired: boolean;
  image?: string;
}

export interface MedicineCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface MedicineFilter {
  category?: string;
  search?: string;
  isPrescriptionRequired?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt" | "stockQuantity";
  sortOrder?: "asc" | "desc";
  stock?: "low" | "out";
  page?: number;
  limit?: number;
}
