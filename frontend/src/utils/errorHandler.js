export const getErrorMessage = (err) => {
  const data = err?.response?.data;

  // ✅ Case 1: Proper JSON from backend
  if (data && typeof data === "object") {
    return data.message || "Something went wrong";
  }

  // ✅ Case 2: HTML string (your current case)
  if (typeof data === "string") {
    const match = data.match(/Error:\s*([^<\n]+)/i);
    if (match) return match[1].trim();
  }

  // ✅ Fallback
  return err?.message || "Something went wrong";
};