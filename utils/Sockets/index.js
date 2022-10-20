const { Server } = require("socket.io");
const utils = require('../index')
const Models = require('../../models');
const ObjectId = require('mongoose').Types.ObjectId;
const pushNotification = require('../Notification');
const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var Socket = {
    emit: function (event, data) {
        console.log("************* Socket Emit *************************")
        console.log("EventId:::::::", event, "--------->", data)
        io.sockets.emit(event, data);
    },
    emitToRoom: function (room, event, data) {
        console.log("************* Socket Emit *************************")
        console.log("RoomId::::::::", room)
        console.log("EventId:::::::", event, "--------->", data)
        io.to(room).emit(event, data);
    }
};

let Users = {

}

io.use(async (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        let decoded = await utils.jwtVerify(socket.handshake.query.token);
        if (!decoded) return next(new Error('Authentication error'));
        else {
            Users[String(socket.id)] = decoded._id
            console.log(decoded._id)
            next();
        }
    }
    else { next(new Error('Authentication error')); }
}).on("connection", function (socket) {
    console.log("************ User Attached **********")

    io.sockets.emit('socketConnected', {
        status: 200, message: "socket connected", data: {
            socketId: socket.id
        }
    });

    socket.on("connectUser", async (data) => {
        try {
            let userId = Users[String(socket.id)]
            console.log("************ User Connect **********", socket.id, userId)
            socket.join(userId);
            io.to(userId).emit("connectUser", { status: 200 });
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("disConnect", async (data) => {
        try {
            console.log("disconnect event");
            let userId = Users[String(socket.id)]
            socket.leave(userId);
            io.to(userId).emit("disConnect", { status: 200 });
            delete Users[String(socket.id)]
        } catch (error) {
        }
    })

    socket.on("sendMessage", async (data) => {
        console.log(data);
        let userId = Users[String(socket.id)]
        let recieverDetails = await Models.Customer.findOne({ _id: ObjectId(data.reciever) }).lean();
        if (!recieverDetails) {
            recieverDetails = await Models.Admin.findOne({ _id: ObjectId(data.reciever) }).lean();
        }
        let senderDetails = await Models.Customer.findOne({ _id: ObjectId(userId) }).lean();
        if (!senderDetails) {
            senderDetails = await Models.Admin.findOne({ _id: ObjectId(userId) }).lean();
        }
        let chat = "";
        if (data.chatId) {
            chat = await Models.Chat.findOne({ _id: ObjectId(data.chatId) }).lean();
            if (!chat) {
                io.to(userId).emit("sendMessage", { status: 400, message: "chat not exist", data: data });
                return;
            }
        }
        else {
            if (data.order === "CTA") {
                chat = await Models.Chat({
                    admin: data.reciever,
                    customer: data.sender
                }).save();
            }
            else {
                chat = await Models.Chat({
                    admin: data.sender,
                    customer: data.reciever
                }).save();
            }
            chat = await Models.Chat.findOne({ _id: chat._id }).lean();
            data.chatId = chat._id;
        }
        let chatMessage = await Models.ChatMessage(data).save();
        chatMessage = await Models.ChatMessage.findOne({ _id: ObjectId(chatMessage._id) }).lean();
        io.to(data.reciever).emit("recieveMessage", { status: 200, message: "message recieved successfully", data: chatMessage })
        pushNotification.pushNotification(recieverDetails.deviceType, recieverDetails.deviceToken, "Biguards Chat Notification", `chat message from ${senderDetails.firstName} ${senderDetails.lastName}`, chatMessage)
        io.to(userId).emit("sendMessage", { status: 200, message: "message sent successfully", data: chatMessage });
    })

});
exports.Socket = Socket;
exports.io = io;