export type Platform = 'zepto' | 'dmart' | 'jiomart' | 'naturesbasket' | 'instamart';

export type PlatformStatus = 'queued' | 'in-progress' | 'completed' | 'failed';

export interface PlatformInfo {
  id: Platform;
  name: string;
  color: string;
}

export interface PlatformState {
  platform: Platform;
  status: PlatformStatus;
  productCount?: number;
  error?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  discount: number;
  url: string;
  platform: Platform;
}

export interface SearchState {
  status: 'idle' | 'loading' | 'completed' | 'error';
  query: {
    location: string;
    product: string;
    platforms: Platform[];
  };
  platformStates: PlatformState[];
  results: Product[];
  progress: number;
}

export const PLATFORMS: PlatformInfo[] = [
  { id: 'zepto', name: 'Zepto', color: 'platform-zepto' },
  { id: 'dmart', name: 'D-Mart', color: 'platform-dmart' },
  { id: 'jiomart', name: 'JioMart', color: 'platform-jiomart' },
  { id: 'naturesbasket', name: "Nature's Basket", color: 'platform-naturesbasket' },
  { id: 'instamart', name: 'Swiggy Instamart', color: 'platform-instamart' },
];
