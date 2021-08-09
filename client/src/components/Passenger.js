import React, { Component, useState, useEffect } from "react";
import "../App.css";
import "../styles/passenger.css";
import locationImage from "../assets/location-marker.jpg";
import taxi from "../assets/taxi.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import axios from "axios";

const API_KEY = "AIzaSyAuZoQ3lT4ixjYFtzRtqpydhvOM6bCG-vQ";

const Passenger = () => {
  // Singapore 1.3521° N, 103.8198° E
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });
  const [zoom, setZoom] = useState(12);
  const [destination, setDestination] = useState("");
  const [destinationLatLng, setDestinationLatLng] = useState({});

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

  // useEffect(() => {
  //   console.log("destination");
  //   console.log(destination);
  // }, [destination]);

  const handleSubmit = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?components=country:SG|postal_code:${destination}&key=${API_KEY}`
      )
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    console.log("Form Submitted");
    console.log(destination);
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
