import React, { useEffect, useState } from "react";



function SavedRoutes(props) {
  // function displayRoute() {

  // }
  return (<div>
    <div>Saved Routes</div>
      <div>
        {props.savedRoutes.map((route) => (
          <div key={route.id}>{route.name}</div>
        ))}
      </div>
  </div>
);
}

export default SavedRoutes;
