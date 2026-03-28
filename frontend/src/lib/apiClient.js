// frontend/src/lib/apiClient.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const base = (event) => `${BASE_URL}/participant/${event}`;

// ── Get all participants for an event
export async function fetchParticipants(event) {
  try {
    const res = await fetch(base(event));

    // 404 = no participants yet → return empty array, not an error
    if (res.status === 404) return [];

    const json = await res.json();

    // Backend returns { success, data } wrapper
    if (json.success !== undefined) {
      if (!json.success) throw new Error(json.error || "Failed to fetch");
      return Array.isArray(json.data) ? json.data : [];
    }

    // Backend returns raw array directly (e.g. snapshot.val())
    if (Array.isArray(json)) {
      return json.filter(Boolean).map((item, i) => ({ _index: i, ...item }));
    }

    // Backend returns raw object
    if (json && typeof json === "object") {
      return Object.entries(json)
        .filter(([, v]) => v !== null)
        .map(([key, value]) => ({ _index: key, ...value }));
    }

    return [];
  } catch (err) {
    console.error("fetchParticipants error:", err.message);
    return [];
  }
}

// ── Add a new participant
export async function addParticipant(event, data) {
  const res = await fetch(base(event), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to add");
  return json.index;
}

// ── Update a participant by index
export async function updateParticipant(event, index, data) {
  const res = await fetch(`${base(event)}/${index}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to update");
}

// ── Delete a participant by index
export async function deleteParticipant(event, index) {
  const res = await fetch(`${base(event)}/${index}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to delete");
}