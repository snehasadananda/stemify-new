const API = "/api";

export async function getSuperStats() {
  const res = await fetch(`${API}/reports/overview`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  return res.json();
}
