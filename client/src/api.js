// Base URL of the EduTrack API. Set VITE_API_URL at build time to point the client elsewhere.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
