// src/config.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL || "http://localhost:5000";

export { API_URL, CHAT_URL };
