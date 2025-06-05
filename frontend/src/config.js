const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "http://backend:8080";

export default API_BASE_URL;
