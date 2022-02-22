import React from 'react';

function Login(){
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

export default Login;