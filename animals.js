var io = require('socket.io').listen(55);

var util = require('util'),
    twitter = require('twitter');

var auth = require('./auth.js');
console.log(auth);
var twit = new twitter({
    consumer_key: auth.key,
    consumer_secret: auth.secret,
    access_token_key: auth.token_key,
    access_token_secret: auth.token_secret
});

var species = ["tiger","wolf","penguin","meerkat","dog","fish"];
var ranking = {};
var i;
var connection;

io.sockets.on('connection', function (socket) {
if(socket){
connection = socket;
}
});


for(i=0; i<species.length; i+=1){
 
ranking[species[i]] = {name:species[i],points:0}   
}

twit.stream('filter', {track:species}, 
            
function(stream) {
    stream.on('data', function(data) {
    
var i;
var tweet = data.text;
console.log(tweet);

for(i=0; i<species.length; i+=1){

    if(tweet.indexOf(species[i]) !== -1)
    {
ranking[species[i]].points +=1;
console.log(species[i] +": "+ranking[species[i]].points);
    }
    
}
        
if(connection){
  connection.emit('news', { ranking: ranking });
}
});
 
setTimeout(function(){console.log(ranking)}, 10000);
});