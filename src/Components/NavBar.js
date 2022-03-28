import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Landmarks from "./Landmarks";
import SavedPlace from "./SavedPlace";
import SavedRoutes from "./SavedRoutes";
import { Button, CloseButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { app, auth, db } from "../Firebase/firebase-config";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  deleteDoc, 
  GeoPoint, 
  query, 
  where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Navigate } from "react-router-dom";

import classes from "./NavBar.module.css";
import Directions from "./Directions";

import "@fontsource/montserrat";


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
  const [SRadded, setSRAdded] = useState(false);
  // For backend
  const savedRoutesRef = collection(db, "routes");

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
            return [...current, <p key={0}>Start</p>];
          } else if (current.length === searchBar.length - 1) {
            let newArray = [...current];
            newArray[current.length] = <p key={current.length}>End</p>;
            return newArray;
          } else {
            let newArray = [...current];
            newArray[current.length] = <p key={current.length}>Point</p>;
            return newArray;
          }
        });
        setSearchBarRemoval((current) => {
          if (current.length > 0) {
            let newArray = [...current];
            newArray[current.length] = (
              <CloseButton
                id={current.length}
                onClick={searchBarRemovalClicked}
              />
            );
            return newArray;
          } else {
            return [
              ...current,
              <CloseButton
                id={0}
                onClick={searchBarRemovalClicked}
                disabled={props.markers.length === 0}
              />,
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
    // setSRAdded(false);
    if (showRoute) {
      props.setRouteReq(true);
      props.setRouteState(true);
    } else { // false
        if(props.displaySR){
          props.setRouteState(false);
          props.setMarkers([]);
          props.setCleanRouteData({
            duration: null,
            distance: null,
            via: null,
            directions: [],
          });
          props.setrouteLatlngs([]);
          props.setDisplaySR(null);
        }
        else{
          props.setRouteState(false);
        }
    }
  }

  const [count, setCount] = useState(0);
  const addSavedRoute = async () => {
    const routeGeoPoints = props.routeLatlngs.map(
      (point) => new GeoPoint(point.lat, point.lng)
    );

    // console.log("markers: ", props.markers);
    const routeMarkers = props.markers.map((point) => (
      new GeoPoint(point.lat, point.lng)
    ))
    const markerNames = props.markers.map((point) => (point.address))
    const docRef = await addDoc(savedRoutesRef, {
      name: "route"+count,
      userId: props.userId,
      routeGeoPoints: routeGeoPoints,
      directions: props.cleanRouteData.directions,
      distance: props.cleanRouteData.distance,
      duration: props.cleanRouteData.duration,
      via: props.cleanRouteData.via,
      routeMarkers: routeMarkers,
      markerNames: markerNames,
    });

    setCount(count+1);
    
    // get newly added route
    const newDoc = await getDoc(docRef);
    const newRoute = {...newDoc.data(), id: docRef.id}
    console.log("NEW ROUTE: ", newRoute);
    props.setSRisChanged((prev)=>(!prev));
    props.setDisplaySR(newRoute);
    // setSRAdded(true);
  };

  const removeSavedRoute = async () => {
    console.log("ROUTE ID:  ", props.displaySR.id)
    const routeDoc = doc(db, "routes", props.displaySR.id);
    await deleteDoc(routeDoc);
    props.setDisplaySR(null);
    routeHandler(false);
    props.setSRisChanged((prev)=>(!prev));
    // setSRAdded(false);
  }

  let body, buttons;
  if (props.isRouted) {
    buttons = (
      <div>
        <Button variant="danger" onClick={() => routeHandler(false)}>
          Back
        </Button>
        { (props.displaySR) ? (
          <Button variant="secondary" onClick={removeSavedRoute}> Remove from Saved Routes </Button>
        ) 
        : (
          <Button variant="secondary" onClick={addSavedRoute}> Add to Saved Routes </Button>
        )
        }
      </div>
    );

    body = (
      <div>
        <Directions data={props.cleanRouteData} displaySR={props.displaySR}/>
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
        <Landmarks 
          setHistSite={props.setHistSite} 
          setMonument={props.setMonument}
          histSiteCheck={props.histSiteCheck}
          monumentCheck={props.monumentCheck}
        />
        <SavedPlace
          savedPlaces={props.savedPlaces}
          displaySP={props.displaySP}
          setDisplaySP={props.setDisplaySP}
        />
        <SavedRoutes
          savedRoutes={props.savedRoutes}
          setDisplaySR={props.setDisplaySR}
          displaySR={props.displaySR}
        />
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

          <div className={classes.button}>
            {buttons}
            <hr className={classes.rounded}></hr>
          </div>
         
          <div className={classes.body}>
            {body}
          </div>
          
      </div>
    );
  }
}

export default NavBar;
