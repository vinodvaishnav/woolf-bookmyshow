const readline = require('readline');
const connectDB = require('../utils/db_connect');
const regionModel = require('../models/regionModel');
const theaterModel = require('../models/theaterModel');
const movieModel = require('../models/movieModel');
const screenModel = require('../models/screenModel');
const seatTypeModel = require('../models/seatTypeModel');
const userModel = require('../models/userModel');
const userRoleModel = require('../models/userRoleModel');
const encryptPassword = require('../utils/encryptPassword');
const ROLES = require('../constants/roles');

require('dotenv').config();

(async () => {
    try {
        await connectDB(process.env.DB_NAME);
        console.log('Database connection established successfully!');

        // await createUser();

        // await createMovie();

        const regionId = await createRegion('Bengaluru');
        console.log('Region created successfully!');

        const theaterId = await createTheater('INOX', regionId);
        console.log('Theater created successfully!');

        const seatType1 = await createSeatType(theaterId, 'Diamond');
        const seatType2 = await createSeatType(theaterId, 'Gold');
        console.log('Seat types created successfully!');

        const screen = await createScreen(theaterId, 'Entertenment', 18, seatType1._id, seatType2._id);
        const screen2 = await createScreen(theaterId, 'Oracle', 24, seatType1._id, seatType2._id);
        console.log('Screen created successfully!');
        // @TODO: Create new test user
        // @TODO: Add a region
        // @TODO: Add new Theater and partner user to manage the theater
        // @TODO: Add few movies, screens, shows, and seats for testing
        process.exit(0);
    } catch (error) {
        console.error('Error while connecting to database:', error);
        process.exit(1);
    }
})();

async function createUser() {
    const userRole = await userRoleModel.findOne({ name: ROLES.USER });
    const hashedPassword = await encryptPassword('User@123');
    const user = new userModel({
        first_name: 'Testt',
        last_name: 'User2',
        phone: '9123456788',
        email: 'test.user2@example.com',
        password: hashedPassword,
        role: userRole._id
    });
    await user.save();
    console.log('Test user created successfully!');
}

async function createRegion(regionName = 'Bengaluru') {
    const region = await regionModel.findOneAndUpdate(
        { name: regionName },
        { name: regionName },
        { upsert: true, new: true }
    );

    return region._id;
}

async function createTheater(name, regionId) {
    const theater = await theaterModel.findOneAndUpdate(
        { name: name, region: regionId },
        { name: name, region: regionId, address: 'Some address in the region' },
        { upsert: true, new: true }
    );

    return theater._id;
}

async function createMovie() {
    const movies = [{
        name: 'Avengers: Endgame',
        description: 'The final battle of the Infinity Saga',
        duration: 181,
        poster: 'https:\/\/image.tmdb.org\/t\/p\/original\/jhZlXSnFUpNiLAek9EkPrtLEWQI.jpg',
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
        languages: 'English',
        genres: 'Action, Adventure, Sci-Fi',
        release_date: new Date('2019-04-26'),
        imdb_rating: 8.4,
        imdb_comment: 'A fitting end to the Infinity Saga with emotional depth and thrilling action sequences.'
    },
    {
        name: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        duration: 148,
        poster: 'https:\/\/image.tmdb.org\/t\/p\/original\/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
        languages: 'English',
        genres: 'Action, Adventure, Sci-Fi',
        release_date: new Date('2010-07-16'),
        imdb_rating: 8.8,
        imdb_comment: 'A mind-bending thriller that blurs the line between dreams and reality with stunning visuals and a complex narrative.'
    },
    {
        name: 'The Dark Knight',
        description: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        duration: 152,
        poster: 'https:\/\/image.tmdb.org\/t\/p\/original\/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
        languages: 'English',
        genres: 'Action, Crime, Drama',
        release_date: new Date('2008-07-18'),
        imdb_rating: 9.0,
        imdb_comment: 'A dark and gripping superhero film with a legendary performance by Heath Ledger as the Joker.'
    },
    {
        name: '3Idiots',
        description: 'Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them "idiots".',
        duration: 170,
        poster: 'https:\/\/image.tmdb.org\/t\/p\/original\/oBgRCpAbtMpk1vS2ScJqM7TjGZ.jpg',
        cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor'],
        languages: 'Hindi',
        genres: 'Comedy, Drama',
        release_date: new Date('2009-12-25'),
        imdb_rating: 8.4,
        imdb_comment: 'A heartwarming and thought-provoking film that challenges the traditional education system with humor and emotion.'
    },
    {
        name: 'Jindgi Na Milegi Dobara',
        description: 'Three friends embark on a journey to find their lost friend, leading them through a series of adventures and life lessons.',
        duration: 170,
        poster: 'https:\/\/image.tmdb.org\/t\/p\/original\/oBgRCpAbtMpk1vS2ScJqM7TjGZ.jpg',
        cast: ['Hrithik Roshan', 'Ranbir Kapoor', 'Arjun Rampal'],
        languages: 'Hindi',
        genres: 'Comedy, Drama',
        release_date: new Date('2011-08-12'),
        imdb_rating: 8.2,
        imdb_comment: 'A fun and engaging film that explores themes of friendship and life choices with great performances.'
    }
    ];
    await movieModel.insertMany(movies);

    console.log('Movies created successfully!');
}

async function createScreen(theaterId, name, totalSeats, seatTypeId, seatTypeId2) {
    const screen = new screenModel({
        theater: theaterId,
        name: name,
        totalSeats: totalSeats,
        seats: Array.from({ length: totalSeats }, (_, i) => ({
            number: i + 1,
            row: String.fromCharCode(65 + Math.floor(i / 4)), // Rows A, B, C, etc.
            type: i < totalSeats / 2 ? seatTypeId : seatTypeId2
        }))
    });

    return await screen.save();
}

async function createSeatType(theaterId, name) {
    // Theaters give their own type of seats
    const seatType = new seatTypeModel({
        theater: theaterId,
        name: name // This will be used to calculate the price of the seat based on the base price of the show
    });
    return await seatType.save();
}

async function addSeats() {
    // Add seats for a particular screen and seat type
    // optional: Every seat may also have position information like row and column number (Start row, Start Column, End Row, End Column) which can be used for better seat selection by users
}

async function createShow(theaterId, movieId, screenId, showTime) {
    // Show will be created for a movie on a particular screen at a particular time
    // along with show it will create show_seat_types having pricing for each seat type for that show
    // Add show Seats for that show based on the screen and seat types available for that screen

    // get the screen details to add all the seats to show object



    // In Admin Adding a show is multi step process
    // 1. Admin will select the movie for which he wants to add the show
    // 2. Admin will select screen for that show
    // 3. Show all the details about the screen along with the seat types available for that screen to admin (SeatType can be a calculated field in screen model which will fetch all the seat types available for that screen based on the seats added for that screen)
    // 4. Admin will select the show time for that show (Optional System can also suggest the show time based on the existing shows for that screen and movie duration)
    // 5. Admin will set the price for each seat type for that show
    // 6. Admin will confirm and add the show

}


