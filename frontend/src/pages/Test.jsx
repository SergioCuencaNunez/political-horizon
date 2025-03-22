import React, { useState, useEffect } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
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
import { SunIcon, MoonIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import GaugeChart from "react-gauge-chart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

import logoBalanceBright from "../assets/logo-balance-bright.png";
import logoBalanceDark from "../assets/logo-balance-dark.png";

const BalanceReport = () => {
  const navigate = useNavigate();
  // For development only
  const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const logo = useColorModeValue(logoBalanceBright, logoBalanceDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");
  
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
  const { colorMode, toggleColorMode } = useColorMode();

  const [loading, setLoading] = useState(true);
  const [leaning, setLeaning] = useState(null);
  const [distribution, setDistribution] = useState({ LEFT: 0, CENTER: 0, RIGHT: 0 });
  const [metrics, setMetrics] = useState({ entropy: 0, kl_divergence: 0 });

  const [showTransparency, setShowTransparency] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen: isSpinnerOpen, onOpen: onSpinnerOpen, onClose: onSpinnerClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();

  const toggleTransparency = () => setShowTransparency(!showTransparency);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [leaningRes, distributionRes, metricsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/user/balance-report`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/user/exposure-distribution`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/user/diversity-metrics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const leaningData = await leaningRes.json();
        const distributionData = await distributionRes.json();
        const metricsData = await metricsRes.json();
        console.log(leaningData, distributionData, metricsData);

        setLeaning(leaningData.political_leaning);
        setDistribution(distributionData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to fetch balance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const gaugePercent = {
    LEFT: 0.15,
    CENTER: 0.5,
    RIGHT: 0.85,
  }[leaning] || 0.5;

  const gaugeColor = {
    LEFT: ["#0066cc"],
    CENTER: ["#cccc00"],
    RIGHT: ["#cc0000"],
  }[leaning] || ["#cccccc"];

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
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Balance Report</Heading>          
            <HStack spacing="4" display={{ base: "none", lg: "flex" }}>
              <motion.img
                src={logo}
                alt="Horizon Balance Logo"
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
                  alt="Horizon Balance Logo"
                  maxHeight={logoHeight}
                  maxWidth="120px"
                  objectFit="contain"
                />
              </motion.div>
            </HStack>
          </Flex>
          <Box borderBottom="1px" borderColor="gray.300" mb="4"></Box>
          
          {loading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <>
              <Text fontSize="lg" mb="4" textAlign="justify">
                Based on your recent news interactions, here's how balanced your political exposure is.
              </Text>

              <Flex justify="center" mb="6">
                <GaugeChart
                  id="gauge-chart"
                  nrOfLevels={20}
                  percent={gaugePercent}
                  colors={gaugeColor}
                  arcWidth={0.3}
                  textColor={textColor}
                  formatTextValue={() => `${leaning || "Unknown"}`}
                />
              </Flex>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                <Stat>
                  <StatLabel>Left Exposure</StatLabel>
                  <StatNumber>{(distribution.LEFT * 100).toFixed(1)}%</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Center Exposure</StatLabel>
                  <StatNumber>{(distribution.CENTER * 100).toFixed(1)}%</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Right Exposure</StatLabel>
                  <StatNumber>{(distribution.RIGHT * 100).toFixed(1)}%</StatNumber>
                </Stat>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Stat>
                  <StatLabel>Shannon Entropy</StatLabel>
                  <StatNumber>{metrics.shannon_entropy.toFixed(3)}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>KL Divergence (vs ideal)</StatLabel>
                  <StatNumber>{metrics.kl_divergence.toFixed(3)}</StatNumber>
                </Stat>
              </SimpleGrid>
            </>
          )}

          {/* Transparency Section */}
          <Flex direction="column">
            <Flex align="center" cursor="pointer" onClick={toggleTransparency} color={useColorModeValue("gray.500", "gray.400")}>
              <InfoOutlineIcon />
              <Text fontSize="sm" fontWeight="bold" ml={2}>
                More Information and Details
              </Text>
            </Flex>
            <Collapse in={showTransparency}>
              <Box mt={4} p={4} borderRadius="md" bg={useColorModeValue("gray.50", "gray.800")}>
                <Text fontSize="sm" textAlign="justify">
                  {useBreakpointValue({
                    base: "FactGuard Verify uses the Google Fact Check API to validate claims and provide reliable results.",
                    lg: "FactGuard Verify integrates directly with the Google Fact Check Tools API to validate the accuracy of claims. By leveraging a comprehensive database of verified information from trusted fact-checking organizations, it ensures users receive precise and reliable results when assessing the truthfulness of claims.",
                  })}
                </Text>
                <Text mt={2} fontSize="sm" textAlign="justify">
                  {useBreakpointValue({
                    base: "The system is continuously improved to enhance reliability and user experience.",
                    lg: "This integration with the Google Fact Check Tools API ensures robust claim validation, offering users a reliable tool for uncovering the truth. FactGuard Verify is continuously improved to provide enhanced reliability, transparency, and a seamless user experience in combating misinformation.",
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
                <Text mt="4">Verifying Query... Please Wait.</Text>
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
                Please input the query in the provided field to proceed with verification. 
              </ModalBody>
              <ModalFooter>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="md"
                    onClick={onAlertClose}
                  >
                    Close
                  </Button>
                </motion.div>
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

export default BalanceReport;
