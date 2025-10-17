// lib/utils/slugUtils.ts
/**
 * Utility functions for creating URL-friendly slugs from content names
 */

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function createRoadDisruptionSlug(roadName: string, disruptionId: string): string {
  // Use road name if available, fallback to disruption ID
  const baseSlug = roadName ? createSlug(roadName) : disruptionId.toLowerCase();
  return `${baseSlug}-${disruptionId}`;
}

export function createEventSlug(title: string, eventId: string): string {
  // Use event title if available, fallback to event ID
  const baseSlug = title ? createSlug(title) : eventId.toLowerCase();
  return `${baseSlug}-${eventId}`;
}

export function createInspectorSlug(locationName: string, inspectorId: string): string {
  // Use location name if available, fallback to inspector ID
  const baseSlug = locationName ? createSlug(locationName) : inspectorId.toLowerCase();
  return `${baseSlug}-${inspectorId}`;
}

export function createTransportDisruptionSlug(commonName: string, disruptionId: string): string {
  // Use common name if available, fallback to disruption ID
  const baseSlug = commonName ? createSlug(commonName) : disruptionId.toLowerCase();
  return `${baseSlug}-${disruptionId}`;
}

/**
 * Extract ID from slug (everything after the last hyphen)
 */
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
