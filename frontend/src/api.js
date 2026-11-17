// Small fetch helper: adds the token and turns API errors into thrown Errors
export async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body && JSON.stringify(body),
    });
  } catch {
    throw new Error("Can't reach the server. Please try again later.");
  }

  // The body may be empty or not JSON, so read it safely
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (data?.error) throw new Error(data.error);
    if (res.status === 400 || res.status === 401) {
      throw new Error("Invalid email or password.");
    }
    if (res.status === 404) throw new Error("Account not found.");
    throw new Error("Something went wrong. Please try again.");
  }

  return data;
}