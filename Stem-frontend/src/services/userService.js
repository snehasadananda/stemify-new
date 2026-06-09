const API = "/api";

export async function listUsers() {
  const res = await fetch(`${API}/users`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
  return res.json();
}

export async function toggleUser(id) {
  const res = await fetch(`${API}/users/toggle/${id}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  return res.json();
}
