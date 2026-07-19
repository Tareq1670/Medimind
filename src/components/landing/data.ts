export interface LandingMedicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  isPrescriptionRequired: boolean;
}

export interface LandingDoctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  rating: number;
  image: string;
  hospitalAffiliation: string;
  experienceYears: number;
  isVerified: boolean;
}

export interface LandingBlog {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  authorName: string;
  authorImage: string;
  date: string;
  coverImage: string;
}

export interface LandingTestimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  condition: string;
}

export const featuredMedicines: LandingMedicine[] = [
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    manufacturer: "Square Pharmaceuticals",
    price: 5.99,
    rating: 4.8,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Analgesics",
    isPrescriptionRequired: false,
  },
  {
    id: "med-2",
    name: "Amoxicillin 250mg",
    genericName: "Amoxicillin Trihydrate",
    manufacturer: "Beximco Pharmaceuticals",
    price: 12.49,
    rating: 4.6,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Antibiotics",
    isPrescriptionRequired: true,
  },
  {
    id: "med-3",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    manufacturer: "Incepta Pharmaceuticals",
    price: 8.99,
    rating: 4.7,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Gastrointestinal",
    isPrescriptionRequired: false,
  },
  {
    id: "med-4",
    name: "Atorvastatin 10mg",
    genericName: "Atorvastatin Calcium",
    manufacturer: "Healthcare Pharmaceuticals",
    price: 15.99,
    rating: 4.5,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Cardiovascular",
    isPrescriptionRequired: true,
  },
  {
    id: "med-5",
    name: "Metformin 500mg",
    genericName: "Metformin Hydrochloride",
    manufacturer: "ACI Pharmaceuticals",
    price: 6.49,
    rating: 4.9,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Diabetes",
    isPrescriptionRequired: true,
  },
  {
    id: "med-6",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride",
    manufacturer: "Renata Pharmaceuticals",
    price: 4.99,
    rating: 4.4,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Antihistamines",
    isPrescriptionRequired: false,
  },
  {
    id: "med-7",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine Besylate",
    manufacturer: "Opsonin Pharma",
    price: 9.99,
    rating: 4.6,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Cardiovascular",
    isPrescriptionRequired: true,
  },
  {
    id: "med-8",
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    manufacturer: "Aristopharma",
    price: 7.49,
    rating: 4.3,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    category: "Anti-inflammatory",
    isPrescriptionRequired: false,
  },
];

export const featuredDoctors: LandingDoctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Rahman",
    specialty: "Cardiology",
    consultationFee: 50,
    rating: 4.9,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: "National Heart Institute",
    experienceYears: 18,
    isVerified: true,
  },
  {
    id: "doc-2",
    name: "Dr. James Mitchell",
    specialty: "Neurology",
    consultationFee: 65,
    rating: 4.8,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: "Advanced Neuroscience Center",
    experienceYears: 22,
    isVerified: true,
  },
  {
    id: "doc-3",
    name: "Dr. Priya Sharma",
    specialty: "Dermatology",
    consultationFee: 40,
    rating: 4.7,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: "Skin Care Institute",
    experienceYears: 14,
    isVerified: true,
  },
  {
    id: "doc-4",
    name: "Dr. Michael Chen",
    specialty: "Pediatrics",
    consultationFee: 45,
    rating: 4.9,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: "Children's Health Hospital",
    experienceYears: 16,
    isVerified: true,
  },
  {
    id: "doc-5",
    name: "Dr. Ayesha Khan",
    specialty: "Orthopedics",
    consultationFee: 55,
    rating: 4.6,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: "Bone & Joint Specialists",
    experienceYears: 20,
    isVerified: true,
  },
  {
    id: "doc-6",
    name: "Dr. Robert Torres",
    specialty: "Ophthalmology",
    consultationFee: 35,
    rating: 4.5,
    image: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    hospitalAffiliation: "Vision Care Center",
    experienceYears: 12,
    isVerified: true,
  },
];

export const latestBlogs: LandingBlog[] = [
  {
    id: "blog-1",
    title: "Understanding the Link Between Gut Health and Mental Wellbeing",
    excerpt:
      "Recent studies reveal a profound connection between your digestive system and brain function. Learn how the gut-brain axis influences mood, cognition, and overall mental health.",
    tags: ["Gut Health", "Mental Health", "Research"],
    authorName: "Dr. Emily Watson",
    authorImage: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    date: "2026-07-14",
    coverImage: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
  },
  {
    id: "blog-2",
    title: "AI in Healthcare: How Machine Learning Is Transforming Diagnosis",
    excerpt:
      "From radiology to pathology, artificial intelligence is reshaping how medical professionals detect and diagnose diseases. Explore the cutting-edge AI tools making healthcare more accurate.",
    tags: ["AI Technology", "Diagnostics", "Innovation"],
    authorName: "Prof. Alan Turing Jr.",
    authorImage: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    date: "2026-07-10",
    coverImage: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
  },
  {
    id: "blog-3",
    title: "Seasonal Allergy Guide: Symptoms, Treatment, and Prevention",
    excerpt:
      "Spring brings blooming flowers and seasonal allergies. Our comprehensive guide covers everything from identifying common triggers to the latest antihistamine treatments.",
    tags: ["Allergies", "Seasonal Health", "Treatment"],
    authorName: "Dr. Maria Gomez",
    authorImage: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
    date: "2026-07-05",
    coverImage: "https://i.ibb.co/n610Bc4/paracetamol.jpg",
  },
];

export const testimonials: LandingTestimonial[] = [
  {
    id: "rev-1",
    name: "David Kim",
    rating: 5,
    text: "MediMind's AI symptom checker accurately identified my condition before I even visited a doctor. The platform is intuitive and the response time was incredible. Highly recommended for anyone seeking quick medical guidance.",
    date: "2026-06-28",
    condition: "Respiratory Infection",
  },
  {
    id: "rev-2",
    name: "Lisa Thompson",
    rating: 5,
    text: "The report analysis feature saved me hours of waiting. I uploaded my lab results and received a detailed breakdown within minutes. The platform's ability to explain complex medical data in plain language is remarkable.",
    date: "2026-06-20",
    condition: "Annual Checkup",
  },
  {
    id: "rev-3",
    name: "Raj Patel",
    rating: 4,
    text: "Booking consultations through MediMind is seamless. I found an excellent cardiologist and had a video appointment within 24 hours. The prescription management feature is incredibly convenient for ongoing treatments.",
    date: "2026-06-15",
    condition: "Cardiology Follow-up",
  },
  {
    id: "rev-4",
    name: "Amanda Foster",
    rating: 5,
    text: "As someone managing a chronic condition, MediMind has been a game changer. Tracking my vitals and medications in one place, plus having AI-powered insights about my health trends gives me peace of mind every day.",
    date: "2026-06-08",
    condition: "Diabetes Management",
  },
];
