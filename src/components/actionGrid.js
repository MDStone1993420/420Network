
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import React, {Component} from 'react'
import CannasseurNetwork from '../../build/contracts/CannasseurNetwork.json'
import CannasseurRewards from '../../build/contracts/CannasseurRewards.json'
import getWeb3 from '../utils/getWeb3'
import Button from 'material-ui/Button';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactDOM from 'react-dom'
import BecomeCannasseurForm from '../components/forms/BecomeCannasseurForm.js'
import CannasseurAccount from '../components/CannasseurAccount.js'
import ModeratorAccount from '../components/ModeratorAccount.js'
import PostAction from '../components/postAction.js'
import AddFollowers from '../components/followerAction.js'
import FollowerAccount from '../components/followerAccount.js'

import Header from '../components/header.js'




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


class ActionGrid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null
    }
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
      <div>{< CannasseurAccount />}</div>
    </MuiThemeProvider>, document.getElementById('root'));
  }
  handleSubmitMod(event) {
    event.preventDefault();
    ReactDOM.render(
      <MuiThemeProvider>
      <div>{< ModeratorAccount />}</div>
    </MuiThemeProvider>, document.getElementById('root'));
  }

  handleSubmitPost(event) {
    event.preventDefault();
    ReactDOM.render(
      <MuiThemeProvider>
      <div>{< PostAction />}</div>
    </MuiThemeProvider>, document.getElementById('root'));
  }

  handleSubmitFollower(event) {
    event.preventDefault();
    ReactDOM.render(
      <MuiThemeProvider>
      <div>{< AddFollowers />}</div>
    </MuiThemeProvider>, document.getElementById('root'));
  }
  handleSubmitReward(event) {
    event.preventDefault();
    ReactDOM.render(
      <MuiThemeProvider>
      <div>{< FollowerAccount />}</div>
    </MuiThemeProvider>, document.getElementById('root'));
  }

  render() {




    return (
      <MuiThemeProvider>


          <div className={this.props.classes.root}>
          <Grid container spacing={24}>

            <Grid item xs={6} sm={3}>
              <Paper className={this.props.classes.paper}>
              <h1>My Cannasseur Account</h1>
              <br></br>
              <p>Become a Cannasseur/Stop Being a Whale</p>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <Button raised type="submit" color="primary">Go</Button>
                </form>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={this.props.classes.paper}>
              <h1>My Moderator</h1>
              <br></br>
              <p>Add or Remove a Moderator</p>
                <form onSubmit={this.handleSubmitMod.bind(this)}>
                  <Button raised type="submit" color="primary">Go</Button>
                </form>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={this.props.classes.paper}>
              <h1>My Posts</h1>
              <br></br>
              <p>Add a Post</p>
                <form onSubmit={this.handleSubmitPost.bind(this)}>
                  <Button raised type="submit" color="primary">Go</Button>
                </form>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper className={this.props.classes.paper}>
              <h1>My Followers</h1>
              <br></br>
              <p>Reward your Followers</p>
                <form onSubmit={this.handleSubmitFollower.bind(this)}>
                  <Button raised type="submit" color="primary">Go</Button>
                </form>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={this.props.classes.paper}>
            <form onSubmit={this.handleSubmitReward.bind(this)}>
              <Button raised type="submit" color="primary">View/Claim Follower Rewards</Button>
            </form>
            </Paper>
            </Grid>
          </Grid>

          </div>

      </MuiThemeProvider>
    );
  }
}


export default withStyles(styles)(ActionGrid);
