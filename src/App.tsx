import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={(t) => setToken(t)} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <DashboardPage token={token as string} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;