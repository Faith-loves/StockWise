import { api } from "./api"

export const customerService = {
  list: (params) => api.get("/customers", { params }).then((res) => res.data),
  get: (id) => api.get(`/customers/${id}`).then((res) => res.data),
  create: (payload) => api.post("/customers", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/customers/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/customers/${id}`).then((res) => res.data),
}
