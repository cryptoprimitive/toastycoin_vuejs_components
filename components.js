/*
Compoenents require Jquery, bootstrap, web3.js and vue.js
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<script src="https://unpkg.com/vue"></script>

<script src="libs/web3.min.js"></script>

*/

//output ethereum addressses with an etherscan link
//shortenTo property shortens the length of the ethereum address
Vue.component('eth-address-output', {
  props: {
    address:{},
    shortenTo:{
      default:42 //full length of eth address is "0x" + 40 hex characters
    }
  },
  computed: {
    etherscanAddressURL: function() {
      let etherscanURL;
      let networkId = web3.version.network;
      //ethereum mainnet
      if (networkId == 1) {
        etherscanURL = 'https://etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 3) {
        etherscanURL = 'https://ropsten.etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 4) {
        etherscanURL = 'https://rinkeby.etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 42) {
        etherscanURL = 'https://kovan.etherscan.io/';
      }
      else {
        etherscanURL = 'https://etherscan.io/';
        console.error('unsupported network ID: no block explorer for the current network');
      }
      return etherscanURL + "address/" + this.address;
    },
    popoverHtml: function() {
      return "<span style='font-size:0.6em'>" + this.address + "</span><br><div class='row' style='border:0;padding:0;display:inline-block'><div class='col-sm-6' style='border:0;padding:0;display:inline-block'><button class='btn btn-basic' style='background-color:white; outline:none' onclick='copyTextToClipboard(" + '"' + this.address + '"' + ")'><img src='resources/copy_icon.png' width=20></button></div><div class='col-sm-6' style='border:0;padding:0;display:inline-block'><a href='" + this.etherscanAddressURL + "' target='_blank' class='btn btn-basic' style='background-color:white;border:1'><img src='resources/chain_icon.png' width=20></button></div></div>";
    },
    formattedAddress: function() {
      if (this.shortenTo <42) {
        return this.address.substring(0, this.shortenTo) + "...";
      } else {
        return this.address;
      }
    }
  },
  template: "<a tabindex=0 data-trigger='focus' data-toggle='popover' data-placement='bottom' data-html='true' :data-content='popoverHtml' style='cursor:pointer; outline:none;'>{{formattedAddress}}</a>"
});

//outputs information about the autorelease of the burnable payment
Vue.component('autorelease-output', {
  props: ['state', 'autoreleaseInterval', 'autoreleaseTime'],
  data: function() {
    return {
      now: Math.floor(Date.now()/1000),
      displayState: null
    }
  },
  methods: {
    calculate: function() {
      this.now = Math.floor(Date.now()/1000);

      //determine display state
      if (this.state == 0 || this.state == 2) {
        this.displayState = 'interval';
      }
      else if (this.state == 1 && this.autoreleaseTime > this.now) {
        this.displayState = 'countdown';
      }
      else if (this.state == 1 && this.autoreleaseTime <= this.now) {
        this.displayState = 'countdownDone';
      }
    }
  },
  computed: {
    labelText: function() {
      if (this.displayState == 'interval')
        return "Autorelease Interval:<br>";
      else if (this.displayState == 'countdown')
        return "Autorelease in<br>";
      else if (this.displayState == 'countdownDone')
        return "Autorelease available!";
    },
    timeText: function() {
      if (this.displayState == 'interval') {
        return humanizeDuration(this.autoreleaseInterval*1000, {largest:2});
        }
      else if (this.displayState == 'countdown') {
        return humanizeDuration((this.autoreleaseTime - this.now)*1000, {largest:2});
        }
    }
  },
  mounted: function() {
    this.calculate();
  },
  template: "<div class='well well-sm text-left' style='margin-bottom:0;display:flex;justify-content:center;flex-direction:column;background-color:#ffdd99;width:160px;height:60px;'><span  v-html='labelText'></span>{{timeText}}</div>"
});

//outputs an Ether value
//first six decimals in Ether, next six in Gwei, last six in wei
Vue.component('ether-output', {
  props: ['wei'],
  computed: {
    formatted: function() {
      if (typeof web3 === "undefined") {
          var web3 = new Web3();
      }
      var ether = web3.fromWei(this.wei, "ether");
      if (this.wei.toString().length > 12)
          return ether + " Ether";
      else if (this.wei.toString().length > 6)
          return ether * 1000000000 + " Gwei";
      else if (this.wei.toString().length > 1)
          return this.wei.toString() + " wei";
      else
          return this.wei.toString() + " Ether";
    }
  },
  template: "<span>{{formatted}}</span>"
});
