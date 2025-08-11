// src/components/FloatingChatBot.jsx
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatBot from "./ChatBot";

function FloatingChatBot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 h-[500px] bg-white rounded-xl shadow-xl border overflow-hidden">
          <ChatBot />
        </div>
      )}
    </>
  );
}

export default FloatingChatBot;
