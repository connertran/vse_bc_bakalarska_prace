import API from "../API/api";
import { saveTokenToLocalStorage } from "./localStorage";
import type { UserRegisterData } from "../API/types";

async function register(data: UserRegisterData) {
  try {
    const res = await API.signup(data);
    // save the token to the class API (header) for later authorization
    API.token = res.token;
    saveTokenToLocalStorage(res.email, res.alt_email, res.token);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default register;
