## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://docs.mongodb.com/manual/installation/) (follow instructions for operating system)
* [Ruby](https://www.ruby-lang.org/en/documentation/installation/) 

```
 [sudo] apt-get install ruby-full
```

* [AnyStyle.io](https://anystyle.io/)
```
[sudo] gem install anystyle-cli
```

## Installing 

A step by step series of examples that tell you how to get a development env running 

###### Step 1: Navigate to the client directory and install dependencies

```
cd citing-insights-beta
```
```
cd client
```
```
npm install
```

###### Step 2: Navigate to server directory and install dependencies

```
cd ..
```
```
cd server
```
```
 npm install
```

###### Step 3: Obtain Google API Credentials

Citing Insights requires Google to log in and out of the application. In order for the Citing Insights log in to work for your institution, you need to obtain Google API Credentials. 

To obtain credentials go to console.developers.google.com, create a new project, and enable (it is free, but it requires a credit/debit card to register) to both Google Analytics API and Identity Toolkit API.

Be sure to click the Credentials tab on the left and set the correct Redirect URI’s, as instructed by Google. 

###### Step 4: Add Credentials to Application

Create a **config.js** file in the server directory and place 'clientID' and 'clientSecret' information with your Google Credentials, keep the quotes. 

```
module.exports = {
   'googleAuth': {
       'clientID': '',
       'clientSecret': ''
   }
};
```

Similarly,  navigate to /client/src/ create a **config.json** file and place your ClientID into the empty field. 

```
{
   "GOOGLE_CLIENT_ID": ""
}
```

###### Step 5: Launch App Locally

To start the application locally and in development mode, from a Linux or Linux based terminal navigate to the server directory and type

```
npm run dev
```

This will launch the server at http://localhost:5000, and the client (React application) at http://localhost:3000

###### Notes: 

At any point, if you wish to stop the application type CTRL + C in the active terminal. 

This configuration is running nodemon, which allows for the server to restart any time it detects a change in a file (hot reloading). So, no need to bring down and bring up the server each time a change is made to a file, simply saving the file suffices.

## Deployment
For additional information on how to launch on a Linux server see our [Server Documentation](https://github.com/hsu-library-project-x/citing-insights-beta/blob/master/Server%20Documentation%20Beta.pdf)
