// const express = require("express");
// const app = express();
// const http = require('http');
// const axios = require('axios');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// // const io = new Server(server);
// const io = new Server(server, {
//     maxHttpBufferSize: 1e8 // 100 MB payload size limit
// });
// const mongoose = require("mongoose");
// const cors = require('cors')
// const postRoute = require("./routes/posts");
// const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const conversationRoute = require("./routes/conversations");
// const messageRoute = require("./routes/messages");

// const corsOptions = {
//     origin: 'https://snapverse-proj-client.vercel.app',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//   };
  
// app.use(cors(corsOptions));

// // Middleware
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
// app.use('/api/routes/messages', messageRoute);

// // Set up CORS headers
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

// // middleware to parse URL-encoded bodies 19/5/2024 (jwt not working)
// app.use(express.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://shawesh9814:$Hawesh7881@cluster0.me1aleh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//     .then(() => {
//         console.log("Connected to the database");
//         server.listen(8080, () => {
//             console.log("Server listening on port 8080");
//         });
//     })
//     .catch((err) => {
//         console.error("Error connecting to the database:", err);
// });

// const Message = require("./models/Message");

// let users = [];

// const addUser = async (userId, socketId) => {
//     !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//     users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//     return users.find((user) => user.userId === userId);
// };

// io.on('connection', (socket) => {
//     console.log('A user connected', socket.id);

//     socket.on("addUser", async (userId) => {
//         addUser(userId, socket.id);
//         io.emit("getUsers", users);

//         try {
//             // Fetch undelivered messages
//             const undeliveredMessages = await Message.find({ recipient: userId, isDelivered: false }).populate({
//                 path: 'sender',
//                 model: 'User',
//                 select: 'username profileImg',
//             });

//             // Emit undelivered messages to the user
//             io.to(socket.id).emit('getMessage', undeliveredMessages);

//             // Update isDelivered status to true
//             await Message.updateMany(
//                 { recipient: userId, isDelivered: false },
//                 { $set: { isDelivered: true } }
//             );
//         } catch (error) {
//             console.error('Error fetching or updating messages:', error);
//         }
//     });

//     socket.on('comment', (msg) => {
//         io.emit('new-comments', msg);
//     });

//     socket.on("sendMessage", async ({ conversationId, senderId, receiverId, text }) => {
//         const user = getUser(receiverId);
    
//         if (user) {

//             try {
//                 const response = await axios.post('https://snapverse-proj-api.vercel.app/api/routes/messages/', {
//                     conversationId: conversationId,
//                     sender: senderId,
//                     recipient: receiverId,
//                     text: text,
//                     isDelivered: true
//                 });
//                 io.to(user.socketId).emit("getMessage", response.data);
//                 socket.emit("newMessage", response.data);
//             } catch (error) {
//                 console.error("Error sending message:", error.response ? error.response.data : error.message);
//             }
//         } else {
//             try {
//                 const response = await axios.post('https://snapverse-proj-api.vercel.app/api/routes/messages/', {
//                     conversationId: conversationId,
//                     sender: senderId,
//                     recipient: receiverId,
//                     text: text,
//                     isDelivered: false
//                 });
//                 socket.emit("newMessage", response.data);
    
//                 console.log('User not found online, storing message for later');
//             } catch (error) {
//                 console.error("Error storing message:", error.response ? error.response.data : error.message);
//             }
//         }
//     });
    
    

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//         removeUser(socket.id);
//         io.emit("getUsers", users);
//     });
// });


// // Routes
// app.use("/api/posts", postRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/conversations", conversationRoute);
// app.use("/api/messages", messageRoute);


// // Test route
// app.get("/test", (req, res) => {
//     res.send("hi");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

const express = require("express");
const app = express();
const http = require('http');
const axios = require('axios');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // 100 MB payload size limit
});
const mongoose = require("mongoose");
const cors = require('cors')
const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

const corsOptions = {
    // origin: 'https://snapverse-proj-client-oe0nars2j-moamensultan14s-projects.vercel.app',
    origin: 'https://snapverse-proj-client-oe0nars2j-moamensult',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Add Authorization header if needed
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// Connect to MongoDB
mongoose.connect("mongodb+srv://shawesh9814:$Hawesh7881@cluster0.me1aleh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to the database");
        server.listen(8080, () => {
            console.log("Server listening on port 8080");
        });
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

const Message = require("./models/Message");

let users = [];

const addUser = async (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on("addUser", async (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);

        try {
            // Fetch undelivered messages
            const undeliveredMessages = await Message.find({ recipient: userId, isDelivered: false }).populate({
                path: 'sender',
                model: 'User',
                select: 'username profileImg',
            });

            // Emit undelivered messages to the user
            io.to(socket.id).emit('getMessage', undeliveredMessages);

            // Update isDelivered status to true
            await Message.updateMany(
                { recipient: userId, isDelivered: false },
                { $set: { isDelivered: true } }
            );
        } catch (error) {
            console.error('Error fetching or updating messages:', error);
        }
    });

    socket.on('comment', (msg) => {
        io.emit('new-comments', msg);
    });

    socket.on("sendMessage", async ({ conversationId, senderId, receiverId, text }) => {
        const user = getUser(receiverId);

        if (user) {
            try {
                const response = await axios.post('https://snapverse-proj-api.vercel.app/api/routes/messages/', {
                    conversationId: conversationId,
                    sender: senderId,
                    recipient: receiverId,
                    text: text,
                    isDelivered: true
                });
                io.to(user.socketId).emit("getMessage", response.data);
                socket.emit("newMessage", response.data);
            } catch (error) {
                console.error("Error sending message:", error.response ? error.response.data : error.message);
            }
        } else {
            try {
                const response = await axios.post('https://snapverse-proj-api.vercel.app/api/routes/messages/', {
                    conversationId: conversationId,
                    sender: senderId,
                    recipient: receiverId,
                    text: text,
                    isDelivered: false
                });
                socket.emit("newMessage", response.data);

                console.log('User not found online, storing message for later');
            } catch (error) {
                console.error("Error storing message:", error.response ? error.response.data : error.message);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

// Routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

// Test route
app.get("/test", (req, res) => {
    res.send("hi");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});





