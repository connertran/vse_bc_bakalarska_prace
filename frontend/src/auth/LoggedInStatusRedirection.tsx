import { useNavigate } from "react-router";
import { useEffect } from "react";
import API from "../API/api";

function LoggedInStatusRedirection() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!API.token) {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}

export default LoggedInStatusRedirection;
