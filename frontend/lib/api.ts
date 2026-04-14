import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
})

// Set token directly on axios instance (called after login)
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

// Restore token from localStorage on app load
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token")
  if (token) setAuthToken(token)
}

// Attach JWT token to every request (fallback)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),

  register: (data: {
    name: string
    email: string
    password: string
    role: string
    department?: string
    phone?: string
    collegeId?: number
  }) => api.post("/api/auth/register", data),
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const userApi = {
  getMe: () => api.get("/api/users/me"),
  updateMe: (data: { name?: string; phone?: string; department?: string }) =>
    api.put("/api/users/me", data),
  getAllUsers: () => api.get("/api/users"),
  getUserById: (id: number) => api.get(`/api/users/${id}`),
  deactivateUser: (id: number) => api.delete(`/api/users/${id}`),
}

// ─── Clubs ───────────────────────────────────────────────────────────────────
export const clubApi = {
  createClub: (data: { name: string; description?: string; category: string; contactEmail: string; logoUrl?: string }) =>
    api.post("/api/clubs", data),
  getApprovedClubs: () => api.get("/api/clubs"),
  getMyClub: () => api.get("/api/clubs/my"),
  getClubById: (id: number) => api.get(`/api/clubs/${id}`),
  getAllClubsAdmin: () => api.get("/api/clubs/admin/all"),
  updateClub: (id: number, data: object) => api.put(`/api/clubs/${id}`, data),
  approveClub: (id: number) => api.patch(`/api/clubs/${id}/approve`),
  rejectClub: (id: number, rejectionReason: string) =>
    api.patch(`/api/clubs/${id}/reject`, { rejectionReason }),
  deleteClub: (id: number) => api.delete(`/api/clubs/${id}`),
}

// ─── Fests ───────────────────────────────────────────────────────────────────
export const festApi = {
  createFest: (data: { name: string; description?: string; startDate: string; endDate: string; collegeId: number; bannerUrl?: string }) =>
    api.post("/api/fests", data),
  getAllFests: () => api.get("/api/fests"),
  getFestById: (id: number) => api.get(`/api/fests/${id}`),
  getFestsByCollege: (collegeId: number) => api.get(`/api/fests/college/${collegeId}`),
  updateFest: (id: number, data: object) => api.put(`/api/fests/${id}`, data),
  deleteFest: (id: number) => api.delete(`/api/fests/${id}`),
}

// ─── Events ──────────────────────────────────────────────────────────────────
export const eventApi = {
  createEvent: (data: object) => api.post("/api/events", data),
  getPublishedEvents: (params?: { category?: string; clubId?: number; festId?: number; from?: string; to?: string }) =>
    api.get("/api/events", { params }),
  getAllEventsAdmin: () => api.get("/api/events/admin/all"),
  getEventById: (id: number) => api.get(`/api/events/${id}`),
  getEventsByFest: (festId: number) => api.get(`/api/events/fest/${festId}`),
  getEventsByClub: (clubId: number) => api.get(`/api/events/club/${clubId}`),
  updateEvent: (id: number, data: object) => api.put(`/api/events/${id}`, data),
  publishEvent: (id: number) => api.patch(`/api/events/${id}/publish`),
  cancelEvent: (id: number) => api.patch(`/api/events/${id}/cancel`),
  deleteEvent: (id: number) => api.delete(`/api/events/${id}`),
}

// ─── Registrations ───────────────────────────────────────────────────────────
export const registrationApi = {
  register: (eventId: number) => api.post(`/api/registrations/${eventId}`),
  cancel: (eventId: number) => api.delete(`/api/registrations/${eventId}`),
  getMyRegistrations: () => api.get("/api/registrations/my"),
  getRegistrationsByEvent: (eventId: number) => api.get(`/api/registrations/event/${eventId}`),
  getRegistrationCount: (eventId: number) => api.get(`/api/registrations/event/${eventId}/count`),
}

// ─── Payments ────────────────────────────────────────────────────────────────
export const paymentApi = {
  createOrder: (eventId: number) => api.post(`/api/payments/create-order/${eventId}`),
  verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post("/api/payments/verify", data),
  handleFailure: (razorpayOrderId: string, reason?: string) =>
    api.post("/api/payments/failure", null, { params: { razorpayOrderId, reason } }),
  getMyPayments: () => api.get("/api/payments/my"),
  getMyPaymentSummary: () => api.get("/api/payments/history/my/summary"),
  getPaymentsByEvent: (eventId: number) => api.get(`/api/payments/event/${eventId}`),
  getAdminStatistics: () => api.get("/api/payments/admin/statistics"),
}
