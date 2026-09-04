// Central backend URL configuration
// Dynamically uses localhost:4000 when running locally, or env var / production URL
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000'
    : 'https://bhoomi-carbon.onrender.com');

