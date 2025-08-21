export interface Tag {
  _id?: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'reader';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Blog {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string | User;
  featuredImage?: string;
  tags: string[] | Tag[];
  categories: string[] | Category[];
  published: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'reader';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface BlogFilters {
  tag?: string;
  category?: string;
  published?: boolean;
}