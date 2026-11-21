import { Link, useNavigate } from "react-router";
import API from "../API/api";
import logout from "../auth/logout";
import isAdmin from "../auth/isAdmin";
import getCurrentUserId from "../auth/getCurrentUserId";

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
    const userId = getCurrentUserId();
    if (userId) return navigate(`/portfolio/${userId}`);

    // not logged in user tries to click their own portfolio => log in again
    handleLogout();
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
