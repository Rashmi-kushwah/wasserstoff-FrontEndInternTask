import React, { useEffect, useRef, useState } from "react";
import Editor from "./components/Editor"; // Editor component ko import kar rahe hain

function App() {
  const [username, setUsername] = useState(""); // Username state to store the user's name
  const [onlineUsers, setOnlineUsers] = useState([]); // Online users ki list ko store karne ke liye
  const channel = useRef(null); // BroadcastChannel ka reference banaya gaya

  useEffect(() => {
    if (username) {
      // Agar username set ho gaya to BroadcastChannel open karenge
      channel.current = new BroadcastChannel("realtime-quill");

      // User join hone ka message broadcast karna
      channel.current.postMessage({ type: "join", username });

      // Incoming messages ko handle karna
      channel.current.onmessage = (e) => {
        if (e.data.type === "join" && e.data.username !== username) {
          // Agar koi naya user join ho raha ho to online users ko update karna
          setOnlineUsers((prev) => {
            const users = new Set([...prev, e.data.username]);
            return [...users]; // Online users ki unique list banayenge
          });
        }
      };

      // Apne aap ko online users me add karenge
      setOnlineUsers((prev) => [...prev, username]);

      // Cleanup function, jab component unmount ho to channel band ho jaye
      return () => {
        channel.current.close();
      };
    }
  }, [username]); // Username change hone par ye effect run hoga

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      {!username ? (
        // Agar username nahi hai to input box dikhega
        <div className="flex justify-center items-center h-screen">
          <input
            type="text"
            placeholder="Enter your name" // Name input box
            className="p-2 border rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") setUsername(e.target.value.trim()); // Enter key press karne pe username set hoga
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded shadow text-sm">
              <span className="font-semibold">🟢 Online Users: </span>
              {onlineUsers.join(", ")} {/* Online users ka list show hoga */}
            </div>
          </div>
          <Editor username={username} /> {/* Editor component ko render karenge */}
        </>
      )}
    </div>
  );
}

export default App;
