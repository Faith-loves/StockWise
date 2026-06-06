import { api, setAuthToken } from "./api"

export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload)
  setAuthSession(data)
  return data
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload)
  setAuthSession(data)
  return data
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me")
  return data.user
}

export async function updateProfile(payload) {
  const { data } = await api.put("/auth/profile", payload)
  if (data.user) localStorage.setItem("stockwise_user", JSON.stringify(data.user))
  return data.user
}

export function setAuthSession(data) {
  localStorage.setItem("stockwise_token", data.token)
  localStorage.setItem("stockwise_user", JSON.stringify(data.user))
  localStorage.setItem("stockwise_session", "active")
  setAuthToken(data.token)
}

export function logout() {
  localStorage.removeItem("stockwise_token")
  localStorage.removeItem("stockwise_user")
  localStorage.removeItem("stockwise_session")
  setAuthToken(null)
}
