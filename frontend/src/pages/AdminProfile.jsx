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
import { SunIcon, MoonIcon, ChevronDownIcon, WarningIcon } from "@chakra-ui/icons";
import {
  FaUsers,
  FaTasks,
  FaUser,
  FaNewspaper,
  FaSignOutAlt,
  FaHeart,
  FaEye,
  FaChartBar,
  FaBalanceScale,
  FaCogs,
  FaTrashAlt,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

import { FaTrashCan } from "react-icons/fa6";
import { useNavigate, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import logoBright from '../assets/logo-bright.png';
import logoDark from '../assets/logo-dark.png';

import BlurOverlay from "../components/BlurOverlay";

import MyUsers from "./MyUsers";
import MyInteractions from "./MyInteractions";
import MyBalanceReports from "./MyBalanceReports";
import BalanceReport from "./BalanceReport";
import AccountDetails from "./AccountDetails";
import NotFound from "../pages/NotFound"; 

import RecommendationsLineChart from "../graphs/RecommendationsLineChart";
import DailyInteractionBreakdown from "../graphs/DailyInteractionBreakdown";

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

const AdminProfile = () => {
  const navigate = useNavigate();
  // For development only
  const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [overview, setOverview] = useState({
    totalUsers: 0,
    totalInteractions: 0,
    totalRecommendations: 0,
    recentUsers: [],
    recentInteractions: [],
    recentRecommendations: [],
  });

  const [users, setUsers] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true);
  const [balanceReports, setBalanceReports] = useState([]);

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

  const hasFetched = useRef(false);
  const [userStatus, setUserStatus] = useState(null);
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      checkUserStatus();
    }
  }, []);

  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/status`, {
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

// Fetch admin data
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const fetchAdminData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setOverview(data);
        setUser({ username: data.username, email: data.email });
      } else if (res.status === 403) {
        navigate("/access-denied", {
          state: {
            message: data.error || "Not authorized to access admin panel",
          },
        });
      } else {
        console.error("Failed to fetch admin data:", data.error);
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      navigate("/login");
    }
  };

  fetchAdminData();
}, [navigate]);

  const {
    isOpen: isLogoutModalOpen,
    onOpen: onLogoutModalOpen,
    onClose: onLogoutModalClose,
  } = useDisclosure();
  
  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = (section) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/users`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Failed to fetch users:", data.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Delete a user from server
  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((d) => d.id !== id));
      } else {
        console.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const {
    isOpen: isUserModalOpen,
    onOpen: onUserModalOpen,
    onClose: onUserModalClose,
  } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    onUserModalOpen();
  };

  const confirmDeleteUser = async () => {
    try {
      if (userToDelete) {
        // Delete a single detection
        await deleteUser(userToDelete.id);
      }
      onUserModalClose();
    } catch (error) {
      console.error("Error deleting detection(s):", error);
    }
  };
  
  useEffect(() => {
    const fetchInteractions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/interactions`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setInteractions(data);
        } else {
          console.error("Failed to fetch interactions:", data.error);
        }
        setIsLoadingInteractions(false); 
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    fetchInteractions();
  }, [navigate]);

  useEffect(() => {
    const hasValidInteraction = interactions.some(
      (i) =>
        i.interaction_type === "like" ||
        (i.interaction_type === "read" && i.read_time_seconds >= READ_TIME_THRESHOLD)
    );
  
    if (!hasValidInteraction && userStatus !== "new") {
      setUserStatus("new");
    } else if (hasValidInteraction && userStatus === "new") {
      setUserStatus("returning");
    }
  }, [interactions, userStatus]);
  
  // Delete a interaction from server
  const deleteInteraction = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/interactions/${id}`, {
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

  useEffect(() => {
    const fetchBalanceReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/admin/balance-summary`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setBalanceReports(data);
        } else {
          console.error("Failed to fetch interactions:", data.error);
        }
        setIsLoadingInteractions(false); 
      } catch (error) {
        console.error("Error fetching interactions:", error);
      }
    };

    fetchBalanceReports();
  }, [navigate]);

  // Delete all user interactions for balance report
  const deleteBalanceReport = async (userId) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`${BACKEND_URL}/admin/balance-report/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setBalanceReports((prev) => prev.filter((r) => r.user_id !== userId));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete balance report:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting balance report:", error);
    }
  };
  
  const formatDate = (isoString) => {
    if (!isoString) return "No Available Date";

    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const [hasTwoDays, setHasTwoDays] = useState(false);

  useEffect(() => {
    if (!interactions || interactions.length === 0) {
      setHasTwoDays(false);
      return;
    }
  
    const uniqueDates = [
      ...new Set(
        interactions
          .filter(
            (i) =>
              i.interaction_type === "like" ||
              (i.interaction_type === "read" && i.read_time_seconds >= READ_TIME_THRESHOLD)
          )
          .map((i) => i.interaction_timestamp?.split(" ")[0]) // or split("T")[0] if ISO
          .filter(Boolean)
      ),
    ];

    setHasTwoDays(uniqueDates.length >= 2);
  }, [interactions]);
      
  return (
    <>
      <Helmet>
        <title>Political Horizon - Admin Profile</title>
      </Helmet>
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
                onClick={onLogoutModalOpen}
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
                  onClick={() => navigate("/admin/profile")}
                >
                  <HStack w="100%" justifyContent="space-between">
                    <HStack>
                      <FaChartBar />
                      <Text>Dashboard</Text>
                    </HStack>
                  </HStack>
                </Button>
              </motion.div>
              

              {/* All Users Dropdown */}
              <Box>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    justifyContent="space-between"
                    _hover={{ color: hoverColor }}
                    _active={{ color: activeColor }}
                    size={{ base: "sm", md: "md" }}
                    onClick={() => toggleDropdown("users")}
                    color={textColor}
                    width="100%"
                  >
                    <HStack w="100%" justifyContent="space-between">
                      <HStack>
                        <FaUsers />
                        <Text>Users Registered</Text>
                      </HStack>
                      <ChevronDownIcon />
                    </HStack>
                  </Button>
                </motion.div>
                <AnimatePresence initial={false}>
                  {openDropdown === "users" && (
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
                        onClick={() => navigate("/admin/profile/my-users")}
                      >
                        <HStack>
                          <FaTasks />
                          <Text>All Users</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  </motion.div>
                  )}
                </AnimatePresence>
              </Box>
              
              {/* All Interactions Dropdown */}
              <Box>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    justifyContent="space-between"
                    _hover={{ color: hoverColor }}
                    _active={{ color: activeColor }}
                    size={{ base: "sm", md: "md" }}
                    onClick={() => toggleDropdown("explore")}
                    color={textColor}
                    width="100%"
                  >
                    <HStack w="100%" justifyContent="space-between">
                      <HStack>
                        <FaNewspaper />
                        <Text>Horizon Explore</Text>
                      </HStack>
                      <ChevronDownIcon />
                    </HStack>
                  </Button> 
                </motion.div>
                <AnimatePresence initial={false}>             
                  {openDropdown === "explore" && (
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
                        onClick={() => navigate("/admin/profile/my-interactions")}
                      >
                        <HStack>
                          <FaTasks />
                          <Text>All Interactions</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              {/* All Balance Reports Dropdown */}
              <Box>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    justifyContent="space-between"
                    _hover={{ color: hoverColor }}
                    _active={{ color: activeColor }}
                    size={{ base: "sm", md: "md" }}
                    onClick={() => toggleDropdown("bias")}
                    color={textColor}
                    width="100%"
                  >
                    <HStack w="100%" justifyContent="space-between">
                      <HStack>
                        <FaEye />
                        <Text>Horizon Balance</Text>
                      </HStack>
                      <ChevronDownIcon />
                    </HStack>
                  </Button>
                </motion.div>
                <AnimatePresence initial={false}>
                  {openDropdown === "bias" && (
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
                        onClick={() => navigate("/admin/profile/my-balance-reports")}
                      >
                        <HStack>
                          <FaTasks />
                          <Text>All Balance Reports</Text>
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
                          onClick={() => navigate("/admin/profile/account-details")}
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
                onClick={onLogoutModalOpen}
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

                  {/* Admin Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Heading size="lg" mb="4">Admin Overview</Heading>
                    <Flex wrap="wrap" justify="space-between" gap="6">
                      {[
                        {
                          icon: <FaHeart size="50px" color={primaryColor} style={{ margin: "auto" }} />,
                          title: "Total Interactions",
                          value: overview?.totalInteractions ?? "-",
                        },
                        {
                          icon: <FaBalanceScale size="50px" color={primaryColor} style={{ margin: "auto" }} />,
                          title: "Total Recommendations",
                          value: overview?.totalRecommendations ?? "-",
                        },
                        {
                          icon: <FaUsers size="50px" color={primaryColor} style={{ margin: "auto" }} />,
                          title: "Total Users",
                          value: overview?.totalUsers ?? "-",
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
                            <Text fontSize="3xl" fontWeight="bold" mt="2" color={textColor}>
                              {item.value}
                            </Text>
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
                          position="relative"  
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
                          <Heading size="md" mb="4">Recommendations Over Time</Heading>
                          <RecommendationsLineChart interactions={interactions} />
                          {!isLoadingInteractions && (interactions.length === 0 || !hasTwoDays) && (
                            <BlurOverlay message="At least two different days of data are required to visualize trends." />
                          )}
                        </Box>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ flex: "1 1 calc(33.333% - 1rem)", minWidth: "250px" }}
                      >
                        <Box 
                          position="relative" 
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
                          <Heading size="md" mb="4">Daily Interaction Breakdown</Heading>
                          <DailyInteractionBreakdown interactions={interactions} />
                          {userStatus === "new" && (
                            <BlurOverlay message="Interact with a few articles to unlock this section." />
                          )}
                        </Box>
                      </motion.div>
                    </Flex>
                  </motion.div>

                  {/* Recent Content Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} my="6">Recent Users</Heading>
                      <Box bg={cardBg} p="5" borderRadius="md" overflowX="auto" shadow="md">
                      {users.length > 0 ? (
                          <>
                            <Box overflowX="auto">
                              <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                                <Thead>
                                  <Tr>
                                    <Th width="15%" textAlign="center"><b>ID</b></Th>
                                    <Th width="30%" textAlign="center"><b>Username</b></Th>
                                    <Th width="30%" textAlign="center"><b>Email</b></Th>
                                    <Th width="20%" textAlign="center"><b>Last Interaction Time</b></Th>
                                    <Th width="5%" textAlign="center"><b>Remove</b></Th>
                                  </Tr>
                                </Thead>
                                <Tbody as={motion.tbody}>
                                  <AnimatePresence>
                                    {users.slice(0, 5).map((user) => (
                                      <motion.tr
                                        key={user.id}
                                        layout
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ duration: 0.5 }}
                                      >
                                        <Td textAlign="center">{user.id}</Td>
                                        <Td textAlign="center">{user.username}</Td>
                                        <Td textAlign="center">{user.email}</Td> 
                                        <Td textAlign="center">{formatDate(user.last_recommendation_timestamp)}</Td>
                                        <Td textAlign="center">
                                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Button size="sm" color={primaryColor} onClick={() => handleDeleteUser(user)}>
                                              <FaTrashAlt />
                                            </Button>
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
                            <Flex align="center" justify="center" direction="column" h="15vh">
                              <WarningIcon boxSize="6" color="gray.500" mb="2" />
                              <Text fontSize="lg" color="gray.500" textAlign="center">
                                No users have registered.
                              </Text>
                            </Flex>
                          </motion.div>
                        )}
                      </Box>
                  </motion.div>

                  {/* Recent Suggested News Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} my="6">Recent Suggested News</Heading>
                      <Box bg={cardBg} p="5" borderRadius="md" overflowX="auto" shadow="md">
                        {interactions.some((i) => i.interaction_type === "like" || (i.interaction_type === "read" && i.read_time_seconds >= READ_TIME_THRESHOLD)) ? (
                          <>
                            <Box overflowX="auto">
                              <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                                <Thead>
                                  <Tr>
                                    <Th width="10%" textAlign="center"><b>News ID</b></Th>
                                    <Th width="30%" textAlign="center">Interacted Article</Th>
                                    <Th width="30%" textAlign="center">Suggested News</Th>
                                    <Th width="10%" textAlign="center"><b>User ID</b></Th>
                                    <Th width="10%" textAlign="center"><b>Date</b></Th>
                                    <Th width="10%" textAlign="center">Remove</Th>
                                  </Tr>
                                </Thead>
                                <Tbody as={motion.tbody}>
                                  <AnimatePresence>
                                    {interactions
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
                                          <Td textAlign="center">#{interaction.id}</Td>
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
                                          <Td textAlign="center">{interaction.user_id}</Td>
                                          <Td textAlign="center">{formatDate(interaction.interaction_timestamp)}</Td>
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
                            </Flex>
                          </motion.div>
                        )}
                      </Box>
                  </motion.div>
                  {/* Recent Not Relevant News Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} my="6">Recent Not Relevant News</Heading>
                      <Box bg={cardBg} p="5" borderRadius="md" overflowX="auto" shadow="md">
                        {interactions.some((i) => i.interaction_type === "dislike" || (i.interaction_type === "read" && i.read_time_seconds < READ_TIME_THRESHOLD)) ? (
                          <>
                            <Box overflowX="auto">
                              <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                                <Thead>
                                  <Tr>
                                    <Th width="10%" textAlign="center"><b>News ID</b></Th>
                                    <Th width="30%" textAlign="center">Interacted Article</Th>
                                    <Th width="30%" textAlign="center">Not Relevant News</Th>
                                    <Th width="10%" textAlign="center"><b>User ID</b></Th>
                                    <Th width="10%" textAlign="center"><b>Date</b></Th>
                                    <Th width="10%" textAlign="center">Remove</Th>
                                  </Tr>
                                </Thead>
                                <Tbody as={motion.tbody}>
                                  <AnimatePresence>
                                    {interactions
                                      .filter((interaction) => interaction.interaction_type === "dislike" || (interaction.interaction_type === "read" && interaction.read_time_seconds < READ_TIME_THRESHOLD))
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
                                          <Td textAlign="center">#{interaction.id}</Td>
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
                                          <Td textAlign="center">{interaction.user_id}</Td>
                                          <Td textAlign="center">{formatDate(interaction.interaction_timestamp)}</Td>
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
                                No less relevant news found.
                              </Text>
                            </Flex>
                          </motion.div>
                        )}
                      </Box>
                  </motion.div>
                </Flex>
              }
            />
            <Route
              path="/my-users"
              element={
                <MyUsers
                  users={users}
                  deleteUser={deleteUser}
                />
              }
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
              path="/balance-report/:userId"
              element={<BalanceReport/>}
            />
            <Route
              path="/my-balance-reports"
              element={
                <MyBalanceReports
                  users={users}
                  balanceReports={balanceReports}
                  deleteBalanceReport={deleteBalanceReport}
                />
              }
            />
            <Route path="/account-details" element={<AccountDetails />} />
            <Route
              path="*"
              element={
                <Flex flex="1" justify="center" align="center" flexDirection="column" height="100%">
                  <NotFound buttonText="Go Back to Admin Dashboard" redirectPath="/admin/profile" />
                </Flex>
              }
            />
          </Routes>

          {/* Logout Confirmation Modal */}
          <Modal isOpen={isLogoutModalOpen} onClose={onLogoutModalClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Confirm Logout</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to log out of your account?
              </ModalBody>
              <ModalFooter>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button colorScheme="blue" mr={3} onClick={confirmLogout}>
                    Logout
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={onLogoutModalClose}>
                    Cancel
                  </Button>
                </motion.div>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Users Confirmation Modal */}
          <Modal isOpen={isUserModalOpen} onClose={onUserModalClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete user <b>{userToDelete?.username}</b> and all their data (interactions and recommendations)?
              </ModalBody>
              <ModalFooter>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button colorScheme="blue" mr={3} onClick={confirmDeleteUser}>
                    Delete
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={onUserModalClose}>
                    Cancel
                  </Button>
                </motion.div>
              </ModalFooter>
            </ModalContent>
          </Modal>

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
    </>
  );
};

export default AdminProfile;