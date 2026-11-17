import { jwtDecode } from "jwt-decode";
import API from "../API/api";

type TokenPayload = { isAdmin?: boolean };

function isAdmin(): boolean {
  if (!API.token) return false;

  try {
    const payload = jwtDecode<TokenPayload>(API.token);
    return payload.isAdmin === true;
  } catch (error) {
    console.error("Cannot decode the JWT token:", error);
    return false;
  }
}

export default isAdmin;
