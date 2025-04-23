import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, ChevronDownIcon, HamburgerIcon } from '@chakra-ui/icons';
import { motion } from "framer-motion";

import logoBright from '../assets/logo-bright.png';
import logoDark from '../assets/logo-dark.png';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const Navbar = () => {
    const logo = useColorModeValue(logoBright, logoDark);
    const bg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('black', 'white');
    const loginIconBg = useColorModeValue('gray.100', 'gray.700');
    const loginHoverBg = useColorModeValue('gray.200', 'gray.600');
    const loginActiveBg = useColorModeValue('gray.300', 'gray.500');
    const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
    const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
    const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
    const logoHeight = useBreakpointValue({ base: '33px', md: '38px' });
    const gradient = 'linear(to-r, #b0001a, #c6001e, #e14f64)';
  
    if (['/login', '/signup', '/profile', '/admin/profile'].some(path => location.pathname.startsWith(path))) {
        return null;
    }

    return (
      <Box
        bg={bg}
        color={textColor}
        shadow="sm"
        px={{ base: '6', md: '12' }}
        py="4"
        position="sticky"
        top="0"
        zIndex="1000"
        _after={{
          content: '""',
          display: 'block',
          height: '3px',
          backgroundImage: gradient,
          width: '100%',
          position: 'absolute',
          bottom: '0',
          left: '0',
        }}
      >
        <Flex justify="space-between" align="center" mx="auto" w="100%" px={{ base: '0', xl: '5' }}>
          {/* Logo */}
          <Link to="/">
            <motion.img
              src={logo}
              alt="FactGuard Logo"
              style={{ height: logoHeight, width: 'auto', cursor: 'pointer' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            />
          </Link>
          
          {/* Buttons, About, and Features Dropdown for larger screens */}      
          <HStack spacing="4" display={{ base: 'none', md: 'flex', lg: 'flex' }}>
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                color={textColor}
                _hover={{ color: hoverColor }}
                size="md"
                rightIcon={<ChevronDownIcon />}
              >
                Features
              </MenuButton>
            <MenuList>
                <MenuItem as={Link} to="/detect">Fake News Detection</MenuItem>
                <MenuItem as={Link} to="/verify">Verify Claims</MenuItem>
            </MenuList>
            </Menu>
            <Link to="/about">
              <Button
                bg="transparent"
                color={textColor}
                _hover={{ color: hoverColor }}
                size="md"
              >
                About
              </Button>
            </Link>
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  bg={loginIconBg}
                  color={textColor}
                  _hover={{ bg: loginHoverBg }}
                  _active={{ bg: loginActiveBg }}
                  size="md"
                >
                  Login
                </Button>
              </motion.div>
            </a>
            <a
              href="/signup"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  _active={{ bg: activeColor }}
                  size="md"
                >
                  Sign Up
                </Button>
              </motion.div>
            </a>
            <DarkModeSwitch />
          </HStack>
  
          {/* Icons for smaller screens */}
          <HStack spacing="2" display={{ base: 'flex', md: 'none', lg:'none'}}>
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
            >
            <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                    icon={<FiLogIn />}
                    aria-label="Login"
                    bg={loginIconBg}
                    _hover={{ bg: loginHoverBg }}
                    _active={{ bg: loginActiveBg }}
                    size="md"
                />
            </motion.div>
            </a>
            <a
              href="/signup"
              target="_blank"
              rel="noopener noreferrer"
            >
            <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton
                    icon={<FiUserPlus />}
                    aria-label="Sign Up"
                    bg={primaryColor}
                    color={useColorModeValue('white', 'gray.100')}
                    _hover={{ bg: hoverColor }}
                    _active={{ bg: activeColor }}
                    size="md"
                />
            </motion.div>
            </a>
  
            {/* Hamburger Menu for smaller screens */}
            <Menu>
                <motion.div whileTap={{ scale: 0.9 }}>
                    <MenuButton
                        as={IconButton}
                        icon={<HamburgerIcon />}
                        aria-label="Toggle Navigation"
                        size="md"
                    />
                </motion.div>
                <MenuList>
                    <MenuItem as={Link} to="/detect">Fake News Detection</MenuItem>
                    <MenuItem as={Link} to="/verify">Verify Claims</MenuItem>
                    <MenuItem as={Link} to="/about">About</MenuItem>
                </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>
    );
  };
  
  // Dark Mode Toggle with System Default Detection
  const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  
    // Detect system color mode on initial load
    useEffect(() => {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setColorMode(systemPreference);
    }, [setColorMode]);
  
    return (
      <IconButton
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        aria-label="Toggle Dark Mode"
        onClick={toggleColorMode}
        size="md"
        _hover={{
          bg: colorMode === "light" ? "gray.200" : "gray.600",
          transform: "scale(1.1)",
        }}
        _active={{
          bg: colorMode === "light" ? "gray.300" : "gray.500",
          transform: "scale(0.9)",
        }}
      />
    );
  };

export default Navbar;
