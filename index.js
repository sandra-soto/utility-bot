var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 5000;
const tictactoe = require("./tictactoe");
//var router = express.Router()

// require dotenv to add secret variables
require('dotenv').config();

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();



var game = null;



// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", message => { 


		if (message.attachments.size > 0){
		return message.channel.send(message.attachments);
	}

	//If the message either doesn't start with the prefix or was sent by a bot, exit early.
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) 
		return;

	// Create an args variable that slices off the prefix entirely and then splits it into an 
	// array by spaces. Uses regex.
	const args = message.content.slice(process.env.PREFIX.length).split(/ +/);

	// Create a command variable by calling args.shift(), which will take the first element in 
	// array and return it while also removing it from the original array (so that you don't 
	// have the command name string inside the args array).
	const command = args.shift().toLowerCase();


	if(command == "henlo"){
		let henlos = args[0] != undefined ? parseInt(args[0]) : 1;
		for(var i = 0; i < henlos; i++){
			message.channel.send("henlo");
		}
	}

	else if(command == "tictac"){
		createGame(args, message);
		
	}

	else if(command == "m"){
		if(game != null){
					let status = game.gameStatus();
		if(status>0){
			return message.channel.send("Game is over!");
		} 

		game.makeMove(args[0], args[1]);

		 status = game.gameStatus();
		if(status>0){
			return message.channel.send(game.print_board() + "\nPlayer " + status + "wins!");
		}
		else if(status == -1){
			return message.channel.send(game.print_board() + "Game Over: Tie");
		}

		return message.channel.send(game.print_board() + "\nPlayer " + game.currentTurn() + "'s turn");

		}

	}

	else if(command == "c"){
		let timeleft = args[0];
		async function roundTimer(timeleft = 5){
       
		let timer = setInterval(function(){
	        if(timeleft<=0){
	        	message.channel.send("Finished!");
		        clearInterval(timer);
		    }
		    else{
	        	 message.channel.send(timeleft);
	        }
	        timeleft--;
		},1000);}

	  roundTimer(timeleft);
	}

	else if(command == "t"){
		let timeleft = args[0];

  		let startTime, endTime;

		function timeStr(dateObj) {
			let num =  Math.round(dateObj.getHours()%12)
			var str = num != 0 ? num : 12; 
			str += ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds();
		  return str;
		}

		function tick() {
		 
		  if (new Date().getTime() <= endTime.getTime()) {

		  } 
		  else {
		    message.channel.send("Finished!");
		    clearInterval(interval);
		  }
		}

		function startTimer(secs = 10) {
		  startTime = new Date();
		  endTime = new Date(startTime.getTime() + secs * 1000);
		  message.channel.send("Timer started on " + timeStr(startTime) + " and will end " + secs + 
		  						" seconds from now on " + timeStr(endTime) );
		  
		  interval = setInterval(tick, 500);  
		}

		startTimer(timeleft);
	}

	else if(command == "hewp"){
	
  var embed = new Discord.MessageEmbed()
  	.setColor('#f0bb9e')
  	.setTitle('Utility-Bot')
  	.setThumbnail('https://i.imgur.com/vXQXx5B.jpg')
    .addFields([
    	{ name: '!tictac n', value: 'start a game of tictactoe of n size' },
    	{ name: '!t n', value: 'create a timer of n seconds' },
    	{ name: '!c n', value: 'start a countdown from n seconds' },
    	{ name: '!henlo n', value: 'bot says henlo n times' },
    	{ name: '!hewp', value: 'lists bot functions' }
    ])
    
  message.channel.send(embed);

		
	}



});

function createGame(args, message){
	let size;
		if(args.length==0){
			size = 3;
		}
		else{
			size = args[0];
		}
		game = new tictactoe(size);
	return message.channel.send(game.print_board() + "\nPlayer" + game.currentTurn() + "'s turn");
}



// login to Discord with your app's token
client.login(process.env.TOKEN);