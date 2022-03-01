import React from "react";
import SimpleMap from "../Components/Map";
import NavBar from "../Components/NavBar";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./MainPage.css";

import { auth } from '../Firebase/firebase-config';
import { signOut } from "firebase/auth";

function MainPage() {
  // const handleSignOut = () => {
  //   signOut(auth).then(() => {
  //     console.log("Sign out success")
  //   }).catch((error) => {
  //     console.log(error)
  //   });
  // }

  return (
    <div className="root">
      {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
      <div className="Map">
        <SimpleMap />
      </div>
      <div className="NavBar">
        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
