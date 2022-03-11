import React, { useCallback, useState, useRef, useEffect } from "react";
import Map from "../Components/Map";
import NavBar from "../Components/NavBar";
// import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";

// import { auth } from "../Firebase/firebase-config";
// import { signOut } from "firebase/auth";

function MainPage() {
  // const handleSignOut = () => {
  //   signOut(auth).then(() => {
  //     console.log("Sign out success")
  //   }).catch((error) => {
  //     console.log(error)
  //   });
  // }
  const [coord, setCoord] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markers, setMarkers] = useState([]);
  return (
    <div className="root">
      {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
      <div className="Map">
        <Map coord={coord} markers={markers} setMarkers={setMarkers} />
      </div>
      <div className="NavBar">
        <NavBar setCoord={setCoord} markers={markers} setMarkers={setMarkers} />
      </div>
    </div>
  );
}

export default MainPage;
