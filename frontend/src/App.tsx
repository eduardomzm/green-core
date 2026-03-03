import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../src/pages/Dashboard";
import HistoryPage from "../src/pages/Historial";
import Login from "../src/pages/Login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;