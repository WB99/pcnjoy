import React, { Component } from "react";

class LoginPage extends Component {
  render() {
    return (
      <div>
        <h1>WELCOME TO PCNJOY FUCKHEAD</h1>
        <h2>LOG THE FUCK IN BITCH</h2>

        <a
          href="/main"
          onClick={() => {
            window.location.href = "/main";
          }}
        >
          Go to Main
        </a>
      </div>
    );
  }
}

export default LoginPage;