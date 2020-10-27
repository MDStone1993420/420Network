pragma solidity ^0.4.11;


contract CannasseurNetwork {

  event Posted(
      address author,
      string title,
      uint id
  );

  struct Cannasseur {
    uint timestamp;
    bool isCannasseur;
    bool validated;
    uint[] postList;
  }

  struct Validator {
    uint timestamp;
    bool isValidator;
  }

  struct Post {
    uint timestamp;
    uint id;
    address[] followers;
    address cannasseur;
    string title;
  }

  struct Vars {
    uint i;
  }

  uint public numPosts;
  mapping (uint => Post) public posts;
  address owner;
  mapping (address => Cannasseur) public cannasseurs;
  uint public numCannasseurs;
  uint cannasseurRequirement;
  address[] public cannasseurList;
  mapping (address => Validator) validators;
  mapping (address => address) public cannasseurMod;

  //modifiers

  modifier isOwner() {
    require(owner == msg.sender);
    _;
  }

  modifier onlyCannasseur() {
      require(cannasseurs[msg.sender].isCannasseur);
      _;
  }

  modifier onlyValidators() {
      require(validators[msg.sender].isValidator);
      _;
  }

  function CannasseurNetwork(address _owner) {
    owner = _owner;
    numCannasseurs = 0;
    cannasseurRequirement = 42000;
    numPosts = 0;
  }


  //setter functions

  function becomeCannasseur() payable {
    require(msg.value == cannasseurRequirement);
    require(!cannasseurs[msg.sender].isCannasseur);
    cannasseurs[msg.sender].timestamp = now;
    cannasseurs[msg.sender].isCannasseur = true;
    cannasseurList.push(msg.sender);
    numCannasseurs++;
  }

  function becomeNormal() {
    require(cannasseurs[msg.sender].isCannasseur);
    msg.sender.transfer(cannasseurRequirement);
    cannasseurs[msg.sender].timestamp = now;
    cannasseurs[msg.sender].isCannasseur = false;
    numCannasseurs--;
  }

  function designateModerator(address mod) onlyCannasseur{
      cannasseurMod[msg.sender] = mod;
  }

  function validate(address cannasseur) onlyValidators {
      require(cannasseurs[Cannasseur].isCannasseur); //check if a Cannasseur
      cannasseurs[Cannasseur].validated = true;
  }

  function addValidator(address addr) isOwner{
      require(!validators[addr].isValidator);
      validators[addr].timestamp = now;
      validators[addr].isValidator = true;
  }

  function post(string postTitle, address cannasseur)  {
    require(cannasseurs[cannasseur].isCannasseur);
    require(cannasseurMod[cannasseur] == msg.sender);
    require(bytes(postTitle).length <= 160);
    posts[numPosts].id = numPosts;
    posts[numPosts].timestamp = now;
    posts[numPosts].cannasseur = cannasseur;
    posts[numPosts].title = postTitle;
    cannasseurs[msg.sender].postList.push(numPosts);
    Posted(msg.sender, postTitle, numPosts);
    numPosts++;
  }

  function addFollowers(uint postid, address[] followers) {
    Vars memory vars;
    require(cannasseurMod[posts[postid].cannasseur] == msg.sender);
    for (vars.i=0; vars.i<followers.length; vars.i++) {
      posts[postid].followers.push(followers[vars.i]);
  }
  }


  //getter functions
  function isCannasseur(address _address) constant returns (bool _status) {
    bool status = cannasseurs[_address].isCannasseur;
    return status;
  }

  function getLockedBalance() constant returns (uint balance) {
    balance = this.balance;
  }

  function getCannasseur(address _addr) public constant returns (uint num, address moderator) {
      return (Cannasseurs[_addr].postList.length, cannasseurMod[_addr]);
  }

  function getPost(uint postId) constant returns (uint id, uint timestamp, address whale, uint numFollowers) {
    require(postId < numPosts); //We check that the post exists
    id = posts[postId].id;
    timestamp = posts[postId].timestamp;
    cannasseur = posts[postId].cannasseur;
    numFollowers = posts[postId].followers.length;
  }

  function getFollower(uint pid, uint fid) constant returns (address) {
    return posts[pid].followers[fid];
  }

}
