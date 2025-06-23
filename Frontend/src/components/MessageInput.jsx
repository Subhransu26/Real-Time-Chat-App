import { HStack, Input, Button } from "@chakra-ui/react";
import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message); // call parent send function
    setMessage("");  // clear input after send
  };

  return (
    <HStack spacing={2} w="100%" mt={3}>
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button
        colorScheme="blue"
        onClick={handleSend}
        isDisabled={!message.trim()}
      >
        Send
      </Button>
    </HStack>
  );
};

export default MessageInput;
