import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Landmarks(props) {
  return (
    <div>
      <div>Landmarks</div>
      <Button onClick={()=> props.setHistSite(!props.histSiteCheck)}>historic sites</Button>
      <Button onClick={()=> props.setMonument(!props.monumentCheck)}>Monuments</Button>
    </div>
  )
}

export default Landmarks;
