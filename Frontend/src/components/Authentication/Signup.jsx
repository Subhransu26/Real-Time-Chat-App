import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const Signup = () => {
  // State hooks for form fields
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [passwordShow, setPasswordShow] = useState(false);
  const [showConfirmPassword, setShowConfirmpassword] = useState(false);
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // Toggle password visibility
  const handleClickPassword = () => setPasswordShow(!passwordShow);
  const handleClickConfirmPassword = () =>
    setShowConfirmpassword(!showConfirmPassword);

  // Form submission
  const submitHandler = async () => {
    setPicLoading(true);

    // Basic validation
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    // Passwords must match
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    // Send data to backend
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user", // Backend endpoint
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      // On successful registration
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Store user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);

      // Navigate to chat screen
      navigate("/chats");
    } catch (error) {
      // Show error message
      toast({
        title: "Error occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  // Upload image to Cloudinary
  const postDetails = (pics) => {
    setPicLoading(true);

    if (!pics) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    // Accept only specific image types
    if (["image/jpeg", "image/png", "image/jpg"].includes(pics.type)) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app"); // Must match preset in Cloudinary
      data.append("cloud_name", "dvohrlswt"); // Cloudinary cloud name (no space)

      // Upload to Cloudinary
      fetch("https://api.cloudinary.com/v1_1/dvohrlswt/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString()); // Set uploaded image URL
          setPicLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please select a valid image (jpg/png/jpeg)",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      {/* Name Field */}
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value.trim())}
        />
      </FormControl>

      {/* Email Field */}
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value.trim())}
        />
      </FormControl>

      {/* Password Field */}
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={passwordShow ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickPassword}>
              {passwordShow ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Confirm Password Field */}
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClickConfirmPassword}>
              {showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Upload Profile Picture */}
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      {/* Signup Button */}
      <Button
        colorScheme="blue"
        width="100%"
        mt={4}
        onClick={submitHandler}
        isLoading={picLoading}
        isDisabled={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
