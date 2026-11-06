import { useEffect } from "react";
import API from "../API/api";

function Home() {
  useEffect(() => {
    const login = async () => {
      try {
        const res = await API.login({
          email: "newuser@vse.cz",
          password: "newuser123",
        });
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    };
    login();
  }, []);

  return <h1>Home</h1>;
}

export default Home;
