import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../Firebase/firebase-config';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Navigate } from "react-router-dom"

function LoginPage() {

  const handleSignIn = () => {
    const google_provider = new GoogleAuthProvider();
    signInWithPopup( auth, google_provider)
    .then((re)=>{
      console.log(re);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  const [userSignIn, setUserSignIn] = useState(false);
  auth.onAuthStateChanged((user)=>{
    if(user) {
      return setUserSignIn(true);
    }
    else {
      setUserSignIn(false);
    }
  })

  console.log("user signed in? ", userSignIn);

  if (userSignIn) {
    return <Navigate to = "/main" />
  }
  else {
    return (
      <div>
        <h1>WELCOME TO PCNJOY FUCKHEAD</h1>
        <h2>LOG THE FUCK IN BITCH</h2>
        <Button onClick={handleSignIn}>Sign In with Google</Button>
        {/* <a
          href="/main"
          onClick={() => {
            window.location.href = "/main";
          }}
        >
          Go to Main
        </a> */}
      </div>
    );
  }
}

export default LoginPage;
