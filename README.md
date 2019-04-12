# GamesData-API

This is a REST API for managing video game data using Node.js, Express and Sequelize

## How to Run 

The server is easy to install so long as node.js version x.xx is installed

* Clone this repository 
* Open a node prompt, change to the directory where you cloned the repository and run npm install
* Once successfully installed, you can run the service by:

```
        node server.js
```
or
```
        nodemon server.js 
```
if nodemon is installed.
		
## About the Service

The service allows you to maintain a list of games, the platform they are installed on and information such as whether they are Multiplayer and how long you have played them for.

### There are three endpoints that you can call

```
http://localhost:3000/users
http://localhost:3000/games
http://localhost:3000/data/dashboard
```

### Create a User Account


POST /users

Content-Type: application/json

Body needs to contain the following json data
```javascript
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

```javascript
{
  "email": "adr@email.com",
  "password": "12345678"
}
```

Success
Response: HTTP 200(Success)

The body will include the json representation of the user that was logged in
The header will contain an Auth value containing the Auth token

Error
RESPONSE: HTTP 401 (Unauthorized)

No additional data is returned on an error.

### Authentication

For all endpoints that require authentication you need to add a Header named 'Auth' with the relevant Authorization Token gathered from the Login request.


### Get all the games in the database


Authentication is required

GET /games

This method currently supports one query for the platform for example

GET /games/?platform=steam

Current platforms supported are 'steam'

Content-Type: application/json


Success
Response: HTTP 200(Success)

The body will contain an array of JSON games objects, here's a sample object:
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


### Get a specific game in the database


Authentication is required

GET /games/:id

Content-Type: application/json

Example request:

GET /games/2

Success
Response: HTTP 200(Success)

The body will contain a JSON games object, here's a sample object:

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

No additional data is returned on this error, inidicates that the id you requested did not exist in the database

RESPONSE: HTTP 500 (Internal Server Error)

Something went horribly wrong, check the logs on the server for more information

### Add a game to the database


Authentication is required

POST /games

Content-Type: application/json

Body needs to contain the following json data
```javascript
{
	"name": "Counter-Strike",
	"platform": "steam",
	"timePlayed": 0,
}
```

Success
RESPONSE: HTTP 200 (Success)

The body will include the json representation of the game that was created

Error
RESPONSE: HTTP 400 (Bad Request)

The body will contain json data with more information about the error

The above request will create a game with the following settings, note that defaults are applied for many fields:

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

### Delete a game from the database


Authentication is required

DELETE /games/:id

Content-Type: application/json



Success
RESPONSE: HTTP 204 (No Content)

The game was deleted from the database

Error
RESPONSE: HTTP 404 (Not Found)

The game you requested to be deleted id not in the database

RESPONSE: HTTP 500 (Internal Server Error)

Something went horribly wrong, check the logs on the server for more information

### Update an existing game in the database


Authentication is required

PUT /games/:id

Content-Type: application/json

Body can contain the following json data
```javascript
{
	"name": "Counter-Strike",
	"platform": "steam",
	"timePlayed": 0,
	"current": "true",
	"like": "true"
}
```

Success
RESPONSE: HTTP 200 (Success)

The body will include the json representation of the game that was updated including the updates. Note that not all fields need to be supplied for instance if you just wanted to update the time played for the game with id 100 you could do the following:

PUT /games/100

with body of

```javascript
{
	"timePlayed": 123
}
```

Error
RESPONSE: HTTP 400 (Bad Request)

The body will contain json data with more information about the error

RESPONSE: HTTP 404 (Not Found)

The game id you requested was not found in the database

RESPONSE: HTTP 500 (Internal Server Error)

Something went horribly wrong, check the logs on the server for more information


### Get the data Dashboard from the database


Authentication is NOT required

GET /data/dashboard

Success
Response: HTTP 200(Success)

The body will contain a JSON object showing data from the database, currently the data returned is total number of games in the database, number of games with less then one hour played, number of games with between one and three hours played and an array containg the names of any games in the database marked as current. Here's a sample object:
```javascript
{
    "totalGames": 242,
    "lessThanHourGames": 161,
    "lessThanThreeHourGames": 30,
    "currentGames": [
        "Anno 2070",
        "Sublevel Zero",
        "Prey"
    ]
}
```
Error
RESPONSE: HTTP 404 (Not Found)

No additional data is returned on this error, inidicates that your query string did not work and no games were found in the database

RESPONSE: HTTP 500 (Internal Server Error)

Something went horribly wrong, check the logs on the server for more information

### Examples

There is an example of a simple HTML and javascript web page which queries the database for dashboard data and displays it as a pie chart in the samples/html_javascript directory.