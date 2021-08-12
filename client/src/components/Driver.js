import React, { Component, useState, useEffect } from "react";
import "../App.css"; 
import "../styles/driver.css";
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Denoriel from "../assets/Denoriel.jpg";
import RideContract from "../contracts/Ride.json";
import getWeb3 from "../getWeb3";
import Web3 from "web3";


const Driver = () => {
  const [state, setState] = useState({ web3: null, accounts: null, contract: null })
  const [passengers,setPassengers] = useState([
    {
      id: 0,
      name: "name",
      location: "Tampines",
      price: "eth: 0.00010"
    },
    {
      id: 1,
      name: "name",
      location: "Paya Lebar",
      price: "eth: 0.00012"
    },
    {
      id: 2,
      name: "name",
      location: "Geylang Lorang",
      price: "eth: 0.00015"
    },
  ])

  useEffect(()=>{
    const init = async () => {
      console.log("Driver's useEffect")
      const web3 = new Web3(window.ethereum);
      const accounts = await getAccounts(web3);
      const contract = await getContract(web3);
      // const passengers = await getPassengersList(web3)
      await contract.methods.addDriver(accounts[0],50,50).send({ from: accounts[0] });
      // const bestMatch = await getBestMatch(web3);
      //console.log("Passengers:",passengers)
      // console.log("Bestmatch:", bestMatch)
    }
    init();
  },[])

  useEffect(() => {
    const intervalId = setInterval( async() => {
      const web3 = new Web3(window.ethereum);
      const bestMatch = await getBestMatch(web3);
      }
    ,10000)
    return () => clearInterval(intervalId);
    
  }, []);

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

  const getPassengersList = async (web3) => {
    const contract = await getContract(web3)
    const passengers = contract.methods.Drivers(0).call().then(response=>response);
    return passengers
  }

  const getBestMatch = async (web3) => {
    try{
      const accounts = await getAccounts(web3)
      const contract = await getContract(web3)
      console.log("TEST")
      const bestMatch = await contract.methods.getBestMatch(accounts[0]).call();
      console.log("bestMatch", bestMatch);  
      return bestMatch
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="main">
      <div className="nav-bar nav-bar__center">
        <img src={Denoriel} className="main-image"></img>
      </div>
      <div className="driver-main">
        <div className="driver-main__header">
          <h1 className="driver-main__header-text"> Connecting you to passengers...</h1>
        </div>
        { passengers.map((passenger)=>{
            return(
            <div className="passenger-container">
              <h5> Passenger: {passenger.name}</h5>
              <h5> {`ID: ${passenger.id}` } </h5>
              <h5> {`Destination: ${passenger.location}` }</h5>
              <h5> {`Current Location: ${"Lat: 1.33518 Lng: 103.9724254"}` } </h5>
              <h5> {`Price: ${passenger.price}`}</h5>
              <Link to=
              {{pathname:"/confirmation",
               state: { 
                 pickup:"Lat: 1.33518 Lng: 103.9724254",
                 destination: passenger.location,
                 price: passenger.price  }}}
               >
                <button onClick={()=>{setPassengers(passengers.filter((item)=> item.id !== passenger.id))}}> Accept </button>
              </Link>
              <button onClick={()=>{setPassengers(passengers.filter((item)=> item.id !== passenger.id))}}> Reject </button>
            </div>)
          })
        }
      </div>
    </div>
  )
}

export default Driver;