// Redirect module: Supabase client removed and replaced with Node.js + Express REST API Client
import { apiClient } from './api.js';

export const springClient = apiClient;
export const supabaseClient = apiClient;
export default apiClient;