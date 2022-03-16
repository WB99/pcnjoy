import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../Firebase/firebase-config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Navigate } from "react-router-dom"
import classes from  "./LoginPage.module.css";
import "@fontsource/montserrat";

function LoginPage() {

  const handleSignIn = () => {
    const google_provider = new GoogleAuthProvider();
    signInWithPopup(auth, google_provider)
      .then((re) => {
        console.log(re);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [userSignIn, setUserSignIn] = useState(false);
  auth.onAuthStateChanged((user) => {
    if (user) {
      return setUserSignIn(true);
    } else {
      setUserSignIn(false);
    }
  });

  console.log("user signed in? ", userSignIn);

  if (userSignIn) {
    return <Navigate to="/main" />;
  } else {
    return (
      <div className={classes.root}>
        <div className={classes.loginformbackground}>
          <div className = {classes.loginform}>
            <h1 className={classes.title}>PCNjoy</h1>
            <h2 className={classes.subtitle}>Welcome</h2>
            <p className={classes.text}>Sign in to plan your next adventure!</p>
            
            <Button className={classes.button} onClick={handleSignIn}>Sign In with Google</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
