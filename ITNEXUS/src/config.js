// In production (built app), use relative '/api' so it hits the same domain.
// In local dev (Vite), use localhost:5000.
// Can be overridden with VITE_API_BASE_URL env var.
const isProduction = import.meta.env.PROD;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isProduction ? '/api' : 'http://localhost:5000/api');
