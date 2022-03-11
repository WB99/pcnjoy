import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { auth } from "../Firebase/firebase-config";
import { signOut } from "firebase/auth";
import { Navigate } from "react-router-dom";

import "./NavBar.css";

const searchBarLimit = 5;

function NavBar(props) {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [userSignOut, setUserSignOut] = useState(false);
  auth.onAuthStateChanged((user) => {
    if (user) {
      return setUserSignOut(false);
    } else {
      setUserSignOut(true);
    }
  });

  const [searchBar, setSearchBar] = useState([
    <SearchBar
      setCoord={props.setCoord}
      setMarkers={props.setMarkers}
      id={0}
    />,
  ]);
  const createSearchBar = () => {
    setSearchBar(
      searchBar.concat(
        <SearchBar
          setCoord={props.setCoord}
          setMarkers={props.setMarkers}
          id={searchBar.length}
        />
      )
    );
  };

  // console.log("user signed out? ", userSignOut);
  console.log(props.markers);

  if (userSignOut) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div className="SideBar">
        <div className="title">
          <div>PCNJOY</div>
          <div>
            {" "}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
        <hr className="solid"></hr>

        <p>SearchBar</p>
        {searchBar}
        <Button
          onClick={createSearchBar}
          disabled={searchBar.length === searchBarLimit}
        >
          + Add Point to Route
        </Button>
        <Button disabled={props.markers.length < 2}>Done</Button>
        <hr className="rounded"></hr>
        <Landmarks />
        <hr className="solid"></hr>
        <SavedPlace />
        <hr className="solid"></hr>
        <SavedRoutes />
      </div>
    );
  }
}

export default NavBar;
