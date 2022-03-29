import React, { useState, useEffect } from "react";
import { Accordion, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { app, auth, db } from "../Firebase/firebase-config";
import {
  collection,
  doc,
  updateDoc
} from "firebase/firestore";


function SavedPlace(props) {
  // const [savedPlacesSwitch, setSavedPlacesSwitch] = useState([]);

  // useEffect(() => {
  //   // setSavedPlacesSwitch([]);
  //   // if (props.savedPlaces.length > 0) {
  //   //   props.savedPlaces.forEach((savedPlace) => {
  //   //     setSavedPlacesSwitch((current) => {
  //   //       if (current.length > 0) {
  //   //         let newArray = [...current];
  //   //         newArray[current.length] = (
  //   // <Form.Check
  //   //   type="switch"
  //   //   id={savedPlace.id}
  //   //   label={savedPlace.name}
  //   //   defaultChecked={props.displaySP.includes(savedPlace)}
  //   //   onClick={handleClick}
  //   // />
  //   //         );
  //   //         return newArray;
  //   //       } else {
  //   //         return [
  //   //           // ...current,
  //   //           <Form.Check
  //   //             type="switch"
  //   //             id={savedPlace.id}
  //   //             label={savedPlace.name}
  //   //             defaultChecked={props.displaySP.includes(savedPlace)}
  //   //             onClick={handleClick}
  //   //           />,
  //   //         ];
  //   //       }
  //   //     });
  //   //   });
  //   // }

  //   if (props.displaySP) {
  //     console.log("SAVED PLACES: ", props.savedPlaces);
  //     for (var i=0; i < props.displaySP.length; i++) {
  //       if (!props.savedPlaces.includes(props.displaySP[i])) {
  //         props.setDisplaySP((current) => {
  //           let newArray = [...current];
  //           newArray.splice(i, 1);
  //           return newArray
  //         })
  //         break;
  //       }
  //     }
  //     // props.setDisplaySP((current) => {
  //     //   let newArray = [...current];
  //     //   for (var i = 0; i < props.displaySP.length; i++) {
  //     //     if (!props.savedPlaces.includes(newArray[i])) {
  //     //       newArray.splice(i, 1);
  //     //       break;
  //     //     }
  //     //   }
  //     //   return newArray;
  //     // });
  //   }


  const handleClick = (e) => {
    if(e.target.checked) {
      props.setDisplaySP(props.savedPlaces)
    } else {
      props.setDisplaySP([])
    }
  };

  function showPlace(place) {
    props.setCoord({ lat: place.lat, lng: place.lng});
    // convert place into selected
    const sp = {
      key: (place.lat).toString() + ", " + (place.lng).toString(),
      address: place.name,
      lat: place.lat,
      lng: place.lng,
      isSaved: true,
      id: place.id,
    }
    props.setPanToSP(sp);
  }

  // console.log("Display: ", props.displaySP);
  // console.log("Switches: ", savedPlacesSwitch);

  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Saved Places</Accordion.Header>
          <Accordion.Body>
            <div>
              {(props.savedPlaces.length) > 0 ? (
                <Form.Check
                type="switch"
                id="saved-places"
                label="Show All"
                defaultChecked={true}
                onClick={handleClick}
                />
              ) : (
                <p>You have no saved places</p>
              )}
            </div>
              {(props.savedPlaces.length) > 0 ? (
                props.savedPlaces.map((place) => (
                  <div>
                    <Button variant="link"  
                        onClick={() => showPlace(place)}>{place.name}
                    </Button>
                  </div>
                ))
              ) : null}
            <div>

            </div>
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
