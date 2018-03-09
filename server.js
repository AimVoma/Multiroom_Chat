var crypto = require('crypto');


var express = require('express');
var app = express();

var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var users = [];
var rooms = [];
var room_users = [];
connections = [];
var found ;

var room_name ;
var online_users = [];


var port = process.argv[2];
var socket_port = process.argv[3]; 


server.listen(port);
console.log('Server Running on port : ', port);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/users/', function(req, res) {
    res.sendFile(__dirname + '/users.html')
});

app.get('/rooms/:id', function(req, res) {
		res.sendFile(__dirname + '/chat.html');
		room_name = req.params.id;
});

app.post('/rooms', jsonParser, function (req, res) {
	console.log('POST[ajax] request to /rooms');
	
	var name = req.body.name;
	var id = req.body.id;
	var room_name = req.body.room;
	var found_user = false;
	var found_room = false;
	var code = 201;
	
	
	for( i = 0 ; i < users.length;i++)
		{
			console.log(users[i].name.valueOf()+"----"+users[i].hash.valueOf());
			
			if(users[i].name === name && users[i].hash === id)		
			{
				found_user = true;
				break;
			}
		}
	if(found_user)
	{
			for( j = 0 ; j < rooms.length;j++){
				if(rooms.name === room_name)
					{
						found_room = true;
						break;
					}
			}
			if(found_room)
				code = 200;
			else
			{
				rooms.push({name:room_name});
				code = 201;
			}
		}
	else
		console.log('User Not Found');
	
	var URL = "./rooms/" + room_name;

	
	var json_string = JSON.stringify({url:URL});
	
	res.status(code).send(json_string);
	
});

app.post('/users', jsonParser, function (req, res) {
	console.log('POST[ajax] request to /users');
  found = false; 
	if (!req.body) return res.sendStatus(400)
  else
  {
		var usr_name = JSON.parse(req.body.name);
		//error
		for( i = 0 ; i < users.length;i++)
		{
			if(users[i].name.valueOf() === usr_name.valueOf())		
			{
				found = true;
				break;
			}
				
		}

		if(!found &&  "admin".valueOf() !== usr_name.valueOf())
		{
			var hash_key = crypto.createHash('md5').update(usr_name).digest('hex');
			users.push({name: usr_name, hash: hash_key}) ;
			
			
			var json = JSON.stringify({ID:users[users.length -1].hash});
			res.status(201).send(json);
			
		}
		else
			return res.sendStatus(409);
	}
});


io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected %s sockets connected', connections.length);


socket.on('disconnect', function(data){
	
	online_users.splice(online_users.indexOf(socket.username),1);
	updateUsers();
	
	io.to(socket.room).emit('User Disconnected' , {usrname:socket.username});
	
	connections.splice(connections.indexOf(socket),1);
  console.log('Disconnected: %s', socket.username);

});

socket.on('verify user', function(user){
	found_user = false;

	
	for( i = 0 ; i < users.length;i++)
		{
			if(users[i].name === user.name && users[i].hash == user.hash)		
			{
				console.log(users[i].name+' '+users[i].hash);			
				found_user = true;
				break;
			}
		}
	if(found_user){
		
		socket.username = user.name;
		
		socket.room = room_name;
		socket.join(room_name);
		
		socket.emit('Authenticated',{user:'authenticated',room:room_name});
		
		online_users.push({usr:socket.username,room:socket.room});

		updateUsers();
		socket.emit('admin welcome', {
			msg:'Welcome to '+room_name+'!'
		});
		io.to(socket.room).emit('User Connect', {usrname:socket.username});
		//io.sockets.emit('User Connect', {usrname:socket.username});
	}	
	else
		socket.emit('Authenticated',{user:'!authenticated'});
	
});

function updateUsers()
{
	io.sockets.emit('get online_users', online_users);
}
	//Send Message
	socket.on('send message', function(data){
	
	io.to(data.r).emit('new message', {msg:data.msg,user:socket.username});
	});

});

