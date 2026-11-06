import API from "../API/api";
import { saveTokenToLocalStorage } from "./localStorage";

async function LoginForm(email: string, password: string) {
  try {
    const res = await API.login({ email, password });
    // save the token to the class API (header) for later authorization
    API.token = res.token;
    saveTokenToLocalStorage(res.mail, res.alt_email, res.token);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default LoginForm;
