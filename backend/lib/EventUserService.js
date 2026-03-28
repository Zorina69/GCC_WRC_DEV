import { db } from "./firebase";

const path = (event) => `${event}/participants`;

// ─────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────
export async function getAllParticipants(event) {
  const ref = db.ref(path(event));
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  if (!data) return [];

  const list = Array.isArray(data)
    ? data.filter(Boolean).map((item, i) => ({ _index: i, ...item }))
    : Object.entries(data).map(([key, value]) => ({
        _index: key,
        ...value,
      }));

  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// ─────────────────────────────────────────────
// GET ONE
// ─────────────────────────────────────────────
export async function getParticipantByIndex(event, index) {
  const ref = db.ref(`${path(event)}/${index}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  return data ? { _index: index, ...data } : null;
}

// ─────────────────────────────────────────────
// ADD
// ─────────────────────────────────────────────
export async function addParticipant(event, data) {
  const ref = db.ref(path(event));
  const snapshot = await ref.once("value");
  const current = snapshot.val();

  const nextIndex = current
    ? Array.isArray(current)
      ? current.filter(Boolean).length
      : Object.keys(current).length
    : 0;

  const nextOrder = nextIndex + 1;

  await ref.child(nextIndex).set({
    order: nextOrder,
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return nextIndex;
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export async function updateParticipant(event, index, data) {
  const ref = db.ref(`${path(event)}/${index}`);
  const { _index, ...clean } = data;

  await ref.update({
    ...clean,
    updatedAt: Date.now(),
  });
}

// ─────────────────────────────────────────────
// DELETE (compact)
// ─────────────────────────────────────────────
export async function deleteParticipant(event, index) {
  const ref = db.ref(path(event));
  const snapshot = await ref.once("value");
  const data = snapshot.val() || [];

  const arr = Array.isArray(data)
    ? data.filter(Boolean)
    : Object.values(data);

  arr.splice(index, 1);

  await ref.set(arr);
}

// ─────────────────────────────────────────────
// LIST EVENTS
// ─────────────────────────────────────────────
export async function listEvents() {
  const ref = db.ref("/");
  const snapshot = await ref.once("value");
  const data = snapshot.val();

  return data ? Object.keys(data) : [];
}
