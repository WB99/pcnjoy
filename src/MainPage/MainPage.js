import React from "react";
import Map from "./Map";
import NavBar from "./NavBar";

import "./MainPage.css";

function MainPage() {
  return (
    <div className="root">
      <div className="Map">
        <Map />
      </div>
      <div className="NavBar">
        <NavBar />
      </div>
    </div>
  );
}

export default MainPage;
