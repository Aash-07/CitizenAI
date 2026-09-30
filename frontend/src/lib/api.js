import axios from "axios";

/**
 * Axios client for the existing CitizenAI FastAPI backend.
 *
 * Backend routes used (unchanged, see backend/main.py):
 *   GET  /health          -> { status, service }
 *   POST /chat            -> { answer, sources: [{ pdf, page }] }               body: { message }
 *   POST /eligibility     -> { profile, eligible_categories, matching_schemes } body: EligibilityRequest
 *                            EligibilityRequest = { age, state, occupation, annual_income,
 *                                                    is_student?, is_farmer?, owns_business? }
 *   GET  /schemes         -> { count, schemes: [{ name, category, ministry, source_pdf }] }
 *   GET  /schemes/search  -> { query, schemes: [...] }                          query param: q
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  // /chat can take a while: the backend retries Gemini up to 3 times.
  timeout: 60_000,
  headers: { "Content-Type": "application/json" },
});

/** Turn any thrown error into a message that is safe to show to a user. */
export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    if (!error.response) {
      return "Cannot reach the CitizenAI server. Make sure the backend is running.";
    }
    const detail = error.response.data?.detail;
    if (typeof detail === "string") return detail; // HTTPException from FastAPI
    if (Array.isArray(detail)) {
      // FastAPI 422 validation errors
      return detail.map((d) => d.msg).join(", ");
    }
    return `Request failed (status ${error.response.status}).`;
  }
  return error?.message || "Something went wrong.";
}

export const healthCheck = () => api.get("/health").then((r) => r.data);

export const sendChatMessage = (message) =>
  api.post("/chat", { message }).then((r) => r.data);

/**
 * @param {{age:number, state:string, occupation:string, annual_income:number,
 *          is_student?:boolean, is_farmer?:boolean, owns_business?:boolean}} profile
 */
export const checkEligibility = (profile) =>
  api.post("/eligibility", profile).then((r) => r.data);

export const getAllSchemes = () => api.get("/schemes").then((r) => r.data);

export const searchSchemesApi = (query) =>
  api.get("/schemes/search", { params: { q: query } }).then((r) => r.data);

export default api;
