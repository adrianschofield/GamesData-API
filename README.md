# GamesData-API

This is a REST API for managing video game data using Node.js, Express and Sequelize

## How to Run 

The server is easy to install so long as node.js version x.xx is installed

* Clone this repository 
* Open a node prompt and run npm install
* Once successfully installed, you can run the service by:
```
        node server.js
or
        nodemon server.js 

```
		
## About the Service

The service allows you to maintain a list of games, the platform they are installed on and information such as whether they are Multiplayer and how long you have played them for.

### There are three endpoints that you can call

```
http://localhost:3000/u
http://localhost:3000/games
http://localhost:3000/data/dashboard

```

### Create a User Account


POST /users

Content-Type: application/json

Body needs to contain the following json data
```
{
  "email": "adr@email.com",
  "password": "12345678"
}
```

Success
RESPONSE: HTTP 201 (Created)

The body will include the json representation of the user that was created

Error
RESPONSE: HTTP 400 (Bad Request)

The body will contain json data with more information about the error


### Login a User to get an Auth token

An Auth token is required for any endpoint that is marked as requiring authentication.

POST /users/login

Content-Type: application/json

Body needs to contain the following json data

```
{
  "email": "adr@email.com",
  "password": "12345678"
}
```

Success
Response: HTTP 200

The body will include the json representation of the user that was logged in
The header will contain an Auth value containing the Auth token

Error
RESPONSE: HTTP 401 (Unauthorized)

No additional data is returned on an error.


### Get all the games in the database


Authentication is required

GET /games

This method currently supports one query for the platform for example

GET /games/?platform=steam

Current platforms supported are 'steam'

Content-Type: application/json


Success
Response: HTTP 200

The body will contain a JSON array of games objects, here's a sample object:
```javascript
{
	"id": 2,
	"name": "Counter-Strike",
	"platform": "steam",
	"timePlayed": 0,
	"hours": 0,
	"minutes": 0,
	"like": false,
	"current": false,
	"completed": false,
	"finished": false,
	"mutiplayer": false,
	"createdAt": "2017-05-14T17:51:22.096Z",
	"updatedAt": "2017-05-14T17:51:22.108Z",
	"userId": 1
}
```
Error
RESPONSE: HTTP 404 (Not Found)

No additional data is returned on this error, inidicates that your query string did not work and no games were found in the database

RESPONSE: HTTP 500 (Internal Server Error)

Something went horribly wrong, check the logs on the server for more information
