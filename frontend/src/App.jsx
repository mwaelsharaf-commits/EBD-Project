import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import BusinessSlots from "./features/business-slots/BusinessSlots";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /><Route
  path="/business-slots"
  element={
    <ProtectedRoute>
      <BusinessSlots />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}
