# Multi-Room Chat Application
Multi-room chat implementation with Socket.IO and Express

## __Project Description
Prior the chat initialization, user and host exchange data in order to set up the connection and 'fake' authentication(AJAX requests). After this procedure a user is assigned to the specific room while getting the emmited information from the specific room. We came up with idea using rooms() features of Socket.IO that define arbitrary channels where socket can join()  in any channel, and all messages from the server will be emitted to the specific room/channel.While the data is bouncing back and forth via websockets, host and clients maintain connection.




## __Requirements
  * express framework
  * socket.io framework
    
## __Functionality:
* User Authentication
* Users are listening/responding to users in the same channel 
* Online Users@Room indication
* Admin messages , Welcome, Connect,Disconnect
* Text chat Is marked (user#1:blabla) , only for other users , the text input for the current user 
  Is normal.
 
 ## __Technical Background:
 AJAX, JS, HTML, CSS, json
 
## __Run:
* npm install    
* node server.js
