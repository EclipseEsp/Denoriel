import React, { Component } from "react";
import "../App.css"; 
import "../styles/login.css";
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Denoriel from "../assets/Denoriel.jpg";

const Login = () =>{
  return(
    <div className="main">
      <img src={Denoriel} className="main-image"></img>
        {/* <h1 className="main-header">Denoriel</h1> */}
        <h1> username </h1>
        <input placeholder="username"></input>
        <h1> password </h1>
        <input placeholder="password"></input>
        <div>
          <Link to="/passenger">
            <button>Login</button>
          </Link>
        </div>
    </div>
  )
}

export default Login;