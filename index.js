// start express.js
// Express.js + middleware
require('dotenv').config() // use here in mongoDB topic
const express = require("express"); // import express module
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOption');
const credentials = require('./middleware/credentials');
const { logEvents, logger } = require('./middleware/logEvents');
const errorHandler  = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/jwt');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); //  module mongoose for work with mongoDB
const connectDB =require('./config/dbConn')
const PORT = process.env.PORT || 3500; //defined port of server at 3500

// connect mongoDB 
connectDB()

// custom middleware logger
// let'see built-in middleware does not need next()
// but custom middleware need it 
// app.use((req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt') //req.headers.origin mean where the request coming from where website send to us => undefined mean we run on localhost
//     console.log(`${req.method} ${req.path}`)
//     next()
// })

// clean custom middleware in logEvents.js
app.use(logger)
// setting cors in config file
// cross origin resource sharing 
// const whiteList = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'] //assign where domain can access the backend server
// // custom cors
// // || !origin cause not have this it res.send() wil send error 
// const corsOptions = {
//     origin: (origin, callback) => {
//         if (whiteList.indexOf(origin) !== -1 || !origin) { // mean if domain is in whiteList
//             callback(null, true)
//         }else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     optionsSuccessStatus: 200
// }
app.use(credentials)

// app.use(cors());  
app.use(cors(corsOptions))

// built-in middleware to handler urlencoded data => form data
// 'Content-Type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false})); //app.use use to apply middleware to all routes

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in middleware static file 
// express static middleware use for read image, css, txt
app.use('/', express.static(path.join(__dirname, '/public')) );
app.use('/subdir',express.static(path.join(__dirname, '/public'))); // if page 404 for subdir path not use css use this
app.use('/product',express.static(path.join(__dirname, '/public'))); // if page 404 for subdir path not use css use this


// middleware routing
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/products', require('./routes/api/products')) // api products
app.use('/new-register', require('./routes/api/new_register')) 
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

app.use(verifyJWT); // it mean routes below verifyJWT middleware will get verifyJWT
app.use('/employees', require('./routes/api/employees'));




// express use http method (first start express here)
// app.get('/', (req, res) => {
//     // res.send('Hello World') // send response to browser
//     // res.sendFile('./views/index.html', {root: __dirname}) //sendFile
//     res.sendFile(path.join(__dirname, 'vi`ews', 'index.html')) //sendFile
// })

// use regex with routing
// app.get("^/$|/index(.html)?", (req, res) => { // ^/$ : mean start with / and end with /, and /index(.html)? : mean contain /index with optional .html
//     res.sendFile(path.join(__dirname, 'views', 'index.html'))
//     // or we can send statusCode in same time
//     // res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'))
// })
// app.get('/new-page.html|/new-page', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'new-page.html')) //sendFile
// })
// app.get('/old-page(.html)?', (req, res) => {
//     // res.sendFile(path.join(__dirname, 'views', 'new-page.html'))  //
//     // res.redirect 
//     res.redirect(301, '/new-page.html') 
// })

// *** route handler
// app.get('/hello(.html)?', (req, res, next) => {
//     console.log('attempted to load hello.html')
//     next()
// }, (req, res) => { //chain routing
//     res.send('Hello World!')
// })
// // route handler : chaining route handler
// const one = (req, res, next) => {
//     console.log("one")
//     next()
// }
// const two = (req, res, next) => {
//     console.log("two")
//     next()
// }
// const three = (req, res) => {
//     console.log("three")
//     res.send("Finished chaining")
// }
// app.get('/chain(.html)?', [one,two, three]); // it mean req.url = chain(.html)? chain function one two and three respectively

// route handler : middleware => it similar like route chaining
// middleware is anything between request and response 
// middleware => built-in, custom, third party middleware


// route handler : all req route that does not existed route
app.all('/*', (req, res) => {
    // res.status(404);.sendFile(path.join(__dirname, 'views', '404.html'))
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    }else {
        res.type('txt').send("404 Not Found");
    }
})

// use middleware to handle error function **
// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send(err.message)
// })

// make cleaner about middleware handler error function
app.use(errorHandler);

// handle event when mongoDB connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`)
    })
})
// launch server with server.listen
