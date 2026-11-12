import studioSettings from './settings.json';
import { SERVICES_DATA } from '../data/servicesData';
export interface Media { id: string; kind: 'photo' | 'film'; title: string; description: string; alt: string; category: string; url: string; poster?: string; orientation?: string; featured: boolean; published: boolean; deleted: boolean; order: number; }
export interface Collection { id: string; title: string; description: string; published: boolean; deleted: boolean; }
export interface Content { uploadMode?: 'signed'; media: Media[]; collections: Collection[]; categories: string[]; settings: { introduction: string; biography: string; history: string; team: string; phone: string; instagram: string; facebook: string; siteUrl: string; email: string; owner: string; address: string; hours: string; }; }
export const defaults: Content = { media: [], collections: [], categories: ['WEDDINGS', 'PRE-WEDDINGS', 'ENGAGEMENTS', 'HALDI', 'CANDID MOMENTS', 'PORTRAITS'], settings: studioSettings };
export const services = SERVICES_DATA.map(service => ({ title: service.title, description: service.shortDescription }));
export const apiBase = '/api';
export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'ApiError'; }
}
export async function api(path: string, options: RequestInit = {}) {
  let response: Response;
  try { response = await fetch(`${apiBase}${path}`, { credentials: 'include', signal: AbortSignal.timeout(15000), ...options, headers: { ...(options.body instanceof Blob ? {} : { 'Content-Type': 'application/json' }), ...options.headers } }); }
  catch { throw new ApiError('Unable to reach the studio server. Check your connection and try again.', 0); }
  const raw = await response.text();
  let result;
  try { result = JSON.parse(raw); }
  catch { throw new ApiError('The admin API is not connected. Locally, use npm run dev. On Vercel, check the deployment settings in VERCEL_SETUP.md.', response.status); }
  if (!response.ok) throw new ApiError(result.error || 'The request could not be completed.', response.status);
  return result;
}
