
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

import classes from "./Directions.module.css";
import "@fontsource/montserrat";
import clock from "../Assets/clock.png";
import length from "../Assets/length.png";

  
  function Directions(props) {
    
    const listDirs = props.data.directions.map((dir) =>
        <div>
            <p className={classes.dir}>{dir}</p>
            <hr className={classes.rounded}></hr>
        </div>
    );
  
    return (
      <div className={classes.root}>
        <div className={classes.timeDistContainer}>
            <div className={classes.indivContainer}>
                <img className={classes.icon} src={clock} />
                <h1 className={classes.timeDist}> {props.data.duration} </h1>
            </div>

            <div className={classes.indivContainer}>
                <img className={classes.icon} src={length} />
                <h1 className={classes.timeDist}> {props.data.distance} </h1>
            </div>
        </div>

        <div className={classes.desc}>
            <h1 className={classes.title}>Via</h1>
            <p className={classes.text}> {props.data.via} </p>
        </div>

        <hr className={classes.rounded}></hr>
        
        <div className={classes.directions}>
            <h1 className={classes.title}>Directions</h1>
            {listDirs}
        </div>
      </div>
    );
  }
  
  export default Directions;
  