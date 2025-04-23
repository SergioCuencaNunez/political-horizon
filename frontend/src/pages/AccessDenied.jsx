import React from 'react';
import { Flex, Box, Button, Image, VStack, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";

import accessDeniedImage from '../assets/403.png';

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const AccessDenied = ({ buttonText = "Go Back Home", redirectPath = "/" }) => {
  const location = useLocation();
  const message = location.state?.message || "You do not have permission to view this page.";
  const textColor = useColorModeValue('black', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.300');
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);

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
        <Box px={{ base: '6', md: '10' }}>
          <Image
            src={accessDeniedImage}
            alt="404 Not Found"
            mx="auto"
            maxWidth="290px"
        />
          <VStack spacing="4" mb="6" px={{ base: '4', md: '8' }}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} color={textColor}>
              Access Denied
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={subTextColor}>
              {message}
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

export default AccessDenied;