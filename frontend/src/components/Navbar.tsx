import { Link, useNavigate } from "react-router";
import API from "../API/api";
import logout from "../auth/logout";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      {API.token ? (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
