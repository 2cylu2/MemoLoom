const BASE_URL = "http://localhost:5050";

// load all
export async function loadIdeas() {
  const res = await fetch(`${BASE_URL}/ideas`);
  return res.json();
}

// create idea
export async function createIdea() {
  const res = await fetch(`${BASE_URL}/ideas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Untitled", content: "" }),
  });
  return res.json();
}

// update idea
export async function updateIdea(id, data) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// delete idea
export async function deleteIdea(id) {
  await fetch(`${BASE_URL}/ideas/${id}`, { method: "DELETE" });
}
