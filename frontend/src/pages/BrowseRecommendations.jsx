import React, { useState, useEffect, useRef } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Badge,
  Grid,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Collapse,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, InfoOutlineIcon, ExternalLinkIcon, RepeatIcon, SmallAddIcon } from "@chakra-ui/icons";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { debounce } from "lodash";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

import logoExploreBright from "../assets/logo-explore-bright.png";
import logoExploreDark from "../assets/logo-explore-dark.png";

const BrowseRecommendations = () => {
  const navigate = useNavigate();
  // For development only
  const BACKEND_URL_DB = `${window.location.protocol}//${window.location.hostname}:5001`;
  const BACKEND_URL_API = `${window.location.protocol}//${window.location.hostname}:5002`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const logo = useColorModeValue(logoExploreBright, logoExploreDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });
  
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
  const textColor = useColorModeValue("black", "white");
  const refreshBg = useColorModeValue("gray.100", "gray.600");
  const refreshHoverBg = useColorModeValue("gray.200", "gray.500");
  const refreshActiveBg = useColorModeValue("gray.300", "gray.400");

  const { colorMode, toggleColorMode } = useColorMode();
  const modelCardBg = useColorModeValue("gray.50", "gray.800");

  const hasFetched = useRef(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [thresholdMet, setThresholdMet] = useState(false);
  const [interactionsCount, setInteractionsCount] = useState(0);

  const [userStatus, setUserStatus] = useState(null);

  const [hasLoaded, setHasLoaded] = useState(false); // Track initial load
  const [filters, setFilters] = useState({search: "", politicalLeaning: "All", sortBy: "newest",});
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [animationKey, setAnimationKey] = useState(0);
  
  const [showTransparency, setShowTransparency] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen: isSpinnerOpen, onOpen: onSpinnerOpen, onClose: onSpinnerClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();

  const toggleTransparency = () => setShowTransparency(!showTransparency);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      checkUserStatus();
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const startTime = localStorage.getItem("read_start_time");
        const newsId = localStorage.getItem("read_news_id");

        if (startTime && newsId) {
          const elapsedTime = Math.floor((Date.now() - parseInt(startTime)) / 1000);

          // Send read time to backend
          handleInteraction(newsId, "read", elapsedTime);

          // Clear stored values
          localStorage.removeItem("read_start_time");
          localStorage.removeItem("read_news_id");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const debounceSearch = useRef(
    debounce((value) => {
      setDebouncedSearch(value);
      if (hasLoaded) { // Only trigger animations after initial load
        setAnimationKey((prev) => prev + 1);
      }
    }, 500) // 500ms delay
  ).current;
    
  useEffect(() => {
    debounceSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!hasLoaded) {
      setHasLoaded(true); // Mark initial load complete
    }
  }, []);
  
  const triggerAnimationIfNeeded = (newCount) => {
    if (newCount !== prevFilteredCount.current) {
      setAnimationKey((prev) => prev + 1);
      prevFilteredCount.current = newCount;
    }
  };
  
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  
    // Ensure animation happens on any filter change
    if (!("search" in newFilters)) {
      setAnimationKey((prev) => prev + 1);
    }
  };
      
  const filteredArticles = articles
  .filter(article => {
    if (debouncedSearch.trim() !== "") {
      const searchLower = debouncedSearch.toLowerCase();
      if (!article.headline.toLowerCase().includes(searchLower) &&
          !article.outlet.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.politicalLeaning !== "All" && article.political_leaning !== filters.politicalLeaning.toUpperCase()) {
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    switch (filters.sortBy) {
      case "newest": return new Date(b.date_publish) - new Date(a.date_publish);
      case "oldest": return new Date(a.date_publish) - new Date(b.date_publish);
      case "title-asc": return a.headline.localeCompare(b.headline);
      case "title-desc": return b.headline.localeCompare(a.headline);
      case "outlet-asc": return a.outlet.localeCompare(b.outlet);
      case "outlet-desc": return b.outlet.localeCompare(a.outlet);
      default: return 0;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerAnimationIfNeeded(filteredArticles.length);
    }, 200); // 200ms delay
  
    return () => clearTimeout(timer);
  }, [filteredArticles]);
        
  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL_DB}/user/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setUserStatus(data.status);
      console.log(data);
      if (data.status === "new") {
        fetchRandomArticles();
      } else {
        fetchRecommendations();
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  const fetchRandomArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL_DB}/articles/random`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching random articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL_DB}/articles/recommended?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setArticles((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (news_id, interaction_type, read_time_seconds = 0) => {
    try {
      await fetch(`${BACKEND_URL_DB}/user/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ news_id, interaction_type, read_time_seconds }),
      });
      checkThreshold();
    } catch (error) {
      console.error("Error storing interaction:", error);
    }
  };

  const handleReadMore = (news_id, url) => {
    localStorage.setItem("read_start_time", Date.now());
    localStorage.setItem("read_news_id", news_id);
    window.open(url, "_blank");
  };

  const checkThreshold = async () => {
    try {
      const response = await fetch(`${BACKEND_URL_DB}/user/should-update-recommendations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setThresholdMet(data.shouldUpdate);
    } catch (error) {
      console.error("Error checking threshold:", error);
    }
  };

  const generateRecommendations = async () => {
    onSpinnerOpen();
    try {
      await fetch(`${BACKEND_URL_DB}/user/generate-recommendations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setArticles([]);
      fetchRecommendations();
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      onSpinnerClose();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Box px={{ md: 4 }} py={{ md: 6 }}>
        <Flex direction="column" bg={cardBg} p={8} borderRadius="md" shadow="md">
          <Flex justify="space-between" align="center" mb="4">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Browse Recommendations</Heading>          
            <HStack spacing="4" display={{ base: "none", lg: "flex" }}>
              <motion.img
                src={logo}
                alt="Detect Logo"
                style={{ height: logoHeight, width: 'auto'}}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
              />
              <IconButton
                aria-label="Toggle theme"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </HStack>
            <HStack spacing="4" display={{ base: "flex", md: "flex", lg: "none" }}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                style={{ display: 'inline-block' }}
              >
                <Box
                  as="img"
                  src={logo}
                  alt="Detect Logo"
                  maxHeight={logoHeight}
                  maxWidth="120px"
                  objectFit="contain"
                />
              </motion.div>
            </HStack>
          </Flex>
          <Box borderBottom="1px" borderColor="gray.300" mb="4"></Box>
          <Text mb="4" textAlign="justify">Your recommendations are personalized based on your reading history while ensuring a diverse and balanced perspective, helping you explore different viewpoints and stay informed with a well-rounded news feed.</Text>
          {userStatus === "new" && <Text mb="4" fontSize="sm" color="gray.500">These are your first 10 articles to help us tune your interests.</Text>}
          <Flex gap="4" mb="5">
            <Input placeholder="Search news..." value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} />
            <Select value={filters.politicalLeaning} onChange={(e) => updateFilters({ politicalLeaning: e.target.value })}>
              <option value="All">All</option>
              <option value="Right">Right</option>
              <option value="Center">Center</option>
              <option value="Left">Left</option>
            </Select>
            <Select value={filters.sortBy} onChange={(e) => updateFilters({ sortBy: e.target.value })}>
              <option value="newest">Date (Newest First)</option>
              <option value="oldest">Date (Oldest First)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="outlet-asc">Outlet (A-Z)</option>
              <option value="outlet-desc">Outlet (Z-A)</option>
            </Select>
          </Flex>
          
          <motion.div
            key={animationKey} // Forces re-mount on filtering & sorting
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap="4" mb="5">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.1 * index },
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <Flex key={article.id} p="5" borderRadius="md" shadow="md" direction="column" justify="center" height="100%" bg={modelCardBg}>
                    <Text fontWeight="bold" fontSize="lg" mb="1">{article.headline}</Text>
                    <Text fontSize="sm" color="gray.500" mb="2">{article.outlet} - {new Date(article.date_publish).toLocaleDateString()}</Text>
                    <Badge
                        colorScheme={article.political_leaning === "RIGHT" ? "red" : article.political_leaning === "LEFT" ? "blue" : "yellow"}
                        width="fit-content"
                        mb="4"
                      >
                        {article.political_leaning}
                      </Badge>
                    <HStack spacing="2">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton icon={<FaThumbsUp />} onClick={() => handleInteraction(article.id, "like")} ></IconButton>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton icon={<FaThumbsDown />} onClick={() => handleInteraction(article.id, "dislike")} ></IconButton>
                        </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button leftIcon={<ExternalLinkIcon />} onClick={() => handleReadMore(article.id, article.url)}>Read More</Button>
                      </motion.div>
                    </HStack>
                  </Flex>
                </motion.div>
              ))}
            </Grid>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <HStack mb="4" justify="center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  leftIcon={<RepeatIcon />}
                  size="md"
                  bg={refreshBg}
                  color={textColor}
                  _hover={{ bg: refreshHoverBg }}
                  _active={{ bg: refreshActiveBg }}
                  onClick={fetchRandomArticles}
                >
                  Refresh
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  leftIcon={<SmallAddIcon />}
                  size="md"
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  _active={{ bg: activeColor }}
                  isDisabled={interactionsCount < 3}
                  onClick={fetchRecommendations}
                >
                  Get Recommendations
                </Button>
              </motion.div>
            </HStack>
          </motion.div>

          {/* Transparency Section */}
          <Flex direction="column">
            <Flex align="center" cursor="pointer" onClick={toggleTransparency} color={useColorModeValue("gray.500", "gray.400")}>
              <InfoOutlineIcon fontSize="sm"/>             
             <Text fontSize="sm" fontWeight="bold" ml={2}>
                More Information and Details
              </Text>
            </Flex>
            <Collapse in={showTransparency}>
              <Box mt={4} p={4} borderRadius="md" bg={useColorModeValue("gray.50", "gray.800")}>
                <Text fontSize="sm" textAlign="justify">
                  {useBreakpointValue({
                    base: "Horizon Explore is designed to provide a balanced and personalized news experience. It ensures that you receive customized news without reinforcing ideological bubbles.",
                    lg: "Horizon Explore is designed to provide a balanced and personalized news experience. Our system combines Content-Based Filtering (CBF) with Bias Mitigation Techniques to ensure that you receive news tailored to your preferences without reinforcing ideological bubbles.",
                  })}
                </Text>
                <Text mt={2} fontSize="sm" textAlign="justify">
                  {useBreakpointValue({
                    base: "Our recommendation engine analyzes your reading history and implements strategies to reduce polarization.",
                    lg: "Our recommendation engine analyzes your reading history and applies Controlled Exposure Strategies and Diversity-Aware Re-Ranking Techniques to reduce polarization and broaden your understanding of current events.",
                  })}
                </Text>
              </Box>
            </Collapse>
          </Flex>

          {/* Spinner Modal */}
          <Modal isOpen={isSpinnerOpen} onClose={onSpinnerClose} closeOnOverlayClick={false} closeOnEsc={false} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalBody textAlign="center" py="6">
                <Spinner size="xl" />
                <Text mt="4">Analyzing News with Confidence Threshold... Please Wait.</Text>
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Alert Modal */}
          <Modal isOpen={isAlertOpen} onClose={onAlertClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Missing Information</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Please fill in both the title and content fields to proceed with detecting fake news. 
              </ModalBody>
              <ModalFooter>
                <Button
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  _active={{ bg: activeColor }}
                  size="md"
                  onClick={onAlertClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Error Modal */}
          <Modal isOpen={isErrorOpen} onClose={onErrorClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Error</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>{errorMessage}</Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  _active={{ bg: activeColor }}
                  size="md"
                  onClick={onErrorClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </Flex>
      </Box>
    </motion.div>
  );
};

export default BrowseRecommendations;
