import React, { Component, useState, useEffect } from "react";
import "../App.css";
import "../styles/passenger.css";
import locationImage from "../assets/location-marker.jpg";
import taxi from "../assets/taxi.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import RideContract from "../contracts/Ride.json";
import getWeb3 from "../getWeb3";
import Web3 from "web3";

const API_KEY = "AIzaSyAuZoQ3lT4ixjYFtzRtqpydhvOM6bCG-vQ";

const Passenger = () => {
  // Singapore 1.3521° N, 103.8198° E
  const [state, setState] = useState({ web3: null, accounts: null, contract: null })
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });
  const [zoom, setZoom] = useState(12);
  const [destination, setDestination] = useState("");
  const [destinationLatLng, setDestinationLatLng] = useState({});
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition((position) => {
        console.log({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.log("Not Available");
      setCenter(null);
    }
  }, [center]);

  useEffect(()=>{
    console.log("Passenger's useEffect")
    const init = async () => {
      const web3 = new Web3(window.ethereum);
      const accounts = await getAccounts(web3);
      const contract = await getContract(web3);
    }
    init();
  },[])

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


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Submitted");
    console.log(destination);
    // axios
    //   .get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?components=country:SG|postal_code:${destination}&key=${API_KEY}`
    //   )
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error));
    // match_rides();
    // const accounts = await web3.eth.getAccounts();
    const web3 = new Web3(window.ethereum);
    console.log(web3)
    const accounts = await getAccounts(web3);
    const contract = await getContract(web3);
    const bestmatch = await contract.methods.match_rides(accounts[0],25,25).send({ from: accounts[0] });
    console.log("best match")
    console.log(bestmatch);
  };

  return (
    <div className="main">
      <div className="nav-bar nav-bar__center">
        <Link className="nav-bar-arrow" to="/login">
          <h1> {"<"} </h1>
        </Link>
        <h1> Enter destination</h1>
      </div>
      <div className="passenger-main">
        <img className="location-marker" src={locationImage}></img>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="location-container">
            <input
              className="location-container__input"
              placeholder="Current location"
              value={`Lat: ${center.lat} Lng: ${center.lng}`}
            ></input>
            <input
              className="location-container__input"
              value={destination}
              placeholder="Destination"
              onChange={(event) => setDestination(event.target.value)}
            ></input>
             <input
              className="location-container__input"
              value="0.00010"
              placeholder="Price"
            ></input>
            <div className="location-container__plus">
              <button type="submit" onClick={handleSubmit}>
                +
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="map redborder" style={{ height: "500px", width: "100%" }}>
        <GoogleMapReact
          defaultCenter={center}
          defaultZoom={zoom}
          center={center}
        >
          <AnyReactComponent
            lat={center.lat}
            lng={center.lng}
            text={"My Marker"}
          />
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default Passenger;

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      color: "white",
      background: "grey",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "100%",
      transform: "translate(-50%, -50%)",
    }}
  >
    {text}
  </div>
);
