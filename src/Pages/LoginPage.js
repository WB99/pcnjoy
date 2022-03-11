import React, {useState} from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../Firebase/firebase-config';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Navigate } from "react-router-dom"
import "./LoginPage.css";

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

      
      <div className='login-root'>

      <div className='loginformbackground'>
        <div className = 'loginform'>
        <h1>PCNjoy</h1>
        <h2>Welcome</h2>
        <p>Sign in to plan your next adventure!</p>
        
        <Button className='button' onClick={handleSignIn}>Sign In with Google</Button>
        </div>
        </div>

        {
        
        /* <a
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
