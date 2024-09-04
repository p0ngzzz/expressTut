const allowedOrigin = require('./allowedOrigin');
// const whiteList = [
//   "https://www.yoursite.com",
//   "http://127.0.0.1:5500",
//   "http://localhost:3500",
// ]; //assign where domain can access the backend server
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      // mean if domain is in whiteList
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions