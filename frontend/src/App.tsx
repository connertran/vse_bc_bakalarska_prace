import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import LoginForm from "./auth/LoginForm";

function App({ router: RouterComponent = BrowserRouter }) {
  return (
    <RouterComponent>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </RouterComponent>
  );
}

export default App;
