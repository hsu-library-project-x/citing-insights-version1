# Citing Insights

A powerful web application designed to streamline assessment of students' information literacy and other skills. With Citing Insights, you can easily upload a student papers, the citations are detected and links to discovery tools make it easy to evaluate the sources. Discovery tools include Semantic Scholar, Google Scholar, and a Library's Alma Primo. Citing Insights is designed to automate using or editing AAC&U Information Literacy Value Rubrics, and other assessment rubrics, for assessing the student papers. You can also add annotation, and provide students feedback, or provide accrediting bodies with detailed assessment reports.
![Screenshot of Citing Insights Analyze user interface](https://docs.google.com/document/d/11_ayYrms_mxTEbNaxvpZimhb3jYgJ0sMT-XjFBLwSXo/edit?usp=sharing)

## Table of Contents 

* [Version](#version)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installing ](#installing )
* [Deployment](#deployment)
* [Known Issues](#known-issues)
* [Version 1.0 Features](#version-1.0-features)
* [Built With](#built-with)
* [Contributing](#contributing)
* [Authors](#authors)
* [Project Sponsor](#project-sponsor)
* [License](#license)
* [Acknowledgments](#acknowledgments)
* [User Guide](#user-guide)



## Version
 1.0 

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

## Known Issues
* PDF viewer
  * Search Tool: If multiple matches on the same line, all matches on that line will become highlighted
  * PDF text font and size changes upon text selection
  
## Rubrics
  * [Rubric Resource Library](https://docs.google.com/document/d/1mvjP-wZ0KyNkRVN183dm86Eb90jDzh4V9vJt9x1j6Y0/edit?usp=sharing)
  
## Version 1.0 Features
Citing Insights Version 1 release is expected in the end of May, and the planned features include: 
* Enhanced PDF Search functionality
* Multiple evaluators mode, with inter-reliability testing / norming, and analytics
* Robust analytical reports & outcomes
* Group Administration Console
* Robust rubric resources
* More Improvements to Design
* Integration road-map with Learning Management System. 

## Built With
* [MongoDB ](https://www.mongodb.com/) - database
* [ExpressJS](https://expressjs.com/) - web framework for nodeJS
* [ReactJS](https://reactjs.org/) - web framework for creating User Interfaces
* [NodeJS](https://nodejs.org/en/) - back-end framework

## Contributing

This is an open source project and we encourage anyone to build upon this outstanding achievement, as long as the intent is good. That being said, the authors will not be responsible for maintaining this project. Citing Insights will focus development on student features next year, if available funding is provided. 

## Authors
 
 * [Cindy Batres](https://github.com/batresc)
 * [Elizabeth Lujan](https://github.com/eal376) 
 * [Ben Miller](https://github.com/Benmoony)
 * [Kyle Smith](https://github.com/smittythehippy)
 * [Mitchell Waters](https://github.com/mkwalters)
 
## Project Sponsor 

* [Cyril Oberlander (Humboldt State University Library Dean)](https://github.com/cyriloberlander)

## License

This project is licensed under the MIT License

## Acknowledgments

A big thank you to our alpha and beta testers!  
Sue Armitage, Joan Berman, Victoria Bruner, Josh Callahan, Adam Carter, Jim Graham, Chris Guillen, Sally Hang, Julia Heatherwick, Alison Holmes, Katia Karadjova, Cyril Oberlander, Jeremy Shellhase, Meghann Weldon, Joshua Zender, and everyone at the Humboldt State University Library. Also a big thank you to the Graduation Initiative 2025 from California State University, and Humboldt State University for their support of this project. HSU Library provide project based learning opportunities to solve challenges faced by higher education and the community at large. One of the key questions for Citing Insights is how can we make assessment easier. 

## User Guide

A [quick guide](https://github.com/hsu-library-project-x/citing-insights-beta/blob/master/CI%20Documentation%20Beta.pdf) was developed by the Citing Insights team to assist users.

