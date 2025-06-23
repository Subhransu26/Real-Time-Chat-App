import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Stack,
  Text,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Unable to fetch chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Theme-based colors
  const bg = useColorModeValue("white", "#1A202C");
  const chatBg = useColorModeValue("gray.50", "gray.700");
  const activeChatBg = useColorModeValue("teal.500", "teal.400");
  const hoverBg = useColorModeValue("teal.100", "teal.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryText = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={4}
      bg={bg}
      w={{ base: "100%", md: "32%" }}
      borderRadius="xl"
      boxShadow="lg"
      borderWidth="1px"
      h="100%"
    >
      {/* Header */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="semibold"
        fontFamily="heading"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color={textColor}
      >
        My Chats
        <GroupChatModal>
          <Button
            size="sm"
            colorScheme="teal"
            rightIcon={<AddIcon />}
            fontWeight="medium"
            variant="solid"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat List */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={chatBg}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#CBD5E0",
            borderRadius: "8px",
          },
        }}
      >
        {chats ? (
          <Stack spacing={2}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? activeChatBg : "transparent"}
                color={selectedChat === chat ? "white" : textColor}
                px={4}
                py={3}
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{
                  bg: selectedChat === chat ? activeChatBg : hoverBg,
                  transform: "scale(1.01)",
                }}
              >
                <Text fontWeight="medium" isTruncated>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text
                    fontSize="sm"
                    mt={1}
                    color={selectedChat === chat ? "whiteAlpha.800" : secondaryText}
                    noOfLines={1}
                  >
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 50) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
