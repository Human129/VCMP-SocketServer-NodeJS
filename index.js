const net = require('net');
var mysocket = null;

//Channels where the VCMP server will read the messages
//Example:
//const Channels = ["1271828182112", "81828188128128"];
const Channels = ["1001527404520558664"];


const server = net.createServer((socket) => {
	
  mysocket = socket;
  socket.on('data', (data) => {
	try{
		let message = data.toString();
		//This split will take care of getting where the textjson ends.
		message = message.split("\nend")[0]; ;
		//The json is received as text, so we will transform it into a table/object
		let objData = JSON.parse(message); 

		//Here it is in charge of verifying the type of information that is received and then handling it accordingly, here you can create all the functions or systems that you can think of.
		switch( objData.type ) {
			case "message":
				let channel = objData.channel;
				let message = objData.message.replace( /(\[)+#*([0-9A-Z])+(\])/gi, '' ); //This will remove hexadecimal colors (example: [#ffff02])
				client.channels.cache.get(channel).send( message );
			break;

			case "embed":
				const embed = new Discord.MessageEmbed()
				.setColor(objData.color)
				.setTitle(objData.title)
				.setDescription(objData.message.replace( RegExp("\\n",'g'), "\n" ));
				client.channels.cache.get(objData["channel"]).send(embed);
			break;

			case "activity":
				client.user.setActivity(objData["message"]);
			break;
		}
	} catch(e){
		
		console.log("ERROR DISCORD >>>> " + e);
	}
	
  })

  //Server disconnection
  socket.on('close', (data) => {
    console.log(data.toString() +" left");
  });
  
  //Catcher of errors
  socket.on("error", (err) =>{
    console.log("Caught flash policy server socket error: ")
    console.log(err.stack)
  }); 

});

//On server/client connection
server.on('connection',function(socket){

  console.log('Buffer size : ' + socket.bufferSize);

  var rport = socket.remotePort;
  var raddr = socket.remoteAddress;
  var rfamily = socket.remoteFamily;

  console.log('REMOTE Socket is listening at port' + rport);
  console.log('REMOTE Socket ip :' + raddr);
  console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);
  console.log('--------------------------------------------')
  


server.getConnections(function(error,count){
  console.log('Number of concurrent connections to the server : ' + count);
});
 
})


//If you install this system on the same host as the server, leave '127.0.0.1'
//if it is on a different server, enter the IP of the vcmp server without port
server.listen(5000, "127.0.0.1", () => { 
  console.log('opened server on', server.address().port);
});


/*
	DISCORD.JS V12.5.3 // to install use: npm i discord.js@12.5.3
*/

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`); 
});

client.on('message', async (message) => {
	if(message.author.bot) return;
	
	let channel = message.channel;
	if ( Channels.find( (id) => { return id === channel.id }) ) {
		
		//This if takes care of sending the messages to the server only when it starts with a dot or a !
		//If you want to remove it you can
		if ( true  ) { 
			let data = {
				Guild: message.guild,
				ServerID: message.guild.id,
				ChannelID : channel.id, 
				Member: {
					Nick: message.member.displayName,
					Roles: message.member.roles.cache.map( r =>  ""+r.id)
				},
				Author: {
					ID: message.author.id,
					Username: message.author.username,
					IsBot: false,
				}, 
				Content: message.content,
			} 

			 mysocket.write( JSON.stringify(data) );
		}
	}
});

//YOUR BOT TOKEN
client.login("YOUR BOT TOKEN");
 
