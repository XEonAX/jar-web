# jar-web

## Java Applet Replacement - Web Application

This repository contains code for Node.js based web application.
It uses MongoDB as database.

This application is an example to which **jar-client(-x)** can connect and can be used to perform actions that are outside the limitations of the browser.

For e.g. This web application will show you Performance metrics of your machine when connected by a proper **jar-client(-x)** application.

### Pre-requisites to run/debug (Recommended)

 - Node.js 8.2.1
 - MongoDB 3.4.6
 - Visual Studio Code

## How to run

 1. Ensure Node.js and MongoDB are installed.
 2. Clone this Github repository.
 3. Start an MongoDB Daemon with following command `"<Path to MongoDB Bin>\mongod.exe" --dbpath=<Path to Writable Folder that can hold DB Files>`
 4. Open the cloned repository in terminal and execute `npm install`. This will install all the dependencies required by this application
 5. Once dependencies are installed. Execute `npm start`.
 6. Web Application will start listening on Localhost:3000
 7. Visit http://localhost:3000/
 8. Register a new user. For e.g. User/User
 9. Enjoy!!!


## How to debug 
 1. Ensure MongoDB Daemon is running.
 2. Open the repository in Visual Studio Code.
 3. Ensure you have executed `npm install` atleast once. If not you can run the same via Visual Studio Code's integrated terminal.
 4. Press `F5` to start debugging. Enjoy!!!

