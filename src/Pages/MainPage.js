import React, { useState, useEffect } from "react";
import Map from "../Components/Map";
import NavBar from "../Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";

function MainPage() {
  const [coord, setCoord] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markers, setMarkers] = useState([]);
  const [token, setToken] = useState();
  const [routeData, setRouteData] = useState({});

  const [routeReq, setRouteReq] = useState(false);
  const [routeLatlngs, setrouteLatlngs] = useState([]);

  useEffect(() => {
    getToken();
  }, []);

  async function getToken() {
    try {
      const response = await fetch("http://127.0.0.1:9999/getToken", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      const data = await response.json();
      console.log("getToken Data: ", data);
      setToken(data.access_token);
    } catch (error) {
      console.log(error);
    }
  }

  // oneMap Routing Api
  async function getRoute(start, end) {
    try {
      const response = await fetch("http://127.0.0.1:9999/route", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          start: start,
          end: end,
          routeType: "cycle",
          token: token,
        }),
      });
      const data = await response.json();
      setRouteData(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function plotRoute() {
    await getRoute(markers[0].key, markers[1].key);
    const encoded = routeData.route_geometry;
    var polyUtil = require("polyline-encoded");
    const latlngArray = polyUtil.decode(encoded);
    var latlngs = [];
    latlngArray.forEach((item) => {
      const output = {
        lat: item[0],
        lng: item[1],
      };
      latlngs.push(output);
    });

    setrouteLatlngs(latlngs);
    setRouteReq(false);
  }

  if (routeReq) {
    plotRoute();
  }

  console.log("GETROUTE latlngs: ", routeLatlngs);
  return (
    <div className="root">
      <div className="Map">
        <Map
          routeLatlngs={routeLatlngs}
          coord={coord}
          markers={markers}
          setMarkers={setMarkers}
          routeData={routeData}
        />
      </div>
      <div className="NavBar">
        <NavBar
          setCoord={setCoord}
          markers={markers}
          setMarkers={setMarkers}
          setRouteReq={setRouteReq}
        />
      </div>
    </div>
  );
}

export default MainPage;
