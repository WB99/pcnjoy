import React, { useState, useEffect } from "react";
import Map from "../Components/Map";
import NavBar from "../Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./MainPage.module.css";

function MainPage() {
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [coord, setCoord] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState();
  const [routeData, setRouteData] = useState([])
  const [cleanRouteData, setCleanRouteData] = useState(
    {
      duration: null,
      distance: null,
      via: null,
      directions: []
    })
  
  const [routeReq, setRouteReq] = useState(false)
  const [isRouted, setRouteState] = useState(false);
  const [routeLatlngs, setrouteLatlngs] = useState([]);
  
  const [histSiteCheck, setHistSite] = useState(false);
  const [monumentCheck, setMonument] = useState(false);


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
      setToken(data.access_token);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const getAllRoutes = async () => {
      let routes = []
      for(let i = 0; i < (markers.length-1); i++) {
        const route = await getRoute(markers[i].key, markers[i+1].key);
        routes = [...routes, route]
      }
      setRouteData(routes) // set route data only once
      setRouteReq(false)  // reset routereq to false
    }

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
        return data
        
      } catch (error) {
        console.log(error);
      }
      // ERROR HANDLE NO ROUTE FOUND!!
    }

    // Action
    if (routeReq) { // check to ensure getAllRoutes() only called when routeReq true
      getAllRoutes()
    }
  }, [routeReq])

  useEffect(() => {
    const plot = async () => {
      if (routeData.length > 0) {
        await plotRoute()
      }
    }
    plot()

    async function plotRoute() {
      // data cleaning
      var timeSeconds = 0;
      var dist = 0;
      var viaArray = [];
      var directions = []

      for(let k = 0; k < routeData.length; k++){
        timeSeconds += routeData[k].route_summary.total_time;        
        dist += routeData[k].route_summary.total_distance;
        viaArray = viaArray.concat(routeData[k].route_name);
        routeData[k].route_instructions.forEach((item) => {
          directions.push(item[9])
        })
      }
      
      const timeHM = (timeSeconds >= 3600 ? 
        Math.floor(timeSeconds/3600) + "hr " + Math.floor(timeSeconds%3600/60) + "min" :
        Math.floor(timeSeconds/60) + "min"
      )
      const distKm = Math.round(dist/1000) + "km";
      const via = viaArray.join(", ")

      setCleanRouteData({
        duration: timeHM,
        distance: distKm,
        via: via,
        directions: directions
      })
  
      // decode polyline
      var latlngs = [];
      // console.log("route data length ", routeData.length)
      for(let j = 0; j < routeData.length; j++){
        // console.log("INSIDELOOP: ")
  
        // console.log("routeGeometry: ", routeData[j].route_geometry)
        var encoded = routeData[j].route_geometry;
        var polyUtil = require("polyline-encoded");
        var latlngArray = polyUtil.decode(encoded);
        
        // console.log("LATLNG ARRAY: ", latlngArray)
  
        latlngArray.forEach((item) => {
          var output = {
            lat: item[0],
            lng: item[1]
          }
          latlngs.push(output)
        })
      }
  
      // console.log("LATLNG ARRAY: ", latlngs)
      // setRouteReq(false)
      setrouteLatlngs(latlngs)
    }
    // oneMap Routing Api
  }, [routeData])

  // console.log("route req: ", routeReq)
  // console.log("ROUTE DATA HERE: ", routeData)
  // console.log("MARKERSSS: ", markers)
  // console.log("LATLONGSS: ", routeLatlngs)

  return (
    <div className={classes.root}>
      <div className={classes.Map}>
        <Map
          setMapsLoaded={setMapsLoaded}
          routeLatlngs={routeLatlngs}
          coord={coord}
          markers={markers}
          setMarkers={setMarkers}
          selected={selected}
          setSelected={setSelected}
          address={address}
          setAddress={setAddress}
          routeData={routeData}
          setHistSite={setHistSite}
          histSiteCheck={histSiteCheck}
          setMonument={setMonument}
          monumentCheck={monumentCheck}
        />
      </div>
      <div className={classes.NavBar}>
        <NavBar
          mapsLoaded={mapsLoaded}
          setCoord={setCoord}
          markers={markers}
          setMarkers={setMarkers}
          address={address}
          setAddress={setAddress}
          setRouteReq={setRouteReq}
          setRouteState={setRouteState}
          isRouted={isRouted}
          cleanRouteData={cleanRouteData}
          setrouteLatlngs={setrouteLatlngs}
          setHistSite={setHistSite}
          histSiteCheck={histSiteCheck}
          setMonument={setMonument}
          monumentCheck={monumentCheck}
        />
      </div>
    </div>
  );
}

export default MainPage;
