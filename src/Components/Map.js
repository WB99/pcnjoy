import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const APIkey = process.env.REACT_APP_GOOGLE_MAPS_API;

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 1.3521,
      lng: 103.8198,
    },
    zoom: 13,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: APIkey }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={1.3521} lng={103.8198} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;
