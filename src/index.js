const express = require('express')
const pjson = require('./../package.json')
const mongoose = require('mongoose')
const session = require("express-session")
const redis = require("redis")
const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
const bodyParser = require('body-parser');
const cors = require("cors")

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('../config/config')

const port = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.enable("trust proxy")
app.use(cors({}))

const RedisStore = require("connect-redis")(session)

redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
    legacyMode: true,
});

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('succesfully connected to DB'))
        .catch((e) => {
            console.log(e)
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

app.get('/api/v1/', (req, res) => {
    res.send(`<h1>Server ${pjson.version}</h1>`)
    console.log('test nginx')
})

redisClient.connect()

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`)
})