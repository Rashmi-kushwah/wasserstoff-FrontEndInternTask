import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's snow theme
import "./quill-custom.css"; // Optional: Tailwind styling override
import  "../components/quill-custom.css"


const Editor = ({ username }) => {
  const [content, setContent] = useState("");
  const channel = useRef(null);

  useEffect(() => {
    channel.current = new BroadcastChannel("realtime-quill");

    channel.current.onmessage = (e) => {
      if (e.data.username !== username) {
        setContent(e.data.content);
      }
    };

    return () => {
      channel.current.close();
    };
  }, [username]);

  const handleChange = (value) => {
    setContent(value);
    channel.current.postMessage({ username, content: value });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
  Live Quill Editor - <span style={{ color: "#ff6347" }}>{username}</span>
</h2>

      <ReactQuill
        value={content}
        onChange={handleChange}
        theme="snow"
        className="bg-white"
      />
    </div>
  );
};

export default Editor;
