require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./utils/db_connect');
const userRoutes = require('./routes/userRoute');
const movieRoutes = require('./routes/movieRoute');
const regionRoutes = require('./routes/regionRoute');
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

    app.use('/api/regions', regionRoutes);
    app.use('/api/movies', movieRoutes);
    app.use('/api/user', userRoutes);

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

