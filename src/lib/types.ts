export type Event = {
  id?: number;
  external_id?: number | null;
  name: string;
  dates?: string | null;
  location?: string | null;
  description?: string | null;
  event_type?: string | null;
  target_audience?: string | null;
};

export type News = {
  id?: number;
  external_id?: number | null;
  news_date?: string | null;
  location?: string | null;
  title: string;
  category?: string | null;
  startup_id?: number | null;
};

export type NewsDetail = {
  id?: number;
  external_id?: number | null;
  slug_url: string;
  news_date?: string | null;
  location?: string | null;
  title: string;
  category?: string | null;
  startup_id?: number | null;
  description: string;
};

export type Partner = {
  id?: number;
  external_id?: number | null;
  name: string;
  legal_status?: string | null;
  address?: string | null;
  email: string;
  phone?: string | null;
  created_at?: string | null;
  description?: string | null;
  partnership_type?: string | null;
};

export type StartupDetail = {
  id?: number;
  external_id?: number | null;
  name: string;
  slug_url: string;
  legal_status?: string | null;
  address?: string | null;
  email: string;
  phone?: string | null;
  created_at?: string | null;
  website_url?: string | null;
  social_media_url?: string | null;
  project_status?: string | null;
  description?: string | null;
  needs?: string | null;
  sector?: string | null;
  maturity?: string | null;
  founders: Founder[];
};

export type StartupList = {
  id?: number;
  external_id?: number | null;
  name: string;
  legal_status?: string | null;
  description?: string | null;
  address?: string | null;
  email: string;
  phone?: string | null;
  sector?: string | null;
  maturity?: string | null;
};

export type Founder = {
  id?: number;
  external_id?: number | null;
  name: string;
  startup_id: number;
};

export type Investor = {
  id?: number;
  external_id?: number | null;
  name: string;
  legal_status?: string | null;
  address?: string | null;
  email: string;
  phone?: string | null;
  created_at?: string | null;
  description?: string | null;
  investor_type?: string | null;
  investment_focus?: string | null;
};

export type User = {
  id?: number;
  external_id?: number | null;
  email: string;
  name: string;
  role: string;
  founder_id?: number | null;
  investor_id?: number | null;
};

export type PrismaModelWithCreateMany = {
  deleteMany: (args?: any) => Promise<any>;
  createMany: (args: { data: any[]; skipDuplicates?: undefined }) => Promise<any>;
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any | null>;
  create: (args: { data: any }) => Promise<any>;
  update: (args: { where: any; data: any }) => Promise<any>;
  delete: (args: { where: any }) => Promise<any>;
};
