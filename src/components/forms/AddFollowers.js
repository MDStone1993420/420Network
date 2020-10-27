import React, {Component} from 'react'
import CannasseurNetwork from '../../../build/contracts/CannasseurNetwork.json'
import CannasseurRewards from '../../../build/contracts/CannasseurRewards.json'
import getWeb3 from '../../utils/getWeb3'
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom'
import {keystore, txutils} from 'eth-lightwallet'
import tx from 'ethereumjs-tx'
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


class AddFollowers extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      follower: '',
      privateKey: '',
      pid: 0,
      web3: null
    }
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePIDChange = this.handlePIDChange.bind(this);
    this.handleFollowerAddChange = this.handleFollowerAddChange.bind(this);
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
  handlePIDChange(event) {
    this.setState({pid:event.target.value})
  }
  handleFollowerAddChange(event) {
    this.setState({follower: event.target.value})
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
      whaleRewards.deployed().then((instance) => {
        whaleRewardsInstance = instance

        // Stores a given value, 5 by default.
        return whaleRewardsInstance.getNetworkAddress()
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        console.log(result)
        whaleNetwork.at(result).then((netInstance) => {
            whaleNetworkInstance = netInstance;

        var txOptions = {
          nonce: this.state.web3.toHex(this.state.web3.fourtwenty.getTransactionCount(this.state.address)),
          smokeLimit: this.state.web3.toHex(2000000),
          smokePrice: this.state.web3.toHex(20000000000),
          to: result,
          from: this.state.address
        }
        console.log(txOptions)
        var followersList = this.state.follower.split(" ");
        console.log(this.state.pid, this.state.follower, followersList)
        var rawTx = txutils.functionTx(whaleNetworkInstance.abi, 'addFollowers',[this.state.pid, followersList], txOptions);
        console.log(1)
        var privateKey = new Buffer(this.state.privateKey, 'hex');
        var transaction = new tx(rawTx);
        console.log(2)
        transaction.sign(privateKey);
        console.log(3)
        var serializedTx = transaction.serialize().toString('hex');
        console.log(serializedTx)
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
            <TextField fullWidth label="Enter 420Coin address which contains 42000 420coins" value={this.state.address} onChange={this.handleAddressChange} />

            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Enter private key for address" value={this.state.privateKey} onChange={this.handleKeyChange} />

              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Post ID" value={this.state.pid} onChange={this.handlePIDChange} />

                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Follower Addresses" value={this.state.follower} onChange={this.handleFollowerAddChange} />

                  </Grid>
              <Grid item xs={12}>
                <Button raised type="submit" color="primary">Reward Followers</Button>

                </Grid>
                </Grid>
                </div>
          </form>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(AddFollowers);
