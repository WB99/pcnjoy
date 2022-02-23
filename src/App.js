import './App.css';
import {Routes, Route, Navigate, BrowserRouter as Router} from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import MainPage from "./MainPage/MainPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path = "/login" element = {<LoginPage />} />
        <Route exact path = "/main" element = {<MainPage />}/>
        <Route path="/*" element={<Navigate to='/login'/>}/>
      </Routes>
    </Router>
    )
}