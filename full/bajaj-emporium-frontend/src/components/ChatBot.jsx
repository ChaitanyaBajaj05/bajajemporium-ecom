// src/components/ChatBot.jsx

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/user/me/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setIsAdmin(res.data.is_staff || res.data.is_superuser);
        })
        .catch(console.error);
    }
  }, [token]);

  useEffect(() => {
    let interval;
    const fetchMessages = () => {
      if (!token) return;
      axios
        .get("http://127.0.0.1:8000/api/chat/my_chat/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setMessages(res.data);
        })
        .catch(console.error);
    };
    if (isOpen && token) {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen, token]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = {
      message: input,
      is_from_admin: isAdmin,
    };
    setInput("");
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/chat/",
        newMessage,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Send failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fashionSuggestions = [
    "Show me bridal lehengas",
    "What’s trending this wedding season?",
    "Any offers today?",
    "Suggest party wear suits",
    "I want something for haldi",
    "Do you have sherwanis for men?",
    "Where can I find designer sarees?",
    "Suggest something for reception",
    "What colors are in trend this season?",
    "Show me Indo-western styles",
  ];

  if (!token) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-rose-500 text-white p-4 rounded-full shadow-xl hover:bg-rose-600 transition"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-96 h-[560px] bg-white/90 backdrop-blur-lg border border-rose-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-400 text-white p-4 flex justify-between items-center">
            <span className="font-bold tracking-wide">
              {isAdmin ? "Admin Fashion Console 🛍️" : "Bajaj Fashion Bot ✨"}
            </span>
            <button onClick={() => setIsOpen(false)}>
              <X size={22} />
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 p-3 bg-pink-50 border-b">
            {fashionSuggestions.map((text, i) => (
              <button
                key={i}
                onClick={() => setInput(text)}
                className="text-sm bg-white border border-pink-300 text-rose-600 rounded-full px-3 py-1 hover:bg-rose-100 transition"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-pink-50">
            <div className="text-sm text-rose-400 italic">
              👗 Ask us anything about fashion, styles, collections & offers!
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`${
                    msg.is_from_admin ? "bg-rose-100 text-rose-800 ml-auto" : "bg-white text-gray-800"
                  } px-3 py-2 rounded-xl text-sm max-w-[75%] shadow`}
                >
                  <strong>{msg.is_from_admin ? "Admin" : "You"}:</strong> {msg.message}
                </div>
                {msg.response && (
                  <div className="bg-amber-50 text-rose-800 px-3 py-2 rounded-xl text-sm max-w-[75%] shadow">
                    <strong>Bajaj Bot:</strong> {msg.response}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="text-gray-500 italic text-sm animate-pulse">
                👗 Bajaj Bot is designing your response...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t bg-white flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-rose-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
              placeholder="Ask about bridalwear, offers, trends..."
            />
            <button
              onClick={handleSend}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm px-4 py-2 rounded-r-lg transition"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBot;
