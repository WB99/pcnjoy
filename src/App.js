import './App.css';
import {Routes, Route, Navigate, BrowserRouter as Router} from "react-router-dom";
import Login from "./Login";
import Main from "./Main";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path = "/login" element = {<Login />} />
        <Route exact path = "/main" element = {<Main />}/>
        <Route path="/*" element={<Navigate to='/login'/>}/>
      </Routes>
    </Router>
    )
}