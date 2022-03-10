import React, { useCallback, useState, useRef, useEffect } from "react";
import Map from "../Components/Map";
import NavBar from "../Components/NavBar";
// import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MainPage.css";
import axios from "axios";



function MainPage() {
  const [coord, setCoord] = useState({ lat: 1.3521, lng: 103.8198 });
  const [markers, setMarkers] = useState([]);
  console.log(markers)
  var data;
  // get oneMapToken
  async function tokenData() { 
    const response = await fetch('http://127.0.0.1:9999/getToken', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    })
    const data = await response.json();
    return data;
      // .then(res => {
      //   return res.json()
      // })
      // .then(data => {
      //   return data;
      // })
      // .catch(error => console.log(error))
  }
  // console.log("API data: ", tokenData.access_token)
  

  // context api to make it global

  // oneMap Routing Api
  async function routeData() {
    await fetch('http://127.0.0.1:9999/route', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
          start: "1.3328572,103.74355220000007",
          end: "1.32283828324684,103.936051543997",
          routeType: "cycle",
          token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjgzOTUsInVzZXJfaWQiOjgzOTUsImVtYWlsIjoid29uZ3dlaWJpbjk5QGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTY0NjYzOTUxOCwiZXhwIjoxNjQ3MDcxNTE4LCJuYmYiOjE2NDY2Mzk1MTgsImp0aSI6ImFiODkwMjYxZTIxN2RiNDMzYzVkNGFmNThjMDcwNzU0In0.nt-tB8Hp4IQyhV_gmJgUfLWgqO2n_BalbWa-l0RIb8k"
      })
    }).then(res => {
      console.log("Result: ", res)
      return res.json()
    })
    .then(data => {
      console.log("Data: ", data)
      return data;
    })
    .catch(error => console.log(error))
  }
  
  console.log("route data: ", routeData())

  return (
    <div className="root">
      {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
      <div className="Map">
        <Map coord={coord} markers={markers} setMarkers={setMarkers} />
      </div>
      <div className="NavBar">
        <NavBar setCoord={setCoord} setMarkers={setMarkers} />
      </div>
    </div>
  );
}

export default MainPage;
