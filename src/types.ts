export type LanguageCode = 
  | 'ku' | 'kiu' | 'ckb' // Kurdish: Kurmanji, Zazaki, Sorani
  | 'en' | 'tr' | 'ar' | 'fa' // English, Turkish, Arabic, Persian
  | 'es' | 'it' | 'fr' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko' | 'de'; // Global

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export interface DictionaryResult {
  category: string;
  type: string;
  term: string;
  targetLang: LanguageCode; // Added to track which language this result belongs to
  gender?: string; // 'nêr' (Masc) | 'mê' (Fem) for Kurmanji/Zazaki nouns
  definition: string;
  example_source: string;
  example_target: string;
  transliteration?: string; // For Sorani/Persian/Arabic if needed
}

export interface SearchHistoryItem {
  id: string;
  word: string;
  sourceLang: LanguageCode;
  targetLangs: LanguageCode[]; // Changed to support multiple target languages
  timestamp: number;
}

export interface FavoriteItem {
  id: string;
  term: string;
  sourceLang: LanguageCode;
  targetLangs: LanguageCode[]; // Changed to support multiple target languages
  timestamp: number;
}

export type UserRole = 'admin' | 'user';

export interface Subscription {
  status: 'free' | 'premium' | 'cancelled';
  plan: string;
  subscription_status: string;
  subscription_plan?: string;
  subscription_start_date?: number;
  subscription_end_date?: number | null;
  polar_customer_id?: string;
  polar_checkout_id?: string;
  polar_subscription_id?: string;
}

export interface Payment {
  id: string;
  checkout_id?: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  payment_date: number;
  product_name: string;
  polar_subscription_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  role: UserRole;
  createdAt: number;
  lastLogin: number;
  // Subscription fields
  subscription_status?: 'free' | 'premium' | 'cancelled';
  subscription_plan?: string;
  subscription_start_date?: number;
  subscription_end_date?: number | null;
  polar_customer_id?: string;
  polar_checkout_id?: string;
  // Usage tracking
  apiUsage?: number;
  translationCount?: number;
  loginCount?: number;
  dailySearchCount?: number;
  lastSearchDate?: string;
}

export type ActivityType = 'login' | 'logout' | 'search' | 'favorite';

export interface Activity {
  id: string;
  uid: string;
  email: string;
  type: ActivityType;
  details: string;
  timestamp: number;
}

export type AdType = 'adsense' | 'manual';
export type AdOrientation = 'vertical' | 'horizontal';

export interface Ad {
  id: string;
  type: AdType;
  orientation: AdOrientation;
  content: string; // AdSense code or Image URL
  link?: string; // For manual ads
  active: boolean;
  createdAt: number;
}

export interface Discount {
  id: string;
  code: string;
  percentage: number;
  active: boolean;
  createdAt: number;
}

export interface ApiUsage {
  id: string;
  timestamp: number;
  model: string;
  tokens: number;
  estimatedCost: number;
  uid?: string;
}

export type Theme = 'light' | 'dark';
