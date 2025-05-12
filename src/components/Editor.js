import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill"; // ReactQuill editor ko import kiya hai
import "react-quill/dist/quill.snow.css"; // ReactQuill ka CSS import kiya hai
import "./quill-custom.css"; // Optional: Tailwind styling override ke liye custom CSS import kiya hai
import  "../components/quill-custom.css" // Quill custom CSS ko import kiya gaya

const Editor = ({ username }) => {
  const [content, setContent] = useState(""); // Editor content ko manage karna
  const channel = useRef(null); // BroadcastChannel ka reference

  useEffect(() => {
    // BroadcastChannel ko initialize kar rahe hain
    channel.current = new BroadcastChannel("realtime-quill");

    channel.current.onmessage = (e) => {
      if (e.data.username !== username) {
        // Agar message current user ke alawa kisi aur ka ho to content update karna
        setContent(e.data.content);
      }
    };

    // Cleanup function jab component unmount ho
    return () => {
      channel.current.close();
    };
  }, [username]); // Jab username change ho, effect dobara run hoga

  const handleChange = (value) => {
    // Jab editor ka content change ho to message bhejna
    setContent(value);
    channel.current.postMessage({ username, content: value });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Live Quill Editor - <span style={{ color: "#ff6347" }}>{username}</span> {/* Editor ka title */}
      </h2>

      <ReactQuill
        value={content} // Editor ka content
        onChange={handleChange} // Editor ke content me change hote hi function call hoga
        theme="snow" // ReactQuill ka theme "snow" use kar rahe hain
        className="bg-white"
      />
    </div>
  );
};

export default Editor;
