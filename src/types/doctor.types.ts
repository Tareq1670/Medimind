export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  image?: string;
  hospitalAffiliation: string;
  experienceYears: number;
  education?: string;
  bio?: string;
  isVerified: boolean;
  availability?: DaySchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFormData {
  name: string;
  specialty: string;
  consultationFee: number;
  hospitalAffiliation: string;
  experienceYears: number;
  education?: string;
  bio?: string;
  image?: string;
}

export interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorFilter {
  specialty?: string;
  search?: string;
  minRating?: number;
  maxFee?: number;
  isVerified?: boolean;
  sortBy?: "name" | "rating" | "consultationFee" | "experienceYears";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
