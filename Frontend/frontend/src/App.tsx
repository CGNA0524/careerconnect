// Frontend/src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "serif" }}>
        <h1>CareerConnect</h1>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
