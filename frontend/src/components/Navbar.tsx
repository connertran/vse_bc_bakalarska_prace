import { Link, useNavigate } from "react-router";
import API from "../API/api";
import logout from "../auth/logout";
import isAdmin from "../auth/isAdmin";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleAddCourses() {
    navigate("/admin/insert-courses");
  }

  function handlePortfolio() {
    navigate("/portfolio");
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      {API.token ? (
        <>
          {/* only admins can add courses */}
          {isAdmin() && (
            <button type="button" onClick={handleAddCourses}>
              Add courses
            </button>
          )}
          <button type="button" onClick={handlePortfolio}>
            Portfolio
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </>
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
