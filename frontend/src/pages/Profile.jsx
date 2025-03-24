import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  IconButton,
  Badge,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, ChevronDownIcon, CheckCircleIcon, WarningIcon, WarningTwoIcon, InfoIcon } from "@chakra-ui/icons";
import {
  FaUser,
  FaNewspaper,
  FaShieldAlt,
  FaSignOutAlt,
  FaCompass,
  FaEye,
  FaHeart,
  FaChartBar,
  FaBalanceScale,
  FaCogs,
} from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { GiCapitol, GiBigWave, GiScales } from "react-icons/gi";
import { useNavigate, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import logoBright from '../assets/logo-bright.png';
import logoDark from '../assets/logo-dark.png';

import BrowseFeed from "./BrowseFeed";
import MyInteractions from "./MyInteractions";
import BalanceReport from "./BalanceReport";
import AccountDetails from "./AccountDetails";
import NotFound from "../pages/NotFound"; 

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const sidebarLight = '#dbe2e8';
const sidebarDark = '#2a3a4a';
const gradient = "linear-gradient(to bottom, #b0001a, #c6001e, #e14f64)";

const READ_TIME_THRESHOLD = 120;

const Profile = () => {
  const navigate = useNavigate();
  // For development only
  const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState({ username: "", email: "" });
  const [openDropdown, setOpenDropdown] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const logo = useColorModeValue(logoBright, logoDark);
  const logoHeight = useBreakpointValue({ base: '33px', md: '38px' });

  const bg = useColorModeValue("gray.100", "gray.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue('black', 'white');
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
  const sidebarBgColor = useColorModeValue(sidebarLight, sidebarDark);
  const avatarBgColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const textColorAvatar = useColorModeValue('gray.500', 'gray.300');
  const dateFormat = useBreakpointValue({ base: 'small', md: 'medium', lg: 'full', xl: 'full' });

  const [sortOrder, setSortOrder] = useState("desc");

  const hasFetched = useRef(false);
  const [userStatus, setUserStatus] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      checkUserStatus();
    }
  }, []);

  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/user/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setUserStatus(data.status);
    } catch (error) {
      setErrorMessage(`Error checking user status: ${error}`);
    }
  };

  const getCurrentDate = (dateFormat) => {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayName = dayNames[now.getDay()];
    const monthName = monthNames[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();

    const dateSuffix =
      date % 10 === 1 && date !== 11
        ? "st"
        : date % 10 === 2 && date !== 12
        ? "nd"
        : date % 10 === 3 && date !== 13
        ? "rd"
        : "th";

    if (dateFormat == 'small') {
      const day = String(date).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const shortYear = String(year).slice(-2);
      return `${day}/${month}/${shortYear}`;
    }

    if (dateFormat == 'medium') {
      const shortDayName = dayName.slice(0, 3);
      return `${shortDayName}, ${monthName} ${date}${dateSuffix}, ${year}`;
    }

    return `${dayName}, ${monthName} ${date}${dateSuffix}, ${year}`;
  };

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
  };

  const fetchUserData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/profile`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setUser({ username: data.username, email: data.email });
        } else {
          console.error("Failed to fetch user data:", data.error);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    const fetchInteractions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/user/interactions`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setInteractions(data);
        } else {
          console.error("Failed to fetch interactions:", data.error);
        }
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    fetchInteractions();
  }, [navigate]);
  
  // Delete a interaction from server
  const deleteInteraction = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/user/interactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setInteractions((prev) => prev.filter((interaction) => interaction.id !== id));
      } else {
        console.error("Failed to delete interaction.");
      }
    } catch (error) {
      console.error("Error deleting interaction:", error);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedInteractions = [...interactions].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.interaction_timestamp) - new Date(a.interaction_timestamp)
      : new Date(a.interaction_timestamp) - new Date(b.interaction_timestamp)
  );

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };
  
  const {
    isOpen: isInteractionModalOpen,
    onOpen: onInteractionModalOpen,
    onClose: onInteractionModalClose,
  } = useDisclosure();
  const [interactionToDelete, setInteractionToDelete] = useState(null);

  const handleDeleteInteraction = (interaction) => {
    setInteractionToDelete(interaction);
    onInteractionModalOpen();
  };

  const [selectedInteractions, setSelectedInteractions] = useState([]);

  const confirmDeleteInteraction= async () => {
    try {
      if (interactionToDelete) {
        // Delete a single interaction
        await deleteInteraction(interactionToDelete.id);
      } else {
        // Delete selected interactions
        for (const interaction of selectedInteractions) {
          await deleteInteraction(interaction.id);
        }
        setSelectedInteractions([]);
      }
      onInteractionModalClose();
    } catch (error) {
      console.error("Error deleting interaction(s):", error);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/user/balance-report`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);
  
  const getPoliticalIcon = (leaning) => {
    const iconSize = 15;
    switch (leaning) {
      case "RIGHT":
        return <GiCapitol size={iconSize} />;
      case "LEFT":
        return <GiBigWave size={iconSize} />;
      case "CENTER":
        return <GiScales size={iconSize} />;
      default:
        return null;
    }
  };
  
  return (
    <Flex direction={{ base: "column", md: "row" }} bg={bg}>
      {/* Sidebar */}
      <Box
        w={{ base: "full", md: "300px" }}
        bg={sidebarBgColor}
        px={{ base: "4", md: "6" }}
        py={{ base: "6", md: "8" }}      
        shadow="lg"
        position={{ base: "relative", md: "sticky" }}
        top="0"
        h={{ base: "auto", md: "100vh" }}
        overflowY="auto"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        borderRightWidth="3px"
        borderRightStyle="solid"
        borderRightColor="transparent"
        style={{
          borderImage: gradient,
          borderImageSlice: 1,
          borderRight: useBreakpointValue({ base: "none", md: "solid" }),
          borderBottom: useBreakpointValue({ base: "solid", md: "none" }),
        }}      
      >
        <VStack spacing={{base: "4", md: "8"}} align="flex-start">
          <HStack justifyContent={{ base: "center", md: "flex-start" }} w="100%">
            <motion.img
              src={logo}
              alt="Political Horizon Logo"
              style={{ height: logoHeight, width: 'auto'}}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            />
          </HStack>

          {/* User Info and Logout Button (Mobile only) */}
          <HStack
            display={{ base: "flex", md: "none" }}
            justifyContent="space-between"
            w="100%"
          >
            <HStack>
              <Avatar name={user.username} size="lg" bg={avatarBgColor} color="white"/>
              <Box>
                <Text fontWeight="bold" isTruncated>{user.username}</Text>
                <Text fontSize="sm" color={textColorAvatar} isTruncated>
                  {user.email}
                </Text>
              </Box>
            </HStack>
            <Button
              colorScheme="blue"
              variant="solid"
              onClick={handleLogout}
              size="sm"
            >
              <FaSignOutAlt />
            </Button>
          </HStack>

          {/* User Info (Desktop only) */}
          <HStack display={{ base: "none", md: "flex" }}>
            <Avatar name={user.username} size="lg" bg={avatarBgColor} color="white" />
            <Box>
              <Text fontWeight="bold" isTruncated>{user.username}</Text>
              <Text fontSize="13px" color={textColorAvatar} isTruncated>
                {user.email}
              </Text>
            </Box>
          </HStack>

          {/* Sidebar Buttons */}
          <VStack spacing="4" align="stretch" w="100%">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                justifyContent="space-between"
                _hover={{ color: hoverColor }}
                _active={{ color: activeColor }}
                size={{ base: "sm", md: "md" }}
                color={textColor}
                width="100%"
                onClick={() => navigate("/profile")}
              >
                <HStack w="100%" justifyContent="space-between">
                  <HStack>
                    <FaChartBar />
                    <Text>Dashboard</Text>
                  </HStack>
                </HStack>
              </Button>
            </motion.div>
            
            {/* Explore News Dropdown */}
            <Box>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  justifyContent="space-between"
                  _hover={{ color: hoverColor }}
                  _active={{ color: activeColor }}
                  size={{ base: "sm", md: "md" }}
                  onClick={() => toggleDropdown("detect")}
                  color={textColor}
                  width="100%"
                >
                  <HStack w="100%" justifyContent="space-between">
                    <HStack>
                      <FaNewspaper />
                      <Text>Explore News</Text>
                    </HStack>
                    <ChevronDownIcon />
                  </HStack>
                </Button> 
              </motion.div>
              <AnimatePresence initial={false}>             
                {openDropdown === "detect" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                  <VStack align="stretch" pl="4" mt="2">
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ color: hoverColor }}
                      _active={{ color: activeColor }}
                      color={textColor}
                      width="100%"
                      onClick={() => navigate("/profile/browse-feed")}
                    >
                      <HStack>
                        <FaCompass />
                        <Text>Browse Your News</Text>
                      </HStack>
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ color: hoverColor }}
                      _active={{ color: activeColor }}
                      color={textColor}
                      width="100%"
                      onClick={() => navigate("/profile/my-interactions")}
                    >
                      <HStack>
                        <FaHeart />
                        <Text>My Interactions</Text>
                      </HStack>
                    </Button>
                  </VStack>
                </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Bias Insights Dropdown */}
            <Box>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  justifyContent="space-between"
                  _hover={{ color: hoverColor }}
                  _active={{ color: activeColor }}
                  size={{ base: "sm", md: "md" }}
                  onClick={() => toggleDropdown("verify")}
                  color={textColor}
                  width="100%"
                >
                  <HStack w="100%" justifyContent="space-between">
                    <HStack>
                      <FaEye />
                      <Text>Bias Insights</Text>
                    </HStack>
                    <ChevronDownIcon />
                  </HStack>
                </Button>
              </motion.div>
              <AnimatePresence initial={false}>
                {openDropdown === "verify" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                  <VStack align="stretch" pl="4" mt="2">
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ color: hoverColor }}
                      _active={{ color: activeColor }}
                      color={textColor}
                      width="100%"
                      onClick={() => navigate("/profile/balance-report")}
                    >
                      <HStack>
                        <FaBalanceScale />
                        <Text>Balance Report</Text>
                      </HStack>
                    </Button>
                  </VStack>
                </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Settings Dropdown */}
            <Box>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  justifyContent="space-between"
                  _hover={{ color: hoverColor }}
                  _active={{ color: activeColor }}
                  size={{ base: "sm", md: "md" }}
                  onClick={() => toggleDropdown("settings")}
                  color={textColor}
                  width="100%"
                >
                  <HStack w="100%" justifyContent="space-between">
                    <HStack>
                      <FaCogs />
                      <Text>Settings</Text>
                    </HStack>
                    <ChevronDownIcon />
                  </HStack>
                </Button>
              </motion.div>
              <AnimatePresence initial={false}>
                {openDropdown === "settings" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <VStack align="stretch" pl="4" mt="2">
                      <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        size="sm"
                        _hover={{ color: hoverColor }}
                        _active={{ color: activeColor }}
                        color={textColor}
                        width="100%"
                        onClick={() => navigate("/profile/account-details")}
                      >
                        <HStack>
                          <FaUser />
                          <Text>Account Details</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </VStack>
        </VStack>
        
        {/* Logout Button (Desktop only) */}
        <HStack display={{ base: 'none', md: 'flex' }}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: '100%' }}>
            <Button
              leftIcon={<FaSignOutAlt />}
              colorScheme="blue"
              variant="solid"
              onClick={handleLogout}
              size={{ base: "sm", md: "md" }}
              width="100%"
            >
              Logout
            </Button>
          </motion.div>
        </HStack>
      </Box>
      
      {/* Main Content */}
      <Box 
        flex="1"
        px={{base: 8, md: 8}}
        py={{base: 10, md: 8}}
        overflowY="auto">
        <Routes>
          <Route
            path="/"
            element={
              <Flex direction="column">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    bg={cardBg} 
                    p="5" 
                    borderRadius="md"
                    shadow="md"
                    mb="4"
                  >
                    <Flex justify="space-between" align="center">
                      <Heading mb="4" fontSize={{ base: '3xl', md: '4xl' }}>Welcome, {user.username}</Heading>
                      <HStack spacing="4" display={{ base: "none", lg: "flex" }}>
                        <Text fontSize="sm" letterSpacing="wide" color={textColor}>{getCurrentDate(dateFormat)}</Text>
                        <IconButton
                          aria-label="Toggle theme"
                          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                          onClick={toggleColorMode}
                          _hover={{
                            bg: colorMode === "light" ? "gray.200" : "gray.600",
                            transform: "scale(1.1)",
                          }}
                          _active={{
                            bg: colorMode === "light" ? "gray.300" : "gray.500",
                            transform: "scale(0.9)",
                          }}
                        />
                      </HStack>
                      <HStack spacing="4" display={{ base: "flex", md: "flex", lg: "none" }}>
                        <Text fontSize="sm" letterSpacing="wide" textAlign="right" color={textColor}>{getCurrentDate(dateFormat)}</Text>
                      </HStack>
                    </Flex>
                    <Box borderBottom="1px" borderColor="gray.300"></Box>
                  </Box>
                </motion.div>

                {/* Key Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Heading size="lg" mb="4">Key Features</Heading>
                  <Flex wrap="wrap" justify="space-between" gap="6">
                    {[
                      {
                        icon: <FaCompass size="50px" color={primaryColor} style={{ margin: "auto" }} />,
                        title: "Explore News",
                        text: {
                          base: "Discover diverse news articles.",
                          md: "Discover diverse news articles.",
                          lg: "Discover diverse news articles tailored to your reading preferences while avoiding ideological bubbles.",
                        },          
                      },
                      {
                        icon: <FaBalanceScale size="50px" color={primaryColor} style={{ margin: "auto" }} />,
                        title: "Bias Insights",
                        text: {
                          base: "Analyze your news consumption bias.",
                          md: "Analyze your news consumption bias.",
                          lg: "Analyze and visualize your political news consumption bias and diversity trends over time.",
                        },          
                      },
                      {
                        icon: <FaNewspaper size="50px" color={primaryColor} style={{ margin: "auto" }} />,
                        title: "Personalized Recommendations",
                        text: {
                          base: "Receive curated news, with controlled exposure.",
                          md: "Receive curated news, with controlled exposure.",
                          lg: "Receive curated news based on your interests, with controlled exposure to diverse viewpoints.",
                        },
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ flex: "1 1 calc(33.333% - 1rem)", minWidth: "250px" }}
                      >
                        <Box
                          bg={cardBg}
                          p="5"
                          borderRadius="md"
                          textAlign="center"
                          shadow="md"
                          height="100%"
                          _hover={{
                            bg: useColorModeValue("gray.50", "gray.600"),
                          }}
                        >
                          {item.icon}
                          <Heading size="md" mt="4">{item.title}</Heading>
                          <Text mt="2">{useBreakpointValue(item.text)}</Text>
                        </Box>
                      </motion.div>
                    ))}
                  </Flex>
                </motion.div>

                {/* Graphs Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Heading fontSize={{ base: '2xl', md: '3xl' }} my="6">Trends & Statistics</Heading>
                  <Flex wrap="wrap" gap="6" align="flex-start">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ flex: "1 1 calc(33.333% - 1rem)", minWidth: "250px" }}
                    >
                      <Box 
                        bg={cardBg} 
                        p="5" 
                        borderRadius="md"
                        height="100%"
                        flex="1"
                        shadow="md"
                        display="flex" 
                        flexDirection="column" 
                        justifyContent="flex-start" 
                        alignItems="center" 
                        textAlign="center"
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.600"),
                        }}                
                      >
                        <Heading size="md" mb="4">Bias & Diversity Metrics</Heading>
                      </Box>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ flex: "1 1 calc(33.333% - 1rem)", minWidth: "250px" }}
                    >
                      <Box 
                        bg={cardBg} 
                        p="5" 
                        borderRadius="md"
                        height="100%"
                        flex="1"
                        shadow="md"
                        display="flex" 
                        flexDirection="column" 
                        justifyContent="flex-start" 
                        alignItems="center" 
                        textAlign="center"
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.600"),
                        }}                
                      >
                        <Heading size="md" mb="4">User Engagement Overview</Heading>
                      </Box>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ flex: "1 1 calc(33.333% - 1rem)", minWidth: "250px" }}
                    >
                      <Box 
                        bg={cardBg} 
                        p="5" 
                        borderRadius="md"
                        height="100%"
                        flex="1"
                        shadow="md"
                        display="flex" 
                        flexDirection="column" 
                        justifyContent="flex-start" 
                        alignItems="center" 
                        textAlign="center"
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.600"),
                        }}               
                      >
                        <Heading size="md" mb="4">Recommendation Effectiveness</Heading>
                      </Box>
                    </motion.div>
                  </Flex>
                </motion.div>

                {/* Recent Interactions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Heading fontSize={{ base: '2xl', md: '3xl' }} my="6">Recent Interactions</Heading>
                    <Box bg={cardBg} p="5" borderRadius="md" overflowX="auto" shadow="md">
                      {interactions.some((i) => i.interaction_type === "like" || (i.interaction_type === "read" && i.read_time_seconds >= READ_TIME_THRESHOLD)) ? (
                        <>
                          <Box overflowX="auto">
                            <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                              <Thead>
                                <Tr>
                                  <Th width="10%" textAlign="center">
                                    <Flex align="center" justify="center">
                                      <b>Date</b>
                                      <IconButton
                                        aria-label="Toggle Sort Order"
                                        icon={sortOrder === "desc" ? <ChevronDownIcon /> : <ChevronUpIcon />}
                                        size="xs"
                                        variant="ghost"
                                        onClick={toggleSortOrder}
                                        ml="1"
                                      />
                                    </Flex>
                                  </Th>
                                  <Th width="40%" textAlign="center">Interacted Article</Th>
                                  <Th width="40%" textAlign="center">Suggested News</Th>
                                  <Th width="10%" textAlign="center">Remove</Th>
                                </Tr>
                              </Thead>
                              <Tbody as={motion.tbody}>
                                <AnimatePresence>
                                  {sortedInteractions
                                    .filter((interaction) => interaction.interaction_type === "like" || (interaction.interaction_type === "read" && interaction.read_time_seconds >= READ_TIME_THRESHOLD))
                                    .slice(0, 2)
                                    .map((interaction) => (
                                      <motion.tr
                                        key={interaction.id}
                                        layout
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ duration: 0.5 }}
                                      >
                                        <Td textAlign="center">{formatDate(interaction.interaction_timestamp)}</Td>
                                        {/* Interacted Article */}
                                        <Td textAlign="justify">
                                          <Box mb={2}>
                                            <Text fontWeight="semibold">
                                              <a 
                                                href={interaction.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ 
                                                  color: "inherit", 
                                                  textDecoration: "none", 
                                                  transition: "text-decoration 0.2s ease-in-out"
                                                }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                                                onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                                              >
                                                {interaction.headline || "Unknown Article"}
                                              </a>
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">{interaction.outlet || "Unknown Outlet"}</Text>
                                          </Box>
                                        </Td>
                                        {/* Suggested News */}
                                        <Td textAlign="justify">
                                          {interaction.recommendations.length > 0 ? (
                                            interaction.recommendations.map((rec, index) => (
                                              <Box key={index} mb={2}>
                                                <Text fontWeight="semibold">
                                                  <a 
                                                    href={rec.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    style={{ 
                                                      color: "inherit", 
                                                      textDecoration: "none", 
                                                      transition: "text-decoration 0.2s ease-in-out"
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                                                    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                                                  >
                                                    {rec.headline}
                                                  </a>
                                                </Text>
                                                <Text fontSize="sm" color="gray.500">{rec.outlet}</Text>
                                              </Box>
                                            ))
                                          ) : (
                                            <Text color="gray.400">No suggested news</Text>
                                          )}
                                        </Td>
                                        <Td textAlign="center">
                                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <IconButton
                                              icon={<FaTrashCan />}
                                              color={primaryColor}
                                              onClick={() => handleDeleteInteraction(interaction)}
                                            />
                                          </motion.div>
                                        </Td>
                                      </motion.tr>
                                    ))}
                                </AnimatePresence>
                              </Tbody>
                            </Table>
                          </Box>
                        </>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Flex align="center" justify="center" direction="column" h={{ base: "auto", md: "15vh" }}>
                            <WarningIcon boxSize="6" color="gray.500" mb="2" />
                            <Text fontSize="lg" color="gray.500" textAlign="center">
                              No suggested news found.
                            </Text>
                            <Text fontSize="md" color="gray.400" textAlign="center">
                              Engage with articles by liking them or spending more time reading. Horizon Explore will then provide personalized recommendations, while maintaining a balanced and diverse perspective.
                            </Text>
                          </Flex>
                        </motion.div>
                      )}
                    </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {userStatus === "new" ? (
                    <Flex align="center" justify="center" direction="column" h={{ base: "auto", md: "20vh" }}>
                      <LockIcon boxSize="6" color="gray.500" mb="2" />
                      <Text fontSize="lg" color="gray.500" textAlign="center">
                        Like or read a few articles to unlock this feature.
                      </Text>
                      <Text fontSize="md" color="gray.400" textAlign="center" mb="2">
                        To access your Balance Report, please interact with a few articles in Horizon Explore. Once interactions are recorded, your personalized report will be generated automatically and available here.
                      </Text>
                    </Flex>
                  ) : report ? (
                    <>
                      <Heading fontSize={{ base: '2xl', md: '3xl' }} my="6">Bias Insights History</Heading>
                      <Box bg={cardBg} p="5" borderRadius="md" overflowX="auto" shadow="md">
                        <Text fontWeight="bold" fontSize="xl" mb="2">Political Exposure</Text>    
                        <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing={4} mb="6">
                          {["LEFT", "CENTER", "RIGHT"].map((leaning) => (
                            <Badge
                              key={leaning}
                              colorScheme={leaning === "RIGHT" ? "red" : leaning === "LEFT" ? "blue" : "yellow"}
                              p={2}
                              display="flex"
                              alignItems="center"
                              gap="2"
                              justifyContent="center"
                              width="full"
                          >
                            {getPoliticalIcon(leaning)}
                              <Text fontSize="sm" fontWeight="bold">
                                {leaning}: {((report.interactions[leaning] / Object.values(report.interactions).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                              </Text>
                            </Badge>
                          ))}
                        </SimpleGrid>
                        <Box overflowX="auto">
                          <Text fontWeight="bold" fontSize="xl" mb="2">Reading Engagement</Text>
                          <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                            <Thead>
                              <Tr>
                                <Th width="20%" textAlign="center">Leaning</Th>
                                <Th width="20%" textAlign="center">Avg Read Time (s)</Th>
                                <Th width="20%" textAlign="center">Fully Read (%)</Th>
                                <Th width="20%" textAlign="center">Quick Reads (%)</Th>
                                <Th width="20%" textAlign="center">Engagement Score</Th>
                              </Tr>
                            </Thead>
                            <Tbody as={motion.tbody}>
                              <AnimatePresence>
                                {["LEFT", "CENTER", "RIGHT"].map((leaning) => (
                                  <motion.tr
                                    key={leaning}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Td fontWeight="semibold" textAlign="left">{leaning}</Td>
                                    <Td textAlign="center">{report.avg_read_time[leaning]} sec</Td>
                                    <Td textAlign="center">{report.engagement_metrics.fully_read[leaning]}%</Td>
                                    <Td textAlign="center">{report.engagement_metrics.quick_reads[leaning]}%</Td>
                                    <Td textAlign="center">{report.engagement_metrics.engagement_score[leaning]}</Td>
                                  </motion.tr>
                                ))}
                              </AnimatePresence>
                            </Tbody>
                          </Table>
                          
                        </Box>
                      </Box>
                   </>
                   ) : (
                    <Text fontSize="md" color="gray.400" textAlign="center">Error loading report data.</Text>
                  )} 
                </motion.div>
              </Flex>
            }
          />
          <Route
            path="/browse-feed"
            element={<BrowseFeed/>}
            />
          <Route
            path="/my-interactions"
            element={
              <MyInteractions
                interactions={interactions}
                deleteInteraction={deleteInteraction}
              />
            }
          />
          <Route
            path="/balance-report"
            element={<BalanceReport/>}
            />
          <Route path="/account-details" element={<AccountDetails />} />
          <Route
            path="*"
            element={
              <Flex flex="1" justify="center" align="center" flexDirection="column" height="100%">
                <NotFound buttonText="Go Back to Dashboard" redirectPath="/profile" />
              </Flex>
            }
          />
        </Routes>

        {/* Interactions Confirmation Modal */}
        <Modal isOpen={isInteractionModalOpen} onClose={onInteractionModalClose} isCentered>
          <ModalOverlay />
            <ModalContent
              width={{ base: "90%"}}
            >
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {interactionToDelete
                ? "Are you sure you want to delete this interaction?"
                : "Are you sure you want to delete the selected interactions?"}
            </ModalBody>
            <ModalFooter>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button colorScheme="blue" mr={3} onClick={confirmDeleteInteraction}>
                  Delete
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button onClick={onInteractionModalClose}>
                  Cancel
                </Button>
              </motion.div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default Profile;