import React, { useEffect, useRef, useState } from "react";
import Editor from "./components/Editor";

function App() {
  const [username, setUsername] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const channel = useRef(null);

  useEffect(() => {
    if (username) {
      channel.current = new BroadcastChannel("realtime-quill");

      // Broadcast user joined
      channel.current.postMessage({ type: "join", username });

      channel.current.onmessage = (e) => {
        if (e.data.type === "join" && e.data.username !== username) {
          setOnlineUsers((prev) => {
            const users = new Set([...prev, e.data.username]);
            return [...users];
          });
        }
      };

      // Add self
      setOnlineUsers((prev) => [...prev, username]);

      return () => {
        channel.current.close();
      };
    }
  }, [username]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {!username ? (
        <div className="flex justify-center items-center h-screen">
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 border rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") setUsername(e.target.value.trim());
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded shadow text-sm">
              <span className="font-semibold">🟢 Online Users: </span>
              {onlineUsers.join(", ")}
            </div>
          </div>
          <Editor username={username} />
        </>
      )}
    </div>
  );
}

export default App;
