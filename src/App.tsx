import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import ClassesPage from "./ClassesPage";
import SubjectsPage from "./SubjectPage";
import TimetablePage from "./TimetablePage";
import AnnouncementPage from "./AnnouncementPage";



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
        <Route
          path="/classes"
            element={
            <ProtectedRoute token={token}>
             <ClassesPage token={token as string} />
             </ProtectedRoute>
            }
         />
         <Route
          path="/subjects"
            element={
            <ProtectedRoute token={token}>
             <SubjectsPage token={token as string} />
             </ProtectedRoute>
            }
         />
         <Route
          path="/timetable"
            element={
            <ProtectedRoute token={token}>
             <TimetablePage token={token as string} />
             </ProtectedRoute>
            }
         />

         <Route
  path="/announcements"
  element={
    <ProtectedRoute token={token}>
      <AnnouncementPage token={token as string} />
    </ProtectedRoute>
  }
/>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;