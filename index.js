const express = require("express");
// const http = require('http')
// const {Server} = require("socket.io")
require("dotenv").config();
const cors = require('cors')
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session);
const connectDb = require("./connection/connectDB")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const riderRoute = require("./routes/rider")
const notificationRoute = require("./routes/userNotification")
// const adminRoute = require("./routes/admin")
const requestRoute = require("./routes/request")


// INITIALIZE THE APP
const app = express();
// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

var store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
  });


// MIDDLEWARES
app.use(express.json())
app.use(session({
    secret: process.env.SESS_SEC,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
app.use(cors())

// const isAuth = (req, res, next) => {
//     if (req.session.isAuth) {
//         next()
//     } else {
//         res.status(400).json({success: false, message: "You are Not Loged In"})
//     }
// }

// ROUTES
app.use("/api/v1/jwtauth/auth", authRoute)
app.use("/api/v1/jwtauth/user", userRoute)
app.use("/api/v1/jwtauth/riders", riderRoute)
app.use("/api/v1/jwtauth/request", requestRoute)
app.use("/api/v1/jwtauth/notification", notificationRoute)
app.use('/images', express.static('images'))
// app.use("/api/v1/jwtauth/admin", adminRoute)

// Run when client Connects
// io.on('connection', (socket) => {
//     console.log(`User ${socket.id} is connected...`);

//     socket.on('message', data => {
//         socket.broadcast.emit('message:recieved', data)
//     })

//     socket.on('disconnect', () => {
//         console.log(`User ${socket.id} Left...`);
//     })
//     console.log('NEW WS Connection');
// })

const port = process.env.PORT || 5000

// Start Server
const start = async () => {
    try {
        await connectDb()
        app.listen(port, console.log(`Server Listening on Port ${port} and Database connected Successfully`))
    } catch (error) {
        console.log(error);
    }
}

start()