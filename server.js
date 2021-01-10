var http = require('http');
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var express = require('express');
var bodyParser = require('body-parser');


var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = 'https://togethear.jasonamri.com/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';




var app = express();

app.use(cors())
    .use(cookieParser());

//support POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'false' }));

//frontend
app.use(express.static('./dist/togethear'));

//backend
app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});



//start server
var port = '3456';
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
    var addr = server.address();
    console.log('Listening on ' + port);
}