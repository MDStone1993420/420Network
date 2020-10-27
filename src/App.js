import React, {Component} from 'react'
import CannasseurNetwork from '../build/contracts/CannasseurNetwork.json'
import CannasseurRewards from '../build/contracts/CannasseurRewards.json'
import getWeb3 from './utils/getWeb3'
import Button from 'material-ui/Button';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom'
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import BecomeCannasseurForm from './components/forms/BecomeCannasseurForm.js'
import Header from './components/header.js'
import ActionGrid from './components/actionGrid.js'
import CannasseurInfo from './components/CannasseurInfo.js'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


const divStyle = {
  marginLeft:"50px",
  marginRight:"50px"
}


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({web3: results.web3})

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const cannasseurNetwork = contract(CannasseurNetwork)
    const cannasseurRewards = contract(CannasseurRewards)
    cannasseurRewards.setProvider(this.state.web3.currentProvider)
    cannasseurNetwork.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var cannasseurRewardsInstance
    var cannasseurNetworkInstance

    // Get accounts.
    this.state.web3.fourtwenty.getAccounts((error, accounts) => {
      cannasseurRewards.deployed().then((instance) => {
        cannasseurRewardsInstance = instance

        // Stores a given value, 5 by default.
        return cannasseurRewardsInstance.getNetworkAddress.call({from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        console.log(result)
        cannasseurNetworkInstance = cannasseurNetwork.at(result);

        return cannasseurNetworkInstance.numCannasseurs()
      }).then((result) => {
        // Update state with the result.
        return this.setState({storageValue: result.c[0]})
      })
    })
  }

  onChange(i, value, tab, ev) {
    console.log(arguments);
  }

  onActive(tab) {
    console.log(arguments);
  }
  handleSubmit(event) {
    event.preventDefault();
    ReactDOM.render(
      <MuiThemeProvider>
      <div>{< BecomeCannasseurForm />}</div>
    </MuiThemeProvider>, document.getElementById('root'));
  }
  render() {
    return (
      <MuiThemeProvider>

        <div>
          {< Header />}

          <div style={divStyle}>
            {<ActionGrid/>}
          </div>
          <div style={divStyle}>
          <h1>Cannasseur Info:</h1>
          {<CannasseurInfo/>}

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App
