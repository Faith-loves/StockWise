import { api } from "./api"

export const saleService = {
  list: (params) => api.get("/sales", { params }).then((res) => res.data),
  get: (id) => api.get(`/sales/${id}`).then((res) => res.data),
  create: (payload) => api.post("/sales", payload).then((res) => res.data),
  updatePayment: (id, payload) => api.patch(`/sales/${id}/payment`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/sales/${id}`).then((res) => res.data),
}
