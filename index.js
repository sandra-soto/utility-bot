var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 5000;
const tictactoe = require("./tictactoe");
const riddleDB = require('./database');
//var router = express.Router()

// require dotenv to add secret variables
require('dotenv').config();

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

const embed =  {
  	color: '#f0bb9e',
  	title: 'Utility-Bot'
  }

const failure_embed = {
	color: '#f0bb9e',
  	title: 'Utility-Bot',
  	fields: [
			   { name: "failure:", value: "could not complete request"}
			    	]

}

var game = null;



// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on("message", message => { 

	// console.log(message.attac)
	// if (message.attachments.size > 0){
	// 	return message.channel.send(message.attachments);
	// }

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

	else if(command == "rmt"){
		let num_riddles = args[0] != undefined ? args[0] : 1;
		    const result = riddleDB.getRiddle(parseInt(num_riddles))
		        .then(results => {
		        	console.log(results);
		        	console.log(results[0]);
		          message.channel.send(results[0]['document']['riddle'])
		         
		     })
		     .catch(err => {
		       console.error(err)
		     });
	}

	else if(command == "t"){
		let timeleft = args[0];

  		let startTime, endTime;


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
		  message.channel.send("Timer started on " + startTime.toLocaleTimeString() + " and will end " + secs + 
		  						" seconds from now on " + endTime.toLocaleTimeString() );
		  
		  interval = setInterval(tick, 500);  
		}

		startTimer(timeleft);
	}
	else if(command == "emo"){

		
		message.attachments.forEach(function(attachment) {
	
			let s = attachment.name;
			emoji_name = args[0] != undefined ? args[0] : s.substring(0, s.indexOf('.'));
			embed.thumbnail = {url:attachment.url};
			embed.fields = [
			    		{ name: 'added emoji', value: emoji_name}
			    	]
	  		message.channel.guild.emojis.create(attachment.url, emoji_name)
				.then( () => message.channel.send({embed:embed}))
				.catch(() => message.channel.send({embed:failure_embed}));

		})
	}

	else if(command == "emos"){
		let counter = 0;
		embed.fields = [];
		message.channel.guild.emojis['cache'].forEach(function(emoji) {
			
			let pair = { name: emoji.name, value: "<:" + emoji.name + ":" + emoji.id +">", inline:true};
			
			counter++;
			embed.fields.push(pair);

			if(counter % 25 == 0){
				message.channel.send({embed:embed});
				embed.fields = [];
				counter = 0;
			}
				
			   
		})
		if(counter <= 25){
			message.channel.send({embed:embed});
		}
		
	}

	else if(command == "name"){
		

		let old_name = args[0];
		let new_name = args[1];
		for (const [emojiID, emoji] of message.channel.guild.emojis['cache']){
			if(emoji.name == old_name){
							embed.fields = [
			    		{ name: 'changed name', value: `${old_name} -> ${new_name}`}
				]	
				embed.thumbnail = {url:`https://cdn.discordapp.com/emojis/${emojiID}`};
				emoji.edit({name:new_name});
				message.channel.send({embed:embed});
			}
		}

	}

	else if(command == "del"){
		// have to consider emojis with spaces in them
		let del = args[0];
		for (const [emojiID, emoji] of message.channel.guild.emojis['cache']){
		  //console.log(emojiID, emoji);
		  if(emoji.name == del){
		  	embed.thumbnail = {url:`https://cdn.discordapp.com/emojis/${emojiID}`};
			embed.fields = [
			    		{ name: 'deleted emoji', value: emoji.name}
			    	]
			message.channel.send({embed:embed});
			emoji.delete();
		  }
		}

	}

	else if(command == "trash"){
		let amount = args[0] != undefined ? args[0] : 1;
		message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
		    message.channel.bulkDelete(messages 
		)});
	}

	else if(command == "eval"){
		try{
			string = message.content.substring(5)
			result = eval(string)
			message.channel.send((result != null || result != undefined) ? result : "None")

		}
				
		catch(error){
			 console.error(error);
		}

	}


	else if(command == "hewp"){
		embed.title = 'Utility-Bot'
		embed.thumbnail = {url:'https://i.imgur.com/vXQXx5B.jpg'}
	  	embed.footer = {'text': 'tip: most commands can be run without an argument'};
	    embed.fields = [
	    	{ name: '**UB emote**', value: '————————', inline:true},
	    	{ name: '**UB time**', value: '————————', inline:true},
	    	{ name: '**UB misc**', value: '————————', inline:true},
	    	{ name: '```!emo s```', value: 'create an emoji with s name' , inline:true},
	    	{ name: '```!t n```', value: 'create a timer of n seconds', inline:true},
	    	{ name: '```!tictac n```', value: 'start a game of tictactoe of size n', inline:true },
	   		{ name: '```!emos```', value: 'list all emojis in the server', inline:true },
	   		{ name: '```!c n```', value: 'start a countdown from n seconds' , inline:true},
	    	
	    	{ name: '```!trash n```', value: 'delete n messages (must be 1-100)' , inline:true},
	    	{ name: '```!del s```', value: 'delete  emoji(s) of s name' , inline:true},
	    	{ name: '```!henlo n```', value: 'bot says henlo n times' , inline:true},
	    	{ name: '```!hewp```', value: 'list bot functions', inline:true },
	    	{ name: '```!name a b```', value: "change emoji a's name to b" , inline:true}

	    ]
	    
	  message.channel.send({embed:embed});

		
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