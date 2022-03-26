import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SavedPlace(props) {
  const [booleanArray, setBooleanArray] = useState([]);

  useEffect(() => {
    setBooleanArray([]);
    props.savedPlaces.forEach(() => {
      setBooleanArray((current) => {
        if (current.length > 0) {
          let newArray = [...current];
          newArray[current.length] = false;
          return newArray;
        } else {
          return [...current, false];
        }
      });
    });
  }, []);

  let body;
  if (props.savedPlaces.length > 0) {
    body = (
      <Form.Check
        type="switch"
        id="historic-sites"
        label="Historic Sites"
        defaultChecked={true}
        onClick={() => console.log("Clicked")}
      />
    );
  } else {
    body = <p>You have no saved places.</p>;
  }

  console.log("SavedPlaces: ", props.savedPlaces);
  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>SavedPlace</Accordion.Header>
          <Accordion.Body>{body}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default SavedPlace;
