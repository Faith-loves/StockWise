import { api } from "./api"

export const reportService = {
  get: () => api.get("/reports").then((res) => res.data),
}
