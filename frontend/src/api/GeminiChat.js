const BASE = "http://localhost:5050";

export async function aiSuggest(text) {
  const res = await fetch(`${BASE}/ai/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function aiCompare(ideaA, ideaB) {
  const res = await fetch(`${BASE}/ai/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ideaA, ideaB }),
  });
  return res.json();
}

export async function aiMerge(ideaA, ideaB) {
  const res = await fetch(`${BASE}/ai/merge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ideaA, ideaB }),
  });
  return res.json();
}