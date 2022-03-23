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

  useEffect(() => {
    let isMounted = true;
    if (mapRef.current && props.coord && isMounted) {
      mapRef.current.panTo(props.coord);
    }
    props.setSelected(null);
    return () => {
      isMounted = false;
    };
  }, [props.coord]);

  const onMapClick = useCallback((event) => {
    try {
      props.setSelected(null);
      setCheck(() => ({
        key: `${event.latLng.lat()},${event.latLng.lng()}`,
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
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
    props.setMarkers((current) => {
      if (current.length > 0) {
        let newArray = [...current];
        newArray[current.length] = {
          key: `${props.selected.lat},${props.selected.lng}`,
          address: (props.selected.isLandmark ? `${props.selected.key}` : `${props.address}`),
          lat: props.selected.lat,
          lng: props.selected.lng,
        };
        return newArray;
      } else {
        return [
          ...current,
          {
            key: `${props.selected.lat},${props.selected.lng}`,
            address: (props.selected.isLandmark ? `${props.selected.key}` : `${props.address}`),
            lat: props.selected.lat,
            lng: props.selected.lng,
          },
        ];
      }
    });
    props.setSelected(null);
    setCheck(null);
  };

  const removePointToRoute = () => {
    props.setMarkers((current) => {
      let newArray = [...current];
      for (var i = 0; i < newArray.length; i++) {
        if (newArray[i].key === props.selected.key) {
          newArray.splice(i, 1);
          break;
        }
      }
      return newArray;
    });
    setCheck(props.selected);
    props.setSelected(null);
  };

  // check if landmark and set address title
  // useEffect(() => {
  //conditionally render infocard address title - set to landmark name if landmark
    // if (props.selected.isLandmark) {
    //   props.setAddress(props.selected.key) 
    // }
  // }, [props.selected])

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
              props.setSelected(marker);
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
              props.setSelected({
                key: landmark.name,
                lat:landmark.lat, 
                lng:landmark.long, 
                isLandmark:true
              });
              // props.setAddress(props.selected.key) 
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
              props.setSelected({
                key: landmark.name,
                lat:landmark.lat, 
                lng:landmark.long, 
                isLandmark:true
              });
              // props.setAddress(props.selected.key) 
            }}
          />
        ))) : null}

        {check ? (
          <Marker
            key={`${check.lat}, ${check.lng}`}
            position={{ lat: check.lat, lng: check.lng }}
            onClick={() => {
              props.setSelected(check);
            }}
            onRightClick={() => {
              setCheck(null);
              props.setSelected(null);
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        ) : null}

        {props.selected ? (
          <InfoWindow
            options={{ pixelOffset: new window.google.maps.Size(-1, -35) }}
            position={{ lat: props.selected.lat, lng: props.selected.lng }}
            onCloseClick={() => {
              props.setSelected(null);
              props.setAddress(null);
            }}
          >
            <div>
              <div>
                { props.selected.isLandmark ? (<h5>{props.selected.key}</h5>) : (
                    Geocode.fromLatLng(props.selected.lat, props.selected.lng).then(
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
                {parseFloat(props.selected.lat).toFixed(3)},{" "}
                {parseFloat(props.selected.lng).toFixed(3)}
              </p>
              {false ? (
                <Button>Remove from Saved Place</Button>
              ) : (
                <Button>Add to Saved Place</Button>
              )}
              {props.markers.includes(props.selected) ? (
                <Button onClick={removePointToRoute}>
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
