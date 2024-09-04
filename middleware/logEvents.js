// import module
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => { // have 2 parameter are message and logName
  const dateTime = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  console.log("logItem: ", logItem);
  try {
    // change path logFile cause we don't wanna write the logFile in middleware folder
    if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
    }    
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
  } catch (err) {
    console.log(err);
  }
};``

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt') //req.headers.origin mean where the request coming from where website send to us => undefined mean we run on localhost
  console.log(`${req.method} ${req.path}`)
  next()
}

// fetch('http://localhost:3500') in google inspect => allow cors origin  => npm i cors

module.exports = { logEvents, logger};
