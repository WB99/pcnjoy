import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { auth } from "../Firebase/firebase-config";
import { signOut } from "firebase/auth";
import { Navigate } from "react-router-dom";

import classes from "./NavBar.module.css";
import Directions from "./Directions";

const searchBarLimit = 5;

function NavBar(props) {
  const [userSignOut, setUserSignOut] = useState(false);
  const [searchBar, setSearchBar] = useState([
    <SearchBar
      setCoord={props.setCoord}
      markers={props.markers}
      setMarkers={props.setMarkers}
      address={null}
      id={0}
      key={0}
    />,
  ]);
  const [SBLabels, setSBLabels] = useState([]);
  const [searchBarRemoval, setSearchBarRemoval] = useState([]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      return setUserSignOut(false);
    } else {
      setUserSignOut(true);
    }
  });

  // when markers change -> SearchBars changes
  useEffect(() => {
    setSearchBar([]);
    if (props.markers.length > 0) {
      props.markers.forEach((marker) => {
        setSearchBar((current) => {
          if (current.length > 0) {
            let newArray = [...current];
            newArray[current.length] = (
              <SearchBar
                setCoord={props.setCoord}
                markers={props.markers}
                setMarkers={props.setMarkers}
                address={marker.address}
                id={current.length}
                key={current.length}
              />
            );
            return newArray;
          } else {
            return [
              ...current,
              <SearchBar
                setCoord={props.setCoord}
                markers={props.markers}
                setMarkers={props.setMarkers}
                address={marker.address}
                id={0}
                key={0}
              />,
            ];
          }
        });
      });
    } else {
      setSearchBar([
        <SearchBar
          setCoord={props.setCoord}
          markers={props.markers}
          setMarkers={props.setMarkers}
          address={null}
          id={0}
          key={0}
        />,
      ]);
    }
  }, [props.markers]);

  // when SearchBar changes -> SBLabels and SearchBarRemoval changes
  useEffect(() => {
    setSBLabels([]);
    setSearchBarRemoval([]);
    if (searchBar.length > 0) {
      searchBar.forEach(() => {
        setSBLabels((current) => {
          if (current.length === 0) {
            return [...current, <p>Start</p>];
          } else if (current.length === searchBar.length - 1) {
            let newArray = [...current];
            newArray[current.length] = <p>End</p>;
            return newArray;
          } else {
            let newArray = [...current];
            newArray[current.length] = <p>Point</p>;
            return newArray;
          }
        });
        setSearchBarRemoval((current) => {
          if (current.length > 0) {
            let newArray = [...current];
            newArray[current.length] = (
              <Button id={current.length} onClick={searchBarRemovalClicked}>
                Remove
              </Button>
            );
            return newArray;
          } else {
            return [
              ...current,
              <Button id={0} onClick={searchBarRemovalClicked}>
                Remove
              </Button>,
            ];
          }
        });
      });
    }
  }, [searchBar, props.isRouted]);

  const createSearchBar = () => {
    if (searchBar.length < searchBarLimit) {
      setSearchBar((current) => {
        if (current.length > 0) {
          let newArray = [...current];
          newArray[current.length] = (
            <SearchBar
              setCoord={props.setCoord}
              markers={props.markers}
              setMarkers={props.setMarkers}
              address={null}
              id={current.length}
              key={current.length}
            />
          );
          return newArray;
        } else {
          return [
            ...current,
            <SearchBar
              setCoord={props.setCoord}
              markers={props.markers}
              setMarkers={props.setMarkers}
              address={null}
              id={0}
              key={0}
            />,
          ];
        }
      });
    }
  };

  const searchBarRemovalClicked = (e) => {
    props.setRouteState(false);
    props.setMarkers((current) => {
      let newArray = [...current];
      newArray.splice(e.target.id, 1);
      return newArray;
    });
  };

  // when map loaded state change -> SearchBars changes
  useEffect(() => {
    if (props.mapsLoaded) {
      setSearchBar([]);
      setSearchBar([
        <SearchBar
          setCoord={props.setCoord}
          markers={props.markers}
          setMarkers={props.setMarkers}
          address={null}
          id={0}
          key={0}
        />,
      ]);
    } else {
      setSearchBar([]);
    }
  }, [props.mapsLoaded]);

  function routeHandler(showRoute) {
    if (showRoute) {
      props.setRouteReq(true);
      props.setRouteState(true);
    } else {
      props.setRouteState(false);
      // props.setrouteLatlngs([]);
    }
  }

  let body, buttons;
  if (props.isRouted) {
    buttons = (
      <div>
        <Button variant="danger" onClick={() => routeHandler(false)}>
          {" "}
          Back{" "}
        </Button>
        <Button variant="secondary"> Add to Saved Routes </Button>
      </div>
    );

    body = (
      <div style={{ height: "40%" }}>
        <hr className={classes.rounded}></hr>
        <Directions data={props.cleanRouteData} />
      </div>
    );
  } else {
    buttons = (
      <div>
        <Button
          onClick={createSearchBar}
          disabled={searchBar.length >= searchBarLimit}
        >
          + Add Point to Route
        </Button>
        <Button
          disabled={props.markers.length < 2}
          onClick={() => routeHandler(true)}
        >
          Done
        </Button>
      </div>
    );

    body = (
      <div>
        <hr className={classes.rounded}></hr>
        <Landmarks 
          setHistSite={props.setHistSite} 
          setMonument={props.setMonument}
          histSiteCheck={props.histSiteCheck}
          monumentCheck={props.monumentCheck}
        />
        <hr className={classes.solid}></hr>
        <SavedPlace savedPlaces={props.savedPlaces} />
        <hr className={classes.solid}></hr>
        <SavedRoutes />
      </div>
    );
  }

  if (userSignOut) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <div>PCNJOY</div>
          <div>
            {" "}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
        <hr className={classes.solid}></hr>
        <div className={classes.search}>
          <div className={classes.SBLabels}>{SBLabels}</div>
          <div className={classes.searchBar}>{searchBar}</div>
          <div className={classes.searchBarRemoval}>{searchBarRemoval}</div>
        </div>
        {buttons}
        {body}
      </div>
    );
  }
}

export default NavBar;
