export interface Blog {
  _id: string;
  title: string;
  content?: string;
  excerpt?: string;
  tags: string[];
  coverImage?: string;
  authorId: PopulatedUser | string;
  author?: PopulatedUser;
  status: "Draft" | "Published" | "Archived";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  tags: string[];
  coverImage?: string;
  status?: "Draft" | "Published";
}

export interface BlogFilter {
  status?: string;
  tag?: string;
  search?: string;
  authorId?: string;
  sortBy?: "title" | "createdAt" | "viewCount";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
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
