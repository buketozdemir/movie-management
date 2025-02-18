export interface RateLimits {
  limit: number;
  ttl: number;
  keyMap?: RateLimiterKeyMap;
}

export interface RateLimiterOptions {
  limits?: RateLimits[];
  skip?: boolean;
}

export interface RateLimiterKeyMap {
  headers?: string[];
  body?: string[];
  query?: string[];
}
