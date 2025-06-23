import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700"); // Optional dark mode support

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent py={3}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={5}
        bg={cardBg}
        w="100%"
        borderRadius="lg"
        boxShadow="md"
        mb={3}
      >
        <Text
          fontSize="4xl"
          fontWeight="bold"
          fontFamily="Work Sans"
          textAlign="center"
        >
          Real-Time-Chat-App
        </Text>
      </Box>

      <Box bg={cardBg} w="100%" p={6} borderRadius="lg" boxShadow="lg">
        <Tabs isFitted variant="soft-rounded" colorScheme="blue">
          <TabList mb={4}>
            <Tab fontSize="lg" fontWeight="medium">
              Login
            </Tab>
            <Tab fontSize="lg" fontWeight="medium">
              Sign Up
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
