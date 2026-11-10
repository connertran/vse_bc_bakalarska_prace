import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import Navbar from "./components/Navbar";
import InsertCoursesPage from "./pages/admin/InsertCoursesPage";

function App({ router: RouterComponent = BrowserRouter }) {
  return (
    <RouterComponent>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin/insert-courses" element={<InsertCoursesPage />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </RouterComponent>
  );
}

export default App;
