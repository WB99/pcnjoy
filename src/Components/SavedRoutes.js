import React from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SavedRoutes(props) {
  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>SavedRoutes</Accordion.Header>
          <Accordion.Body>
            <div>
              {props.savedRoutes.map((route) => (
                <div key={route.id}>{route.name}</div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default SavedRoutes;
