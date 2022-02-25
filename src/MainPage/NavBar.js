import React from "react";
import AddRoutes from "./AddRoutes";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";

import "./NavBar.css";

function NavBar() {
  return (
    <div className="SideBar">
      <div className="title">
        <div>PCNJOY</div>
        <div>
          {" "}
          <a
            className="signout"
            href="/Login"
            onClick={() => {
              window.location.href = "/Login";
            }}
          >
            Sign Out
          </a>
        </div>
      </div>
      <hr className="solid"></hr>
      <AddRoutes />
      <hr className="rounded"></hr>
      <Landmarks />
      <hr className="solid"></hr>
      <SavedPlace />
      <hr className="solid"></hr>
      <SavedRoutes />
    </div>
  );
}

export default NavBar;