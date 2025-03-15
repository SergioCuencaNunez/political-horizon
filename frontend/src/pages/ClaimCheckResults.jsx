import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  VStack,
  HStack,
  Stack,
  Heading,
  Button,
  Text,
  Divider,
  Badge,
  Spinner,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  ArrowBackIcon,
  RepeatIcon,
  CheckCircleIcon,
  WarningTwoIcon,
  WarningIcon,
  InfoIcon,
  ExternalLinkIcon
} from "@chakra-ui/icons";
import { motion } from "framer-motion";

import logoVerifyBright from "../assets/logo-bright.png";
import logoVerifyDark from "../assets/logo-dark.png";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const ClaimCheckResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BACKEND_URL_DB = `${window.location.protocol}//${window.location.hostname}:5001`;

  const logo = useColorModeValue(logoVerifyBright, logoVerifyDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });
  const cardBg = useColorModeValue("white", "gray.700");

  const { colorMode, toggleColorMode } = useColorMode();
  const modelCardBg = useColorModeValue("gray.50", "gray.800");
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const textColor = useColorModeValue("black", "white");
  const textColor2 = useColorModeValue("gray.500", "gray.400")
  const allClaimChecksBg = useColorModeValue("gray.100", "gray.600");
  const startNewClaimCheckHoverBg = useColorModeValue("gray.200", "gray.500");
  const startNewClaimCheckActiveBg = useColorModeValue("gray.300", "gray.400");
  const allClaimChecksHoverBg = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const allClaimChecksActiveBg = useColorModeValue(primaryActiveLight, primaryActiveDark);

  const insightsText = useBreakpointValue({
    base: "The rating indicates the evaluation of the claim's accuracy based on the trusted fact-checking sources. For further details, review the provided link.",
    md: "The rating indicates the evaluation of the claim's accuracy based on trusted fact-checking sources. For further details, review the provided link to the fact-checking source.",
  });

  const [claimCheck, setClaimCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchClaimCheck= async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${BACKEND_URL_DB}/claims/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });        
        if (!response.ok) {
          throw new Error("Claim not found.");
        }
        const data = await response.json();
        setClaimCheck(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimCheck();
  }, [id]);

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" />
        <Text ml="4">Loading claim check details...</Text>
      </Flex>
    );
  }

  if (error) {
    const errorTextColor = useColorModeValue("red.500", "red.200");
  
    return (
      <Flex flex="1" justify="center" align="center" flexDirection="column" height="100%">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Box
            bg={cardBg}
            p="5"
            borderRadius="md"
            textAlign="center"
            shadow="md"
            height="100%"
          >
            <VStack spacing="6">
              <WarningTwoIcon boxSize="14" color={errorTextColor} />
    
              <Heading fontSize="2xl" color={errorTextColor}>
                Claim Check Not Found
              </Heading>
    
              <Text fontSize="md" color={textColor} textAlign="center">
                The requested claim check with ID: <Text as="span" fontWeight="bold" color={errorTextColor}>#{id}</Text> does not exist.
                Please check your list and try again.
              </Text>
    
              <HStack spacing="4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    leftIcon={<ArrowBackIcon />}
                    size="md"
                    bg={allClaimChecksBg}
                    color={textColor}
                    _hover={{ bg: startNewClaimCheckHoverBg }}
                    _active={{ bg: startNewClaimCheckActiveBg }}
                    onClick={() => navigate("/profile")}
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  leftIcon={<RepeatIcon />}
                  size="md"
                  bg={allClaimChecksBg}
                  color={textColor}
                  _hover={{ bg: startNewClaimCheckHoverBg }}
                  _active={{ bg: startNewClaimCheckActiveBg }}
                  onClick={() => navigate("/profile/start-new-claim-check")}
                >
                  Start New Claim Check
                </Button>
              </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="md"
                    bg={primaryColor}
                    color="white"
                    _hover={{ bg: allClaimChecksHoverBg }}
                    _active={{ bg: allClaimChecksActiveBg }}
                    onClick={() => navigate("/profile/my-claim-checks")}
                  >
                    All Claim Checks
                  </Button>
                </motion.div>
              </HStack>
            </VStack>
          </Box>
        </motion.div>
      </Flex>
    );
  }  

  if (!claimCheck) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Text fontSize="lg" color="gray.500" textAlign="center">
          No claim check found.
        </Text>
      </Flex>
    );
  }

  const { claims, ratings, links } = claimCheck;

  const getRatingColor = (rating) => {
    const lowerRating = rating.toLowerCase();
    if (["false", "incorrect", "not true", "no", "fake", "falso", "incorrecto", "no verdadero"].some((term) => lowerRating.includes(term))) {
      return "red";
    } else if (["true", "yes", "verdadero", "si"].some((term) => lowerRating.includes(term))) {
      return "green";
    } else if (["mixture", "altered", "misleading", "engañoso", "alterado", "descontextualizado", "sin contexto"].some((term) => lowerRating.includes(term))) {
      return "orange";
    } else {
      return "gray";
    }
  };

  const getRatingIcon = (rating) => {
    const lowerRating = rating.toLowerCase();
    if (["false", "incorrect", "not true", "no", "fake", "falso", "incorrecto", "no verdadero"].some((term) => lowerRating.includes(term))) {
      return <WarningTwoIcon color="red.500" />;
    } else if (["true", "yes", "verdadero", "si"].some((term) => lowerRating.includes(term))) {
      return <CheckCircleIcon color="green.500" />;
    } else if (["mixture", "altered", "misleading", "engañoso", "alterado", "descontextualizado", "sin contexto"].some((term) => lowerRating.includes(term))) {
      return <WarningIcon color="orange.500" />;
    } else {
      return <InfoIcon color="gray.500" />;
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Flex justify="space-between" align="center" mb="4">
              <Heading fontSize={{ base: "3xl", md: "4xl" }}>Claim Check Results</Heading>
              <HStack spacing="4" display={{ base: "none", lg: "flex" }}>
                <motion.img
                  src={logo}
                  alt="Verify Logo"
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
                    alt="Verify Logo"
                    maxHeight={logoHeight}
                    maxWidth="120px"
                    objectFit="contain"
                  />
                </motion.div>
              </HStack>
            </Flex>
          </motion.div>

          <Divider mb="4" />

          {/* Claim Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box mb="4">
              <Heading size="md" mb="2" color={textColor}>
                Claim Summary
              </Heading>
              <VStack align="flex-start" spacing="2">
                <Text fontSize="md">
                  <b>Claim Check ID:</b> #{claimCheck.id}
                </Text>
                <Text fontSize="md">
                  <b>Query:</b> {claimCheck.query}
                </Text>
                <Text fontSize="md">
                  <b>Language:</b> {claimCheck.language}
                </Text>
                <Text fontSize="md">
                  <b>Date Analyzed:</b> {formatDate(claimCheck.date)}
                </Text>
              </VStack>
            </Box>
          </motion.div>

          <Divider mb="4" />

          {/* Display Claims */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Box mb="4">
              <Heading size="md" mb="2" color={textColor}>
                Fact-Checks Found
              </Heading>
              {claims.map((claim, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.4 * index },
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <Box key={index} mb="4" p="5" bg={modelCardBg} borderRadius="md" shadow="md" textAlign="justify">
                    <Text fontSize={{base: "md", lg: "lg"}} fontWeight="bold" mb="2" textAlign="justify">
                      {claim}
                    </Text>
                    <Divider mb={4} />
                    <Flex justify="flex-start" direction={{base: "column", lg: "row"}} align={{lg: "center"}} mb="2">
                      <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color={textColor2} mr="2" mb={{base: "2", md: "2", lg: "0"}}> 
                        Rating:
                      </Text>                     
                      <Badge
                        colorScheme={getRatingColor(ratings[index])}
                        fontSize="md"
                        px={4}
                        py={2}
                        display="flex"
                        alignItems="center"
                        gap="2"
                        justifyContent="center"
                        textAlign="center"
                        whiteSpace="normal"
                      >
                        {getRatingIcon(ratings[index])}
                        <Text as="span" fontSize="md">
                          {ratings[index]}
                        </Text>
                      </Badge>
                    </Flex>
                    <Flex justify="flex-start" alignItems="center">
                      <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color={textColor2} mr="2" position="relative"  top={{base: "2px", md: "0px", lg: "-1px"}}> 
                          Link:
                      </Text>
                      <Flex alignItems="center">
                        <Text fontSize="md">
                          <a href={links[index]} target="_blank" rel="noopener noreferrer">
                            {new URL(links[index]).hostname}
                          </a>
                        </Text>
                        <ExternalLinkIcon ml="2" />
                      </Flex>
                    </Flex>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          <Divider mb="4" />

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Box textAlign="justify">
              <Heading size="md" mb="2" color={textColor}>
                Insights
              </Heading>
              <Text fontSize="md" mb="2">
                This analysis was performed using Google Fact Check Tools API.
              </Text>
              <Text fontSize="md">
                {insightsText}                
              </Text>
            </Box>
          </motion.div>

          {/* Navigation Buttons */}
          <Flex justify="center" mt="8">
            <Stack direction={{ base: "column", md: "column", lg: "row" }} spacing="4" align="center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  size="md"
                  bg={allClaimChecksBg}
                  color={textColor}
                  _hover={{ bg: startNewClaimCheckHoverBg }}
                  _active={{ bg: startNewClaimCheckActiveBg }}
                  onClick={() => navigate("/profile/start-new-claim-check")}
                >
                  Start New Claim Check
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="md"
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: allClaimChecksHoverBg }}
                  _active={{ bg: allClaimChecksActiveBg }}
                  onClick={() => navigate("/profile/my-claim-checks")}
                >
                  All Claim Checks
                </Button>
              </motion.div>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default ClaimCheckResults;
