import React from 'react';
import { Flex, Box, Button, Image, VStack, Heading, Text, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

import notFoundImage from '../assets/404.png';

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const NotFound = ({ buttonText = "Go Back Home", redirectPath = "/" }) => {
  const textColor = useColorModeValue('black', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);

  const description = useBreakpointValue({
    base: "This page is not available at the moment.",
    md: "This page is not available at the moment. It might be under construction or no longer exists.",
  });

  const apology = useBreakpointValue({
    base: "Apologies for any inconvenience caused.",
    md: "Apologies for any inconvenience caused, and thank you for your understanding.",
  });

  return (
    <Flex justify="center" align="center" width="100%">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        style={{
         textAlign: "center"
        }}
      >
        <Box
          px={{ base: '6', md: '10' }}
        >
          <Image
            src={notFoundImage}
            alt="404 Not Found"
            mx="auto"
            maxWidth="290px"
          />

          <VStack spacing="4" mb="6" px={{ base: '4', md: '8' }}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} color={textColor}>
              Not Found
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={subTextColor}>
              {description}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={subTextColor} mb="4">
              {apology}
            </Text>
          </VStack>

          <Link to={redirectPath}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                _active={{ bg: activeColor }}
                size="lg"
              >
                {buttonText}
              </Button>
            </motion.div>
          </Link>
        </Box>
      </motion.div>
    </Flex>
  );
};

export default NotFound;
