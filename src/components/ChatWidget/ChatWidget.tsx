import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import {
  Fab,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";

type Message = {
  sender: "user" | "bot" | "confirm" | "result" | "error";
  text: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Open WebSocket when chat is opened
  useEffect(() => {
    if (!isOpen) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const ws = new WebSocket("ws://localhost:9000/ws");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to backend");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const msg: Message = { sender: data.type, text: data.text };
        setMessages((prev) => [...prev, msg]);
      } catch (err) {
        console.error("Bad message:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ Disconnected from backend");
    };

    return () => {
      ws.close();
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current) return;

    // Add user message locally
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Send JSON to backend
    wsRef.current.send(JSON.stringify({ type: "user", text: input }));
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: 4,
            background: "rgba(33, 48, 66, 0.4)",
            "&:hover": { backgroundColor: "rgba(33, 48, 66, 0.6)" },
            zIndex: 9999,
          }}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Fab>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 380,
            height: 500,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              background: "rgba(33, 48, 66, 0.4)",
              color: "white",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Chat with GATARI
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              bgcolor: "grey.50",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  bgcolor:
                    msg.sender === "user"
                      ? "rgba(33, 48, 66, 0.4)"
                      : msg.sender === "error"
                      ? "error.light"
                      : msg.sender === "result"
                      ? "success.light"
                      : "grey.200",
                  color: msg.sender === "user" ? "white" : "black",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "80%",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <TextField
              placeholder="Type a message..."
              size="small"
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton size="small" onClick={handleSend}>
              <Send size={20} />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}