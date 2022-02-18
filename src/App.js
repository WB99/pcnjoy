import logo from './logo.svg';
import './App.css';
import {Routes, Route, Link, BrowserRouter as Router} from "react-router-dom";
import Login from "./Login"
import Main from "./Main"


function App() {
  return (
    <div className="App">
      <ul>
        <li><Link to = "/">Login</Link></li>
      </ul>
      <ul>
        <li><Link to = "/main">Main</Link></li>
      </ul>
      <Route exact path = "/" component = {Login} />
      <Route exact path = "/main" component = {Main} />
    </div>


    // <div> 
    //     <h1>TEST</h1>
    // </div>

    // <Router>
      // <div className="App">
      //   <ul>
      //     <li>
      //       <Link to = "/">LOGIN</Link>
      //     </li>
      //     <li>
      //       <Link to = "/main">MAIN</Link>
      //     </li>
      //   </ul>

      //   <Routes>
      //       <Route path = "/">
      //         <Login/>
      //       </Route>

      //       <Route path = "/main">
      //         <Main/>
      //       </Route>
      //   </Routes>
      // </div>
    // </Router>
    )
}

export default App;
