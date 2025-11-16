/*

// Set the base URL for the backend API
const API_BASE_URL = "http://localhost:5050"; 
// Note: If you have this defined elsewhere, ensure this file can access it.

async function makeSnowflakeApiCall(path) {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) {
        throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export async function fetchVersions(ideaId) {
  // Correct path to match the backend Express route (e.g., /ideas/:id/versions)
  return makeSnowflakeApiCall(`/ideas/${ideaId}/versions`);
}

export async function fetchAnalytics(ideaId) {
  // Assuming this route should be something like /ideas/:id/analytics
  return makeSnowflakeApiCall(`/ideas/${ideaId}/analytics`);
}

export async function fetchSemanticDrift(ideaId) {
  // Assuming this route should be something like /ideas/:id/drift
  return makeSnowflakeApiCall(`/ideas/${ideaId}/drift`);
}
*/