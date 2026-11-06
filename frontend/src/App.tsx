import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";

function App({ router: RouterComponent = BrowserRouter }) {
  return (
    <RouterComponent>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </RouterComponent>
  );
}

export default App;
