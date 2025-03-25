import { Box, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const BlurOverlay = ({ message }) => {
  const bgOverlay = useColorModeValue("rgba(255, 255, 255, 0.65)", "rgba(26, 32, 44, 0.6)");

  return (
    <MotionBox
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      backdropFilter="blur(10px)"
      bg={bgOverlay}
      zIndex="10"
      display="flex"
      justifyContent="center"
      alignItems="center"
      borderRadius="md"
      color={useColorModeValue("black", "white")}
      fontWeight="semibold"
      textAlign="center"
      p={4}
      fontSize={{ base: "sm", md: "md" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {message}
    </MotionBox>
  );
};

export default BlurOverlay;
