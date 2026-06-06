import { api } from "./api"

export const invoiceService = {
  list: (params) => api.get("/invoices", { params }).then((res) => res.data),
  get: (id) => api.get(`/invoices/${id}`).then((res) => res.data),
  markPaid: (id) => api.patch(`/invoices/${id}/paid`).then((res) => res.data),
  updatePayment: (id, payload) => api.patch(`/invoices/${id}/payment`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/invoices/${id}`).then((res) => res.data),
}
