import React, { useEffect, useState } from "react";
import { Button, Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./SavedRoutes.module.css";
import "@fontsource/montserrat";
import clock from "../Assets/clock.png";
import length from "../Assets/length.png";

function SavedRoutes(props) {
  function displayRoute(route) {
    props.setDisplaySR(route);
  }

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Saved Routes</Accordion.Header>
          <Accordion.Body>
            <div>
              {props.savedRoutes.map((route) => (
                <div className={classes.route}>
                  <div className={classes.indivContainer}>
                    <Button variant="link" className={classes.button} 
                      onClick={() => displayRoute(route)}>{route.name}</Button>
                  </div>

                  <div className={classes.indivContainer}>
                      <img className={classes.icon} src={clock} />
                      <h1 className={classes.text}> {route.duration} </h1>
                  </div>

                  <div className={classes.indivContainer}>
                      <img className={classes.icon} src={length} />
                      <h1 className={classes.text}> {route.distance} </h1>
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default SavedRoutes;
