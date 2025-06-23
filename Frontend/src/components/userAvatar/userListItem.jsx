import { Avatar, Box, Text, Button, HStack } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <HStack
      w="100%"
      px={3}
      py={2}
      cursor="pointer"
      borderRadius="lg"
      _hover={{ background: "#f0f0f0" }}
      justifyContent="space-between"
    >
      <HStack>
        <Avatar size="sm" name={user.name} src={user.pic} />
        <Box>
          <Text fontWeight="bold">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
        </Box>
      </HStack>
      <Button size="sm" colorScheme="teal" onClick={handleFunction}>
        Add
      </Button>
    </HStack>
  );
};

export default UserListItem;
