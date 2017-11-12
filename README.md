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

## Screenshots
 1. Login
![1 login](https://user-images.githubusercontent.com/15712061/32700355-b75a0d96-c7e9-11e7-945b-23cbc45e86da.png)
 2. Home
![2 home](https://user-images.githubusercontent.com/15712061/32700356-b7a12e06-c7e9-11e7-9163-89939ada6606.png)
 3. Downloads
![3 download](https://user-images.githubusercontent.com/15712061/32700357-b7ea4d34-c7e9-11e7-896c-e7afb637e0bf.png)
 4. Start Connection
![4 connect](https://user-images.githubusercontent.com/15712061/32700358-b8305860-c7e9-11e7-8471-6ff31bb547d9.png)
 5. Connection Confirmation
![5 confirmation](https://user-images.githubusercontent.com/15712061/32700359-b889a0e6-c7e9-11e7-8031-808e3d737de9.png)
 6. Connected
![6 connected](https://user-images.githubusercontent.com/15712061/32700360-b8ca56b8-c7e9-11e7-9aa0-ff3ab810f1b7.png)
 7. Performance Metrics
![7 performance](https://user-images.githubusercontent.com/15712061/32700361-b918c1ea-c7e9-11e7-9575-cdcbdc2d5cae.png)
