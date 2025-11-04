import { setActiveYear } from "@/controllers/fiscalController";

// Route to set a specific year as active
export async function PATCH(req, { params }) {
  return setActiveYear(req, { params });
}