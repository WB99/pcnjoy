import "./App.css";
import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";
import { auth } from "./Firebase/firebase-config";

export default function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(true);
  auth.onAuthStateChanged((user) => {
    if (user) {
      return setIsUserSignedIn(true);
    } else {
      setIsUserSignedIn(false);
    }
  });

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Navigate to="/login" />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
