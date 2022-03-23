import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import historicSites from "../Assets/historic-sites.json";
import monuments from "../Assets/monuments.json";



const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 1.3521,
  lng: 103.8198,
};
const options = {
  disableDefaultUI: true,
};

const markersLimit = 5;

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API);
Geocode.enableDebug();

function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });
  const [check, setCheck] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (mapRef.current && props.coord && isMounted) {
      mapRef.current.panTo(props.coord);
    }
    setSelected(null);
    return () => {
      isMounted = false;
    };
  }, [props.coord]);

  const onMapClick = useCallback((event) => {
    try {
      setSelected(null);
      setCheck(() => ({
        key: `${event.latLng.lat()},${event.latLng.lng()}`,
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        isLandmark: false
      }));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const addPointToRoute = () => {
    props.setRouteState(false);
    props.setMarkers((current) => {
      if (current.length > 0) {
        let newArray = [...current];
        newArray[current.length] = {
          key: `${selected.lat},${selected.lng}`,
          address: (selected.isLandmark ? `${selected.key}` : `${props.address}`),
          lat: selected.lat,
          lng: selected.lng,
        };
        return newArray;
      } else {
        return [
          ...current,
          {
            key: `${selected.lat},${selected.lng}`,
            address: (selected.isLandmark ? `${selected.key}` : `${props.address}`),
            lat: selected.lat,
            lng: selected.lng,
          },
        ];
      }
    });
    setSelected(null);
    setCheck(null);
  };

  const removePointFromRoute = () => {
    props.setRouteState(false);
    props.setMarkers((current) => {
      let newArray = [...current];
      for (var i = 0; i < newArray.length; i++) {
        if (newArray[i].key === selected.key) {
          newArray.splice(i, 1);
          break;
        }
      }
      return newArray;
    });
    setCheck(selected);
    setSelected(null);
  };

  const addSavedPlace = () => {
    props.setSavedPlaces((current) => {
      if (current.length > 0) {
        let newArray = [...current];
        newArray[current.length] = selected;
        return newArray;
      } else {
        return [...current, selected];
      }
    });
  };

  const removeSavedPlace = () => {
    props.setSavedPlaces((current) => {
      let newArray = [...current];
      for (var i = 0; i < newArray.length; i++) {
        if (newArray[i].key === selected.key) {
          newArray.splice(i, 1);
          break;
        }
      }
      return newArray;
    });
  };


  if (!isLoaded) {
    return "Loading Maps";
  } else {
    props.setMapsLoaded(true);
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {props.markers.map((marker) => (
          <Marker
            key={`${marker.lat},${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {props.histSiteCheck ? (historicSites.map(landmark => (
          <Marker
            key = {landmark.name}
            position = {{lat:landmark.lat, lng:landmark.long}}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
            onClick={() => {
              setSelected({
                key: landmark.name,
                lat:landmark.lat, 
                lng:landmark.long, 
                isLandmark:true
              });
            }}
          />
        ))) : null}

        {props.monumentCheck ? (monuments.map(landmark => (
          <Marker
            key = {landmark.name}
            position = {{lat:landmark.lat, lng:landmark.long}}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
            onClick={() => {
              setSelected({
                key: landmark.name,
                lat:landmark.lat, 
                lng:landmark.long, 
                isLandmark:true
              });
            }}
          />
        ))) : null}

        {check ? (
          <Marker
            key={`${check.lat}, ${check.lng}`}
            position={{ lat: check.lat, lng: check.lng }}
            onClick={() => {
              setSelected(check);
            }}
            onRightClick={() => {
              setCheck(null);
              setSelected(null);
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        ) : null}

        {selected ? (
          <InfoWindow
            options={{ pixelOffset: new window.google.maps.Size(-1, -35) }}
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
              props.setAddress(null);
            }}
          >
            <div>
              <div>
                { selected.isLandmark ? (<h5>{selected.key}</h5>) : (
                    Geocode.fromLatLng(selected.lat, selected.lng).then(
                      (Response) => {
                          props.setAddress(
                          Response.results[0].formatted_address
                            .toString()
                            .replace(/(, )*Singapore( (\d)*)?/, "")
                        );
                      },
                      (Error) => {
                        console.log(Error);
                      }
                    ) ? (
                      <h5>{props.address ? props.address : "Invalid Address"}</h5>
                    ) : (
                      <h5>Invalid Address</h5>
                    )
                )
                }
              </div>
              <p>
                {parseFloat(selected.lat).toFixed(3)},{" "}
                {parseFloat(selected.lng).toFixed(3)}
              </p>
              {props.savedPlaces.includes(selected) ? (
                <Button onClick={removeSavedPlace}>
                  Remove from Saved Place
                </Button>
              ) : (
                <Button onClick={addSavedPlace}>Add to Saved Place</Button>
              )}
              {props.markers.includes(selected) ? (
                <Button onClick={removePointFromRoute}>
                  Remove Point from Route
                </Button>
              ) : (
                <Button
                  onClick={addPointToRoute}
                  disabled={props.markers.length >= markersLimit}
                >
                  Add Point to Route
                </Button>
              )}
            </div>
          </InfoWindow>
        ) : null}

        <Polyline
          path={props.routeLatlngs}
          geodesic={true}
          options={{
            strokeColor: "#ff2527",
            strokeOpacity: 0.75,
            strokeWeight: 2,
          }}
        />
      </GoogleMap>
    </div>
  );
}

export default Map;
