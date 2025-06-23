import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          icon={<ViewIcon />}
          onClick={onOpen}
          variant="ghost"
          aria-label="View Profile"
        />
      )}

      <Modal size={{ base: "sm", md: "md", lg: "lg" }} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          py={4}
          px={6}
        >
          <ModalHeader
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            textAlign="center"
            fontFamily="heading"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              objectFit="cover"
              boxShadow="md"
            />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="body"
              color="gray.600"
            >
              <strong>Email:</strong> {user.email}
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              onClick={onClose}
              colorScheme="blue"
              borderRadius="md"
              px={6}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
