require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./utils/db_connect');

// Import all models to register them with mongoose
require('./models/userModel');
require('./models/movieModel');
require('./models/regionModel');
require('./models/theaterModel');
require('./models/screenModel');
require('./models/seatTypeModel');
require('./models/screenSeatModel');
require('./models/showModel');
require('./models/showSeatStatusModel');
require('./models/bookingModel');
require('./models/paymentModel');
require('./models/invoiceModel');
require('./models/movieRatingModel');
require('./models/permissionModel');
require('./models/userRoleModel');
require('./models/theaterMovie');

const userRoutes = require('./routes/userRoute');
const movieRoutes = require('./routes/movieRoute');
const regionRoutes = require('./routes/regionRoute');
const showRoutes = require('./routes/showRoute');
const bookingRoutes = require('./routes/bookingRoute');
const theaterRoutes = require('./routes/theaterRoute');
const paymentRoutes = require('./routes/paymentRoute');
const cors = require('cors');

try {
    connectDB(process.env.DB_NAME);

    const app = express();

    app.use(cors());

    app.use('/static', express.static(path.join(__dirname, 'public')));

    app.use(express.json());

    //@TODO: add middleware to log the request
    app.use((req, res, next) => {
        console.log(req);
        //@TODO: Update logger
        next();
    })

    app.get('/', (req, res) => {
        res.send("Bookmyshow server...");
    });

    app.use('/api/shows', showRoutes);
    app.use('/api/regions', regionRoutes);
    app.use('/api/movies', movieRoutes);
    app.use('/api/theaters', theaterRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/payments', paymentRoutes);

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err)
        }
        //@TODO: based on the err type send the status code.
        res.status(500).send({
            error: err.message
        });
    })

    app.listen(process.env.PORT, () => {
        // console.log(process.env);
        console.log('Server is up and listening at port: ', process.env.PORT);
    });

} catch (err) {
    console.log(err);
}

