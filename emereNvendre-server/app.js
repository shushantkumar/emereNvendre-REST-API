const express = require('express'); //same as omporting express service
const app = express();              //this starts all application of express
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//products route
const productRoutes = require('./api/routes/products');

//orders route
const orderRoutes = require('./api/routes/orders');

//users route
const userRoutes = require('./api/routes/users');

//mongoose.connect('mongodb://shushantenv:' + process.env.MONGO_ATLAS_PW + '@emerenvendre-platform-shard-00-00-mpdnx.mongodb.net:27017,emerenvendre-platform-shard-00-01-mpdnx.mongodb.net:27017,emerenvendre-platform-shard-00-02-mpdnx.mongodb.net:27017/test?ssl=true&replicaSet=emereNvendre-platform-shard-0&authSource=admin')
/*mongoose.connect(
      "mongodb+srv://shushantenv:"+
      process.env.MONGO_ATLAS_PW +"@emerenvendre-platform-mpdnx.mongodb.net/test",
    {
      //useMongoClient: true
    }
);*/
const mongoDB = 'mongodb://127.0.0.1/emerenvendre';
mongoose.connect(mongoDB);
mongoose.Promise= global.Promise;       //to remove some warning

//dev is the format we want to use
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

//applying body-parser to url encodings and json requests
app.use(bodyParser.urlencoded({ extended: false }));    //can be set true for higher level stuffs in url requests
app.use(bodyParser.json());

//so anything starting with /products will route to productRoutes
app.use('/products', productRoutes);

//so anything starting with /orders will route to orderRoutes
app.use('/orders', orderRoutes);

app.use('/users', userRoutes);

//this is to attach headers before routing to specific routes for countering CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");     //giving access to any origin
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"   //could have been "*" but this is specific
    );
    if (req.method === 'OPTIONS') {     //browser sends option requests first
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');    //to allow the access requests
        return res.status(200).json({});
    }
    next();         //if we are not getting OPTIONS then continue with other stuffs
  });


//to handle errors anything getting past above two
app.use((req, res, next) => {
    const error = new Error('Not found');       //Error is by default to handle errors
    error.status = 404;
    next(error);
})

//this is for any errors in the setup used in db
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message          //.message is general property of returning message 
        }
    });
});

/*
//any request is passed through app
app.use((req, res, next) => {
    res.status(200).json({          //sending a json response status here 
        message: 'It works!'        //the message
    });
});
*/
module.exports = app;               //this basically exports