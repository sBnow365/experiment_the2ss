const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
console.log("API_BASE =", API_BASE);
// -------- ANALYZE IMAGE --------
export async function analyzeImage(imageFile, location) {

  const formData = new FormData();

  // Backend expects field name "file"
  formData.append("file", imageFile);

  // Backend expects lat and lon
  if (location) {
    formData.append("lat", location.lat);
    formData.append("lon", location.lon);
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("Analyze failed");
  }

  return res.json();
}


// -------- FOLLOWUP QUESTION --------
export async function askFollowup(sessionId, tab, question, history) {

  const res = await fetch(`${API_BASE}/followup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWU4YzlmZTFiNTliYzMxZGJiMzM1YTEiLCJleHAiOjE3Nzc0Njg1NDJ9.haeJmdloHnK8Db6bzyET6lt7ImMdIXxqdY7jImW76_U`
    },
    body: JSON.stringify({
      session_id: sessionId,
      tab: tab,
      question: question,
      history: history
    })
  });

  if (!res.ok) {
    throw new Error("Followup failed");
  }

  return res.json();
}
// export async function saveFollowup(sessionId, tab, question, answer) {
//   const res = await fetch(`${API_BASE}/followup/save`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWU4YzlmZTFiNTliYzMxZGJiMzM1YTEiLCJleHAiOjE3Nzc0Njg1NDJ9.haeJmdloHnK8Db6bzyET6lt7ImMdIXxqdY7jImW76_U"
//     },
//     body: JSON.stringify({ session_id: sessionId, tab, question, answer })
//   });
//   return res.json();
// }