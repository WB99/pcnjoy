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
          lat: props.selected.lat,
          lng: props.selected.lng,
        };
        return newArray;
      } else {
        return [
          ...current,
          {
            key: `${props.selected.lat},${props.selected.lng}`,
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
              props.setSelected(marker);
            }}
          />
        ))}

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
              {Geocode.fromLatLng(props.selected.lat, props.selected.lng).then(
                (Response) => {
                  props.setAddress(Response.results[0].formatted_address);
                },
                (Error) => {
                  console.log(Error);
                }
              ) ? (
                <h5>
                  {props.address
                    ? props.address
                        .toString()
                        .replace(/(, )*Singapore( (\d)*)?/, "")
                    : "Invalid Address"}
                </h5>
              ) : (
                <h5>Invalid Address</h5>
              )}
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
