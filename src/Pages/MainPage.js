import React, { useCallback, useState, useRef, useEffect } from "react";
import Map from "../Components/Map";
import NavBar from "../Components/NavBar";
// import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";
import axios from "axios";
import { Button } from "react-bootstrap";



function MainPage() {
  const [coord, setCoord] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markers, setMarkers] = useState([]);
  const [token, setToken] = useState();
  const [routeData, setRouteData] = useState({})
  
  const [routeReq, setRouteReq] = useState(false)
  const [routeLatlngs, setrouteLatlngs] = useState([])

  console.log(markers)

  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    getRoute("1.3634,103.8436", "1.3777,103.8977")
  }, [routeReq])

  async function getToken() {
    try {
      const response = await fetch('http://127.0.0.1:9999/getToken', {
            method: 'POST',
            headers: {'content-type': 'application/json'}
        })
      
      const data = await response.json()
      console.log("getToken Data: ", data)
      setToken(data.access_token)

    } catch(error) {
      console.log(error)
    }
  }

  // oneMap Routing Api
  async function getRoute(start, end) {
    try {
      const response = await fetch('http://127.0.0.1:9999/route', {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            start: start,
            end: end,
            routeType: "cycle",
            token: token
        })
      })
      const data = await response.json()
      // console.log("getRoute Data: ", data)
      setRouteData(data)
    } catch(error) {
      console.log(error)
    }
  }

  console.log("route data: ", routeData)
  
  
  function plotRoute() {
    const encoded = routeData.route_geometry;
    console.log("encoded: ", encoded)

    var polyUtil = require('polyline-encoded');

    const latlngArray = polyUtil.decode(encoded);
    
    // creds to matt
    var latlngs = []
    latlngArray.forEach((item) =>{
      const output = {
        lat: item[0],
        lng: item[1]
      }
      latlngs.push(output)
    })

    setrouteLatlngs(latlngs)
    console.log("latlngs: ", routeLatlngs)
  }

  return (
    <div className="root">
      {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
      <div className="Map">
        <Map routeLatlngs={routeLatlngs} coord={coord} markers={markers} setMarkers={setMarkers} />
      </div>
      <div className="NavBar">
        <NavBar setCoord={setCoord} markers={markers} setMarkers={setMarkers} />
        <Button onClick={() => setRouteReq(true)}> ROUTE </Button>
        <Button onClick={() => plotRoute()}> PLOT </Button>
      </div>
    </div>
  );
}

export default MainPage;
