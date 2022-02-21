import React from 'react';
import {Routes, Route, Link, BrowserRouter as Router} from "react-router-dom";
import Main from "./Main"

export default function Login(){
  return(
    <div>
      <h1>WELCOME TO PCNJOY FUCKHEAD</h1>
      <h2>LOG THE FUCK IN BITCH</h2>

      <a onClick={() => { window.location.href = '/main'; }}>
        Go to Main
      </a>
    </div>

    
  )
}