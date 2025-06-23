import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 1. Create a Context
const ChatContext = createContext();

// 2. Create Provider Component
const ChatProvider = ({ children }) => {
  // Local States
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  // 3. Check for user when component load
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
  }, [navigate]);

  return (
    // 4. Return Provider
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// 5. Custom hook to use Context
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
