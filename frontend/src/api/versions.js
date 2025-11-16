// Base URL for the backend
const API_BASE_URL = "http://localhost:5050/ideas"; 

/**
 * Fetches the version history for a specific idea ID from the MongoDB backend.
 * @param {string} ideaId - The ID of the parent idea.
 * @returns {Promise<Array>} A list of version objects.
 */
export async function fetchVersions(ideaId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${ideaId}/versions`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching versions:", error);
    return [];
  }
}