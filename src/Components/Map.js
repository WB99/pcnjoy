import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API);
Geocode.enableDebug();

function Map(props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(null);
  const [check, setCheck] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (mapRef.current && props.coord && isMounted) {
      mapRef.current.panTo(props.coord);
      mapRef.current.setZoom(14);
    }
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
    console.log("AddPointToRoute");
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

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
            opacity={0.5}
          />
        ) : null}

        {selected ? (
          <InfoWindow
            options={{ pixelOffset: new window.google.maps.Size(-1, -35) }}
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
              setAddress(null);
            }}
          >
            <div>
              {Geocode.fromLatLng(selected.lat, selected.lng).then(
                (Response) => {
                  setAddress(Response.results[0].formatted_address);
                },
                (Error) => {
                  console.log(Error);
                }
              ) ? (
                <h5>
                  {address
                    ? address.toString().replace(/(, )*Singapore( (\d)*)?/, "")
                    : "Invalid Address"}
                </h5>
              ) : (
                <h5>Invalid Address</h5>
              )}
              <p>
                {parseFloat(selected.lat).toFixed(3)},{" "}
                {parseFloat(selected.lng).toFixed(3)}
              </p>
              <Button>Add to Saved Place</Button>{" "}
              <Button onClick={addPointToRoute}>Add Point to Route</Button>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

export default Map;
