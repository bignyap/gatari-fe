import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import {
  Fab,
  Paper,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

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
              bgcolor: "primary.main",
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
            }}
          >
            <Box
              sx={{
                alignSelf: "flex-start",
                bgcolor: "grey.200",
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">Hi 👋 How can I help?</Typography>
            </Box>
            {/* Future messages go here */}
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
            />
            <Button variant="contained">Send</Button>
          </Box>
        </Paper>
      )}
    </>
  );
}
