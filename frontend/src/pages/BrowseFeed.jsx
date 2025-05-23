import React, { useState, useEffect, useRef } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  Text,
  Tooltip,
  Button,
  Input,
  Select,
  Badge,
  Grid,
  Divider,
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
import { SunIcon, MoonIcon, InfoOutlineIcon, ExternalLinkIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { GiBigWave, GiCapitol, GiScales } from "react-icons/gi";
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

const BrowseFeed = ({ setReportRefreshTrigger }) => {
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
  const textColor2 = useColorModeValue('gray.500', 'gray.300');
  const refreshBg = useColorModeValue("gray.100", "gray.600");
  const refreshHoverBg = useColorModeValue("gray.200", "gray.500");
  const refreshActiveBg = useColorModeValue("gray.300", "gray.400");

  const { colorMode, toggleColorMode } = useColorMode();
  const modelCardBg = useColorModeValue("gray.50", "gray.800");

  const hasFetched = useRef(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interactions, setInteractions] = useState({});
  const [interactionsCount, setInteractionsCount] = useState(0);

  const [userStatus, setUserStatus] = useState(null);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [filters, setFilters] = useState({search: "", politicalLeaning: "All", sortBy: "newest",});
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [animationKey, setAnimationKey] = useState(0);
  
  const tooltipBg = useColorModeValue("gray.50", "gray.900");
  const tooltipColor = useColorModeValue("black", "white");

  const [showTransparency, setShowTransparency] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen: isSpinnerOpen, onOpen: onSpinnerOpen, onClose: onSpinnerClose } = useDisclosure();
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

          handleInteraction(newsId, "read", elapsedTime);

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
    }, 500)
  ).current;
    
  useEffect(() => {
    debounceSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  }, []);
  
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
        
  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL_DB}/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setUserStatus(data.status);
      fetchNewsArticles();
    } catch (error) {
      setErrorMessage(`Error checking user status: ${error}`);
    }
  };

  const fetchNewsArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL_DB}/news-articles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setArticles(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMessage(`Error fetching news articles: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (id, newInteractionType, read_time_seconds = 0) => {
    try {
      const prevInteraction = interactions[id];
      const token = localStorage.getItem("token");
  
      // Toggle off (same interaction clicked again)
      if (prevInteraction === newInteractionType) {
        // DELETE interaction
        await fetch(`${BACKEND_URL_DB}/interactions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Update state
        setInteractions((prev) => {
          const updatedInteractions = { ...prev };
          delete updatedInteractions[id];
          return updatedInteractions;
        });
  
        setInteractionsCount((prev) => prev - 1);
      return;
      }
  
      // Remove previous (if exists and is different)
      if (prevInteraction && prevInteraction !== newInteractionType) {
        await fetch(`${BACKEND_URL_DB}/interactions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
  
      // POST new interaction
      await fetch(`${BACKEND_URL_DB}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          interaction_type: newInteractionType,
          read_time_seconds,
        }),
      });
  
      // Update state
      setInteractions((prev) => ({
        ...prev,
        [id]: newInteractionType,
      }));
  
      // If this is a new interaction (previously there was no interaction for this id), increment the count
      if (!prevInteraction) {
        setInteractionsCount((prev) => prev + 1);
      }

      setReportRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      setErrorMessage(`Error storing interaction: ${error}`);
    }
  };   

  const handleReadMore = (news_id, url) => {
    localStorage.setItem("read_start_time", Date.now());
    localStorage.setItem("read_news_id", news_id);
    window.open(url, "_blank");
  };

  const handleRecommendations = () => {
    if (interactionsCount < 3) {
      setErrorMessage("Interact with at least 3 articles to help us tailor recommendations just for you.");
      onErrorOpen();
      return;
    }
  
    onSpinnerOpen();
  
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${BACKEND_URL_API}/recommendations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate recommendations.");
        }
  
        const result = await response.json();
  
        if (result.success && result.recommendations.length > 0) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            (async () => {
              setArticles(result.recommendations);
              setReportRefreshTrigger(prev => prev + 1);
          
              try {
                const statusResponse = await fetch(`${BACKEND_URL_DB}/status`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const statusData = await statusResponse.json();
                setUserStatus(statusData.status);
              } catch (error) {
                console.error("Failed to fetch status after recommendations:", error);
              }
            })();
          }, 300);
        } else {
          setErrorMessage("No recommendations generated. Try interacting with more articles.");
          onErrorOpen();
        }
      } catch (error) {
        if (!error.message.includes("No valid articles")) {
          setErrorMessage(`Error generating recommendations. ${error.message}`);
        } else {
          setErrorMessage(error.message);
        }
        onErrorOpen();
      } finally {
        onSpinnerClose();
      }
    }, 5000);
  };  

  const handleFlip = (articleId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };
  
const getPoliticalIcon = (leaning) => {
  const iconSize = 15
  switch (leaning) {
    case "RIGHT":
      return <GiCapitol size={iconSize}/>;
    case "LEFT":
      return <GiBigWave size={iconSize}/>;
    case "CENTER":
      return <GiScales size={iconSize}/>;
    default:
      return null;
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
            <Heading fontSize={{ base: "3xl", md: "4xl"}}>Tailored Reads</Heading>          
            <HStack spacing="4" display={{ base: "none", lg: "flex" }}>
              <motion.img
                src={logo}
                alt="Horizon Explore Logo"
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
                  alt="Horizon Explore Logo"
                  maxHeight={logoHeight}
                  maxWidth="120px"
                  objectFit="contain"
                />
              </motion.div>
            </HStack>
          </Flex>
          <Box borderBottom="1px" borderColor="gray.300" mb="4"></Box>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Text mb="4" textAlign="justify">
              {useBreakpointValue({
                base: "Your recommendations are personalized based on your reading history while ensuring a diverse and balanced perspective, helping you explore different viewpoints.",
                lg: "Your recommendations are personalized based on your reading history while ensuring a diverse and balanced perspective, helping you explore different viewpoints and stay informed with a well-rounded news feed.",
              })}
            </Text>
            <Flex gap="4" mb="4">
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
          </motion.div>

          <Divider mb="4" />
          
          <motion.div
            key={animationKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap="4" mb="6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.2 * index },
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <Box position="relative" minHeight="220px" perspective="1000px">
                    <motion.div
                      style={{
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                        position: "relative",
                      }}
                      animate={{ rotateY: flippedCards[article.id] ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Front Side */}
                      <Flex
                        p="5"
                        borderRadius="md"
                        shadow="md"
                        direction="column"
                        justify="center"
                        minHeight="220px"
                        height="100%"
                        bg={modelCardBg}
                        position="absolute"
                        width="100%"
                        transform="rotateY(0deg)"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <Text
                          fontWeight="bold" fontSize={{ base: "md", lg: "lg" }} mb="1" textAlign="justify"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            wordBreak: "break-word",
                          }}
                        >
                          {article.headline}
                        </Text>
                        <Text fontSize="sm" color={textColor2} mb="2">
                          {article.outlet} - {new Date(article.date_publish).toLocaleDateString()}
                        </Text>
                        <Badge
                          colorScheme={
                            article.political_leaning === "RIGHT"
                              ? "red"
                              : article.political_leaning === "LEFT"
                              ? "blue"
                              : "yellow"
                          }
                          mb="4"
                          p={2}
                          display="flex"
                          width="fit-content"
                          alignItems="center"
                          justifyContent="center"
                          gap="2"
                          whiteSpace="normal"
                        >
                          {getPoliticalIcon(article.political_leaning)}
                          <Text as="span" fontSize="sm" fontWeight="bold">
                            {article.political_leaning}
                          </Text>
                        </Badge>
                        <HStack spacing="2" justify="space-between" width="100%" flexWrap="wrap">
                          {userStatus === "new" ? (
                            <Tooltip
                                label="Only one interaction can be saved per article, the most recent one will be kept."
                                fontSize="xs"
                                textAlign="justify"
                                bg={tooltipBg}
                                color={tooltipColor}
                                placement="top"
                                px={3}
                                py={2}
                                borderRadius="md"
                                shadow="md"
                              >
                              <HStack spacing="2">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    icon={<FaThumbsUp />}
                                    onClick={() => handleInteraction(article.id, "like")}
                                    colorScheme={interactions[article.id] === "like" ? "green" : "gray"}
                                  />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    icon={<FaThumbsDown />}
                                    onClick={() => handleInteraction(article.id, "dislike")}
                                    colorScheme={interactions[article.id] === "dislike" ? "red" : "gray"}
                                  />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    leftIcon={<ExternalLinkIcon />}
                                    onClick={() => handleReadMore(article.id, article.url)}
                                    display={{ base: "none", md: "none", lg: "none", xl: "flex" }}
                                    colorScheme={interactions[article.id] === "read" ? "blue" : "gray"}
                                  >
                                    Read More
                                  </Button>
                                  <IconButton
                                    icon={<ExternalLinkIcon />}
                                    onClick={() => handleReadMore(article.id, article.url)}
                                    display={{ base: "flex", md: "flex", lg: "flex", xl: "none" }}
                                    colorScheme={interactions[article.id] === "read" ? "blue" : "gray"}
                                  />
                                </motion.div>
                              </HStack>
                            </Tooltip>
                          ) : (
                            <HStack spacing="2">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    icon={<FaThumbsUp />}
                                    onClick={() => handleInteraction(article.id, "like")}
                                    colorScheme={interactions[article.id] === "like" ? "green" : "gray"}
                                  />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    icon={<FaThumbsDown />}
                                    onClick={() => handleInteraction(article.id, "dislike")}
                                    colorScheme={interactions[article.id] === "dislike" ? "red" : "gray"}
                                  />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    leftIcon={<ExternalLinkIcon />}
                                    onClick={() => handleReadMore(article.id, article.url)}
                                    display={{ base: "none", md: "none", lg: "none", xl: "flex" }}
                                    colorScheme={interactions[article.id] === "read" ? "blue" : "gray"}
                                  >
                                    Read More
                                  </Button>
                                  <IconButton
                                    icon={<ExternalLinkIcon />}
                                    onClick={() => handleReadMore(article.id, article.url)}
                                    display={{ base: "flex", md: "flex", lg: "flex", xl: "none" }}
                                    colorScheme={interactions[article.id] === "read" ? "blue" : "gray"}
                                  />
                                </motion.div>
                              </HStack>
                          )}
                          {userStatus === "returning" && article.source_article_headline && (
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                icon={<InfoOutlineIcon />}
                                onClick={() => handleFlip(article.id)}
                              />
                            </motion.div>
                          )}
                        </HStack>
                      </Flex>
                      {/* Back Side */}
                      <Flex
                        p="5"
                        borderRadius="md"
                        shadow="md"
                        direction="column"
                        justify="center"
                        textAlign="center"
                        minHeight="220px"
                        height="100%"
                        bg={modelCardBg}
                        position="absolute"
                        width="100%"
                        transform="rotateY(180deg)"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <Text fontWeight="bold" fontSize={{base: "md", lg: "lg"}} mb="1">Why This Article?</Text>
                        <Text fontSize={{base: "xs", lg:"sm"}} color={textColor2} mb="2">
                          This article was recommended based on your interest in:
                        </Text>
                        <Text fontSize={{base: "sm", lg:"md"}} fontWeight="bold" mb="1">"{article.source_article_headline}"</Text>
                        <Text fontSize={{base: "xs", lg:"sm"}} color={textColor2} fontWeight="semibold" mb="4">{article.source_article_outlet}</Text>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <IconButton
                            icon={<RepeatIcon />}
                            onClick={() => handleFlip(article.id)}
                            alignSelf="center"
                          />
                        </motion.div>
                      </Flex>
                    </motion.div>
                  </Box>
                </motion.div>
              ))}
            </Grid>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Box width={{base: "100%", md: "auto"}} mx="auto" mb="4">
              <Flex
                direction= "row"
                justify="center"
                align="center"
                width="100%"
                gap={{ base: "2", md: "4" }}
              >
                <Button
                  as={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  leftIcon={<RepeatIcon />}
                  size="md"
                  bg={refreshBg}
                  color={textColor}
                  _hover={{ bg: refreshHoverBg }}
                  _active={{ bg: refreshActiveBg }}
                  onClick={fetchNewsArticles}
                >
                  Refresh
                </Button>
                <Button
                  as={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  size="md"
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  _active={{ bg: activeColor }}
                  onClick={handleRecommendations}
                >
                  Get Recommendations
                </Button>
              </Flex>
            </Box>
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
                <Text mt="4">Generating Recommendations... Please Wait.</Text>
              </ModalBody>
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
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="md"
                    onClick={onErrorClose}
                  >
                    Close
                  </Button>
                </motion.div>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </Flex>
      </Box>
    </motion.div>
  );
};

export default BrowseFeed;
