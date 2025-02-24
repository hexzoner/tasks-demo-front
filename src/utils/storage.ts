const tokenKey = "demo-payload-token";

export function storeToken(token: string) {
  localStorage.setItem(tokenKey, JSON.stringify(token));
}

export function restoreToken() {
  const token = localStorage.getItem(tokenKey);
  if (!token) return null;

  try {
    return JSON.parse(token);
  } catch (error) {
    console.log("Error parsing token:", error);
    return null;
  }
}

export function deleteToken() {
  localStorage.removeItem(tokenKey);
}