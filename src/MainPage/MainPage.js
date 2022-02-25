import React from "react";
import SimpleMap from "./Map";
import NavBar from "./NavBar";

import "./MainPage.css";

function MainPage() {
  return (
    <div className="root">
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
