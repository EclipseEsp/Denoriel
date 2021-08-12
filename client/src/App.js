import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import RideContract from "./contracts/Ride.json";
import getWeb3 from "./getWeb3";
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom"

import "./App.css";
import Login from "./components/Login"
import Passenger from "./components/Passenger";
import Driver from "./components/Driver";
import Confirmation from "./components/Confirmation"

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RideContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RideContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log(accounts)
      console.log(instance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  runExample = async () => {
    const { accounts, contract } = this.state;
    
    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    await contract.methods.match_rides(accounts[0],25,25).send({ from: accounts[0] });

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };


  render() {
    // const addDriver = async function () {
    //   const { accounts, contract } = this.state;
    //   await contract.methods.addDriver(accounts[0],50,50).send({ from: accounts[0] });
    // }

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router>
          <div className="admin-panel">
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/passenger">Passenger</Link>
              </li>
              <li>
                <Link to="/driver">Driver</Link>
              </li>
              <li>
                <Link to="/confirmation">Confirmation</Link>
              </li>
            </ul>
          </div>
          <Switch>
            <Route exact path="/">
              <App />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/passenger">
              <Passenger />
            </Route>
            <Route exact path="/driver">
              <Driver />
            </Route>
            <Route exact path="/confirmation">
              <Confirmation />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

  {/* <div className="main">
    <img></img>
    <h1 className="main-header">Denoriel</h1>
    <h1> username </h1>
    <input placeholder="username"></input>
    <h1> password </h1>
    <input placeholder="password"></input>
    <div>
      <button>Login</button>
    </div>
  </div> */}

  {/* <h1>Good to Go!</h1>
  <p>Your Truffle Box is installed and ready.</p>
  <h2>Smart Contract Example</h2>
  <p>
    If your contracts compiled and migrated successfully, below will show
    a stored value of 5 (by default).
  </p>
  <p>
    Try changing the value stored on <strong>line 42</strong> of App.js.
  </p>
  <div>The stored value is: {this.state.storageValue}</div> */}