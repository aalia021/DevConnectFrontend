export const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:5000" // backend local
    : "https://dev-connect-backend.onrender.com";
