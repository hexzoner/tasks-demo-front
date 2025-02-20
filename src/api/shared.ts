import { restoreToken } from "../utils/storage";

export function getAPIURL() {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) throw new Error("API URL is required, are you missing a .env file?");
    return API_URL;
}

export const tokenHeader =
{
    "Content-Type": "application/json",
    Authorization: `Bearer ${restoreToken()}`,
}