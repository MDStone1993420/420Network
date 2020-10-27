import React, {Component} from 'react'
import CannasseurNetwork from '../../../build/contracts/CannasseurNetwork.json'
import CannasseurRewards from '../../../build/contracts/CannasseurRewards.json'
import getWeb3 from '../../utils/getWeb3'
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom'
import {keystore, txutils} from 'fourtwenty-lightwallet'
import tx from 'fourtwentyjs-tx'
import Header from '../header.js'
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Alert from '../alert.js';




const styles  = {
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
  },
};


class AddModerator extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      modAddress: '',
      privateKey: '',
      web3: null
    }
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModChange = this.handleModChange.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({web3: results.web3})
      // Instantiate contract once web3 provided.
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  // on change of form values these states are updatd
  handleKeyChange(event) {
    this.setState({privateKey: event.target.value});
  }

  handleAddressChange(event) {
    this.setState({address: event.target.value});
  }

  handleModChange(event) {
    this.setState({modAddress: event.target.value})
  }
  // on form submit this is the action called
  handleSubmit(event) {
    event.preventDefault();
    event.preventDefault();
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
        var txOptions = {
          nonce: this.state.web3.toHex(this.state.web3.fourtwenty.getTransactionCount(this.state.address)),
          smokeLimit: this.state.web3.toHex(2000000),
          smokePrice: this.state.web3.toHex(20000000000),
          to: cannasseurNetworkInstance.address,
          value: 0
        }
        var rawTx = txutils.functionTx(cannasseurNetworkInstance.abi, 'designateModerator', [this.state.modAddress], txOptions);
        var privateKey = new Buffer(this.state.privateKey, 'hex');
        var transaction = new tx(rawTx);
        transaction.sign(privateKey);
        var serializedTx = transaction.serialize().toString('hex');
        this.state.web3.fourtwenty.sendRawTransaction('0x' + serializedTx, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
            ReactDOM.render(
              <div>{<Alert result={result.toString()}/>}</div>, document.getElementById('result'));

        }
        })

      })
    })
  }
  // renders the basic form in the root tab space
  render() {
    return (
      <MuiThemeProvider>
        <div>

          <form onSubmit={this.handleSubmit}>
          <div className={this.props.classes.root}>

          <Grid container spacing={24}>
          <Grid item xs={12} >
            <TextField fullWidth label="Enter 420coin address with 42000 420coins" value={this.state.address} onChange={this.handleAddressChange} />

            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Enter private key for address" value={this.state.privateKey} onChange={this.handleKeyChange} />

              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Enter the Moderator's 420Coin Address" value={this.state.modAddress} onChange={this.handleModChange} />

                </Grid>
              <Grid item xs={12}>
                <Button raised type="submit" color="primary">Add/Update a Moderator</Button>

                </Grid>
                </Grid>
                </div>
          </form>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(AddModerator);
