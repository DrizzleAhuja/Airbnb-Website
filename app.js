if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require('connect-flash');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const User = require('./models/user.js');
const ExpressError = require('./errors/ExpressError.js');
const wrapAsync = require('./errors/wrapAsync.js');
const listingRouter = require('./routes/listings.js');
const userRouter = require('./routes/user.js');
const reviewRouter = require('./routes/review.js');



const dbUrl = process.env.ATLASDB_URL;

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connection successful with MongoDB Atlas.");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
    }
}

main();

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "images")));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/listings', listingRouter);
app.use('/listings/:listingId/review', reviewRouter);
app.use('/', userRouter);

app.listen(8010, () => {
    console.log('Server is listening on port 8010');
});

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Route not found'));
});

app.use((err, req, res, next) => {
    let { status = 500, message = 'Something went wrong!' } = err;
    res.status(status).render('error.ejs', { message });
});
// -------:\Users\drizz\OneDrive\Documents\NODEJS_FULL\Airbnb Website\node_modules\@mapbox\mapbox-sdk\lib\classes\mapi-client.js:25
//     throw new Error('Cannot create a client without an access token');
//     ^

// Error: Cannot create a client without an access token
//     at NodeClient.MapiClient (C:\Users\drizz\OneDrive\Documents\NODEJS_FULL\Airbnb Website\node_modules\@mapbox\mapbox-sdk\lib\classes\mapi-client.js:25:11)
//     at new NodeClient (C:\Users\drizz\OneDrive\Documents\NODEJS_FULL\Airbnb Website\node_modules\@mapbox\mapbox-sdk\lib\node\node-client.js:7:14)
//     at createNodeClient (C:\Users\drizz\OneDrive\Documents\NODEJS_FULL\Airbnb Website\node_modules\@mapbox\mapbox-sdk\lib\node\node-client.js:24:10)
//     at C:\Users\drizz\OneDrive\Documents\NODEJS_FULL\Airbnb Website\node_modules\@mapbox\mapbox-sdk\services\service-helpers\create-service-factory.js:13:16
//     at Object.<anonymous> (C:\Users\drizz\OneDrive\Documents\NODEJS_FULL\Airbnb Website\controllers\listings.js:6:25)
//     at Module._compile (node:internal/modules/cjs/loader:1378:14)
//     at Module._extensions..js (node:internal/modules/cjs/loader:1437:10)
//     at Module.load (node:internal/modules/cjs/loader:1212:32)
//     at Module._load (node:internal/modules/cjs/loader:1028:12)
//     at Module.require (node:internal/modules/cjs/loader:1237:19)

// Node.js v21.6.1
// [nodemon] app crashed - waiting for file changes before starting...
// -------correct code