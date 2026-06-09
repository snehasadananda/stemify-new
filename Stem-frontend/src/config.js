// src/config.js
// Central API base URL for all network calls.
//
// In development, Vite will use VITE_API_BASE_URL from .env
// If not set, it falls back to http://localhost:5000/api

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
