import React, { Component, useState, useEffect } from "react";
import "../App.css";
import "../styles/confirmation.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Denoriel from "../assets/Denoriel.jpg";
import RideContract from "../contracts/Ride.json";
import getWeb3 from "../getWeb3";
import Web3 from "web3";

const Confirmation = ({pickup,destination,price}) => {
  const [pickup2,setPickup] = useState(pickup)
  const [destination2,setDestination] = useState(destination)
  const [price2,setPrice]  = useState(price)
  
  useEffect(()=>{
    setPickup(pickup)
    setDestination(destination)
    setPrice(price)
  },[pickup,destination,price])

  const getAccounts = async(web3) => {
    const accounts = await web3.eth.getAccounts()
    console.log("ACCOUNTS")
    console.log(accounts)
    return accounts;
  }
  const getContract = async(web3) => {
    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = RideContract.networks[networkId];
    const instance = new web3.eth.Contract(
      RideContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
    console.log("INSTANCE")
    console.log(instance)
    return instance
  }

  return (
    <div className="main">
      <div className="nav-bar nav-bar__center">
        <img src={Denoriel} className="main-image"></img>
      </div>
      <div className="driver-main">
        <div className="driver-main__header">
          <h1 className="driver-main__header-text"> Your Ride Details </h1>
        </div>
        <div className="driver-finished">
          <h5> {`Pickup Location: Lat: 1.33518 Lng: 103.9724254`}</h5>
          <h5> {`Destination: Geylang Lorang`}</h5>
          <h5> {`Price: eth: 0.00012`} </h5>
          <h5> {`Car Plate: XYZ1234`} </h5>
          <Link to="/passenger">
            <button> Finish </button>
            <button> Cancel </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Confirmation;