import React, { Component } from "react";
import "../App.css"; 
import "../styles/driver.css";
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

const passengers = [
  {
    id: 0,
    name: "name",
  },
  {
    id: 1,
    name: "name",
  },
  {
    id: 2,
    name: "name",
  },
]

const Driver = () => {
  return (
    <div className="main">
      <div className="nav-bar nav-bar__center">
        <h1 className="main-header"> Denoriel</h1>
      </div>
      <div className="driver-main">
        <div className="driver-main__header">
          <h1 className="driver-main__header-text"> Connecting you to passengers...</h1>
        </div>
        { passengers.map((passenger)=>{
            return(
            <div className="passenger-container">
              <h5> Passenger: {passenger.name}</h5>
              <h5> ID: {passenger.id} </h5>
            </div>)
          })
        }
      </div>
    </div>
  )
}

export default Driver;