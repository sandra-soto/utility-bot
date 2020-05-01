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
	// test
	console.log(message.content);

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
		console.log(message);
		for(var i = 0; i < parseInt(args[0]); i++){
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