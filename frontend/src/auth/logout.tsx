import API from "../API/api";
import { removeTokenFromLocalStorage } from "./localStorage";

function logout() {
  API.token = null;
  removeTokenFromLocalStorage();
}

export default logout;
