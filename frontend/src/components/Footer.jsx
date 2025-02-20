import React from 'react';
import { Box, Flex, HStack, Icon, Link, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import logoBright from '../assets/logo-bright.png';
import logoDark from '../assets/logo-dark.png';

const Footer = () => {
  const bg = useColorModeValue('gray.200', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.300');
  const hoverColor = useColorModeValue('blue.600', 'blue.400');
  const logo = useColorModeValue(logoBright, logoDark);

  return (
    <Box
      bg={bg}
      color={textColor}
      w="100%"
      px={{ base: '6', md: '12' }}
      py={{ base: '4', md: '6' }}
      mt="auto"
    >      
      <Flex
        mx="auto"
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        textAlign={{ base: 'center', md: 'left' }}
        gap="4"
        px={{ base: '0', xl: '5' }}
      >
        {/* Left Section with Logo */}
        <VStack align={{ base: 'center', md: 'flex-start' }} spacing="1">
          <img src={logo} alt="FactGuard Logo" style={{ height: '28px', width: 'auto' }} />
          <Text fontSize="md">Version 0.1</Text>
          <Text fontSize="md">© 2025 Political Horizon. All Rights Reserved</Text>
        </VStack>

        {/* Right Section with Icons */}
        <HStack spacing="4" justify="center" align="center" alignItems="center">
          <Link href="https://github.com/SergioCuencaNunez" isExternal aria-label="GitHub">
            <Icon as={SiGithub} boxSize={{base: "7", md: "8"}} color={textColor} _hover={{ color: hoverColor }} />
          </Link>
          <Link href="https://www.linkedin.com/in/sergio-cuenca-núñez-b8a391223/" isExternal aria-label="LinkedIn">
            <Icon as={SiLinkedin} boxSize={{base: "7", md: "8"}} color={textColor} _hover={{ color: hoverColor }} />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Footer;
