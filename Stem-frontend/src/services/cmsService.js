const API = "/api";

export async function getPages() {
  const res = await fetch(`${API}/pages/list`);
  return res.json();
}

export async function savePage(payload) {
  const res = await fetch(`${API}/pages/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}
