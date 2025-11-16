const BASE_URL = "http://localhost:5050";

// Helper: safely parse JSON
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Invalid JSON from server:", text);
    throw new Error("Server returned invalid JSON");
  }
}

// Load all ideas
export async function loadIdeas() {
  const res = await fetch(`${BASE_URL}/ideas`);
  if (!res.ok) throw new Error(`Failed to load ideas: ${res.status}`);
  return safeJson(res);
}

// Create idea
export async function createIdea() {
  const res = await fetch(`${BASE_URL}/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Untitled", content: "" }),
  });
  if (!res.ok) throw new Error(`Failed to create idea: ${res.status}`);
  return safeJson(res);
}

// Update idea (with versioning)
export async function updateIdea(id, data) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update idea: ${res.status}`);
  return safeJson(res);
}

// Delete idea
export async function deleteIdea(id) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete idea: ${res.status}`);
}

// Revert version
export async function revertVersion(id, versionIndex) {
  const res = await fetch(`${BASE_URL}/ideas/${id}/revert/${versionIndex}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Failed to revert version: ${res.status}`);
  return safeJson(res);
}

// Load idea by ID
export async function getIdeaById(id) {
  const res = await fetch(`${BASE_URL}/ideas/${Number(id)}`);
  if (!res.ok) throw new Error("Idea not found: " + res.status);
  return res.json();
}

