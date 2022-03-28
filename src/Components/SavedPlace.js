import React, { useState, useEffect } from "react";
import { Accordion, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SavedPlace(props) {
  const [savedPlacesSwitch, setSavedPlacesSwitch] = useState([]);

  useEffect(() => {
    setSavedPlacesSwitch([]);
    if (props.savedPlaces.length > 0) {
      props.savedPlaces.forEach((savedPlace) => {
        setSavedPlacesSwitch((current) => {
          if (current.length > 0) {
            let newArray = [...current];
            newArray[current.length] = (
              <Form.Check
                type="switch"
                id={savedPlace.id}
                label={savedPlace.name}
                defaultChecked={props.displaySP.includes(savedPlace)}
                onClick={handleClick}
              />
            );
            return newArray;
          } else {
            return [
              ...current,
              <Form.Check
                type="switch"
                id={savedPlace.id}
                label={savedPlace.name}
                defaultChecked={props.displaySP.includes(savedPlace)}
                onClick={handleClick}
              />,
            ];
          }
        });
      });
    }
    if (props.displaySP) {
      props.setDisplaySP((current) => {
        let newArray = [...current];
        for (var i = 0; i < props.displaySP.length; i++) {
          if (!props.savedPlaces.includes(newArray[i])) {
            newArray.splice(i, 1);
            break;
          }
        }
        return newArray;
      });
    }
  }, [props.savedPlaces]);

  const handleClick = (e) => {
    for (var i = 0; i < props.savedPlaces.length; i++) {
      if (e.target.id === props.savedPlaces[i].id) {
        break;
      }
    }
    if (e.target.checked) {
      props.setDisplaySP((current) => {
        if (current.length > 0) {
          let newArray = [...current];
          newArray[current.length] = props.savedPlaces[i];
          return newArray;
        } else {
          return [...current, props.savedPlaces[i]];
        }
      });
    } else {
      props.setDisplaySP((current) => {
        let newArray = [...current];
        for (var i = 0; i < current.length; i++) {
          if (newArray[i].id === e.target.id) {
            newArray.splice(i, 1);
            break;
          }
        }
        return newArray;
      });
    }
  };

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>SavedPlace</Accordion.Header>
          <Accordion.Body>
            {savedPlacesSwitch.length > 0 ? (
              savedPlacesSwitch
            ) : (
              <p>You have no saved places</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div>
        <div></div>
      </div>
    </div>
  );
}

export default SavedPlace;
