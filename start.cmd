@echo off

start "" node app.js

cd .\IonicCordova\

start "" ionic serve --no-open

start "" chrome "http://localhost:8100"