import React, { Component } from 'react';
import SimpleMap from "./Map";
import NavBar from './NavBar';

import "./MainPage.css";

class MainPage extends Component {
  render() {
    return(
      <div className='root'>
        <div className='Map'>
          <SimpleMap/>
        </div>
        <div className='NavBar'>
          <NavBar/>
        </div>
      </div>
    )
  }
}

export default MainPage;