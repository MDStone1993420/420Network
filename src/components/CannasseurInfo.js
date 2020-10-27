import React, {Component} from 'react'
import CannasseurNetwork from '../../build/contracts/CannasseurNetwork.json'
import CannasseurRewards from '../../build/contracts/CannasseurRewards.json'
import getWeb3 from '../utils/getWeb3'
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom'
import {keystore, txutils} from 'fourtwenty-lightwallet'
import tx from 'fourtwentyjs-tx'
import Header from './header.js'
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import PropTypes from 'prop-types';







const styles = {
  root: {
    width: '100%',
    marginTop: '10px',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
}





class CannasseurInfo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address1: '',
      address: '',
      post: 0,
      post1: 0,
      web3: null
    }

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({web3: results.web3})
      // Instantiate contract once web3 provided.



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
        return cannasseurRewardsInstance.getNetworkAddress()}).then((result) => {
        // Get the value from the contract to prove it worked.
        console.log(result)
        cannasseurNetwork.at(result).then((netInstance) => {
              cannasseurNetworkInstance = netInstance;
          cannasseurNetworkInstance.whaleList(0).then((address) => {
            console.log(address)
            this.setState({address:address})

            return address;
          }).then((address)=> {
              cannasseurNetworkInstance.getCannasseur(address).then((numPosts) => {
                console.log(numPosts)
                this.setState({post:numPosts[0].toNumber()})
                // return address1
              }).then(()=> {
                cannasseurNetworkInstance.cannasseurList(1).then((address1) => {
                  console.log(address1)
                  this.setState({address1:address1})
                  return address1
                }).then((address1) => {
                    cannasseurNetworkInstance.getCannasseur(address1).then((numPosts) => {
                      this.setState({post1:numPosts[0].toNumber()})

                    })
                })

        })
      })
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

            <Paper className={this.props.classes.root}>
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell> # </TableCell>
                    <TableCell >ADDRESS</TableCell>
                    <TableCell numeric># OF POSTS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                      <TableRow>
                        <TableCell>0</TableCell>
                        <TableCell>{this.state.address}</TableCell>
                        <TableCell numeric>{this.state.post}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>{this.state.address1}</TableCell>
                        <TableCell numeric>{this.state.post1}</TableCell>
                      </TableRow>
                </TableBody>
              </Table>
            </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(CannasseurInfo);

