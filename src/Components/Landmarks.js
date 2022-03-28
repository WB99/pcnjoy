import React from "react";
import { Accordion, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Landmarks(props) {
  return (
    <div>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Landmarks</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Check
                type="switch"
                id="historic-sites"
                label="Historic Sites"
                defaultChecked={props.histSiteCheck}
                onClick={() => props.setHistSite(!props.histSiteCheck)}
              />
              <Form.Check
                type="switch"
                id="monuments"
                label="Monuments"
                defaultChecked={props.monumentCheck}
                onClick={() => props.setMonument(!props.monumentCheck)}
              />
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Landmarks;
