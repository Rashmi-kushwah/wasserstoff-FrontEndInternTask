const io = require("socket.io")(4000, {
    cors: {
      origin: "http://localhost:3000", // React client ka URL
      methods: ["GET", "POST"]
    }
  });
  
  let users = [];
  
  io.on("connection", (socket) => {
    console.log("New user connected");
  
    // User joining event
    socket.on("join", (username) => {
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        console.log(`${username} already joined`);
        return;
      }
  
      users.push({ id: socket.id, username });
      console.log(`${username} joined`);
  
      // Send a join message
      io.emit("chat-message", { user: username, message: `${username} has joined the collaborative session.` });
    });
  
    // Editor content change event
    socket.on("editor-change", (data) => {
      socket.broadcast.emit("editor-change", {
        content: data.content
      });
    });
  
    // Chat message event
    socket.on("chat-message", (data) => {
      io.emit("chat-message", {
        user: data.user,
        message: data.message
      });
    });
  
    // User disconnect event
    socket.on("disconnect", () => {
      const user = users.find(u => u.id === socket.id);
      if (user) {
        console.log(`${user.username} disconnected`);
        io.emit("chat-message", {
          user: user.username,
          message: `${user.username} has left the collaborative session.`
        });
        users = users.filter(u => u.id !== socket.id);
      }
    });
  });
  