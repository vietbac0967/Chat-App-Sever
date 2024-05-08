import { Server } from "socket.io";
import http from "http";
import app from "../../app.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  connectionStateRecovery: {},
});
global.onlineUsers = new Map();
let clients = [];
let activeUsers = [];
let userInGroup = [];
io.on("connection", (socket) => {
  // console.log("a user connected", socket.id);
  // store client info
  socket.on("storeClientInfo", (data) => {
    console.log("storeClientInfo", data);
    if (data && data.customId) {
      const existingClientIndex = clients.findIndex(
        (client) => client.customId === data.customId
      );

      if (existingClientIndex !== -1) {
        clients[existingClientIndex] = {
          customId: data.customId,
          clientId: socket.id,
        };
      } else {
        var clientInfo = {
          customId: data.customId,
          clientId: socket.id,
        };
        clients.push(clientInfo);
      }
      console.log(clients);
    }
  });

  socket.on("sendNotification", (data) => {
    console.log("data notification:::", data);
    const receiver = data.receiver;
    if (clients && clients.length > 0) {
      const index = clients.findIndex(
        (item) => item.customId.localeCompare(receiver.phoneNumber) === 0
      );
      console.log("index:::", index);
      if (index !== -1) {
        socket.to(clients[index].clientId).emit("refreshNotification", data);
      }
    }
  });

  socket.on("sendMessage", (data) => {
    console.log("data message:::", data);
    const sender = data.sender;
    const receiver = data.receiver;

    console.log("sender:::", sender);
    console.log("receiver:::", receiver);
    if (clients && clients.length > 0) {
      const index = clients.findIndex(
        (item) => item.customId.localeCompare(receiver.phone) === 0
      );
      const indexSender = clients.findIndex(
        (item) => item.customId.localeCompare(sender.phone) === 0
      );
      console.log("index:::", index);
      if (index !== -1) {
        socket.to(clients[index].clientId).emit("refreshMessage", {
          phone: sender.phone,
          userId: sender.userId,
        });
        // socket.to(clients[index].clientId).emit("refreshMessage", data);
      }
      if (indexSender !== -1) {
        socket.emit("refreshMessageSender", {
          phone: receiver.phoneNumber,
          userId: receiver.userId,
        });
      }
    }
  });

  socket.on("inConversation", (data) => {
    // console.log("data inConversation:::", data);
    if (data && data.customId) {
      const existingClientIndex = activeUsers.findIndex(
        (client) => client.customId === data.customId
      );

      if (existingClientIndex !== -1) {
        activeUsers[existingClientIndex] = {
          customId: data.customId,
          clientId: socket.id,
        };
      } else {
        const clientInfo = {
          customId: data.customId,
          clientId: socket.id,
        };
        activeUsers.push(clientInfo);
      }
      console.log("activeUsers", activeUsers);
      socket.emit("refreshActiveUsers", activeUsers);
    }
  });

  socket.on("outConversation", (data) => {
    console.log("data outConversation:::", data);
    if (activeUsers.length > 0) {
      const index = activeUsers.findIndex(
        (item) => item.customId.localeCompare(data.phone) === 0
      );

      if (index !== -1) {
        activeUsers.splice(index, 1);
      }
      console.log("activeUsers", activeUsers);
      socket.emit("refreshNotActiveUsers", activeUsers);
    }
  });

  socket.on("disconnet", () => {
    if (clients && clients.length > 0) {
      let index = clients.filter(
        (item) => item.clientId.localeCompare(socket.id) !== 0
      );
      clients = [...index];
      console.log(clients);
    }
  });

  socket.on("logout", (data) => {
    console.log("check data", data);
    if (clients && clients.length > 0) {
      const index = clients.findIndex(
        (client) => client.customId === data.customId
      );
      console.log(index);
      if (index !== -1) {
        clients.splice(index, 1);
        console.log(`Người dùng ${data.customId} đã đăng xuất.`);
      }
      console.log(clients);
    }
  });

  socket.on("joinGroup", (data) => {
    console.log("check data", data);
    socket.join(data.groupId);
    if (data && data.user.phoneNumber && data.groupId) {
      const existingClientIndex = userInGroup.findIndex(
        (client) => client.customId === data.user.phoneNumber
      );

      if (existingClientIndex !== -1) {
        userInGroup[existingClientIndex] = {
          customId: data.user.phoneNumber,
          groupId: data.groupId,
        };
      } else {
        const clientInfo = {
          customId: data.user.phoneNumber,
          groupId: data.groupId,
        };
        userInGroup.push(clientInfo);
      }
      console.log("user in group is", userInGroup);
      socket.emit(
        "refreshUserInGroup",
        userInGroup.filter((item) => item.groupId === data.groupId)
      );
    }
    if (data && data.user && data.groupId) {
      console.log(`User ${data.user} joined room: ${data.namegroup}`);
    } else {
      console.log(`User ${data.user} is ready`);
    }
  });

  socket.on("sendMessageInGroup", (data) => {
    console.log(data);
    io.to(data.groupId).emit("receiveMessageInGroup", {
      groupId: data.groupId,
    });
  });

  socket.on("sendNotificationInGroup", (data) => {
    const groupId = data.groupId;
    if (userInGroup.length > 0) {
      const users = userInGroup.filter((item) => item.groupId === groupId);
      users.forEach((user) => {
        const index = clients.findIndex(
          (item) => item.customId.localeCompare(user.customId) === 0
        );
        if (index !== -1) {
          socket
            .to(clients[index].clientId)
            .emit("refreshNotificationInGroup", data);
        }
      });
    }
  });

  socket.on("leaveGroup", (data) => {
    socket.leave(data.groupId);
    console.log(`User ${data.user} left room: ${data.groupId}`);
  });

  socket.on("sendtest", (data) => {
    let sender = data.sender;
    let receiver = data.receiver;
    if (clients && clients.length > 0) {
      let index = clients.findIndex(
        (item) => item.customId.localeCompare(receiver) === 0
      );
      if (index !== -1) {
        socket.to(clients[index].clientId).emit("refresh", () => {
          console.log("test success");
        });
      } else {
        console.log("test error");
      }
    }
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", { groupId: data.groupId });
  });

  socket.on("allinfo", (data) => {
    io.emit("allinfo", data);
  });

  socket.on("sendaddgroup", () => {
    io.emit("sendaddgroup");
  });
});

export { io, server };
