import { jwtDecode } from "jwt-decode";
import API from "../API/api";

type TokenPayload = { id?: number };

// get the id of the logged in user from the JWT
function getCurrentUserId(): number | null {
  if (!API.token) return null;

  try {
    const payload = jwtDecode<TokenPayload>(API.token);
    return payload.id ?? null;
  } catch (error) {
    console.error("Cannot decode the JWT token:", error);
    return null;
  }
}

export default getCurrentUserId;
