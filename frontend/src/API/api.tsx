import axios from "axios";
import type { UserLoginData, UserRegisterData } from "./types";
import { getTokenFromLocalStorage } from "../auth/localStorage";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

class API {
  // restore the saved token on page load so a refresh keeps the user logged in
  static token: string | null = getTokenFromLocalStorage()?.token ?? null;

  static async request(endpoint: string, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;

    const headers = { Authorization: `Bearer ${API.token}` };

    const params = data;

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Erorr:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Signup for site
  static async signup(data: UserRegisterData) {
    let res = await this.request(`auth/register`, data, "post");
    // backend responds with { user: {..., token} }
    return res.user;
  }

  // Login for site
  static async login(data: UserLoginData) {
    let res = await this.request(`auth/login`, data, "post");
    return res.user;
  }
}
export default API;
