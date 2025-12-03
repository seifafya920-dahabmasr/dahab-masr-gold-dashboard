import { api } from "./api";

export const CompanyService = {
  getAll: () => api.get("/company"),
  getById: (id: string) => api.get(`/company/${id}`),
  update: (id: string, data: any) => api.put(`/company/${id}`, data),
  delete: (id: string) => api.delete(`/company/${id}`),
};
