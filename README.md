# Readme

This is a replica project of Bookmyshow application.

FE Technologies:
React
Ant Design

BE Technologies
NodeJs
Express
MongoDB

## Note
This Project repository contains both Server and Client code in their respective directories. And need to install their dependencies seprate.

## setup instructions:
Server:
1. Create a Mondo DB database using MongoDB Atlas. 
2. Go to ./server directory
3. create .env file using default.env updating your parameters
4. run "npm run install" to install all the server dependencies
5. run "npm run seed" command to seed permissions and create Admin account
6. run "npm run feed" command to run script that can create some test data
(Update ./server/scripts/createTestData.js to create test data)
7. Now system has all required basic dataset ready, just run the server by using following command:
"npm run dev"

## client instructions:
1. Go to ./client directory
2. run "npm run install" to install all the client dependencies
3. run "npm run start" to run application on http://localhost:3000

## Note
Code contains some commented code for debugging and TODOs for future enhancments.
