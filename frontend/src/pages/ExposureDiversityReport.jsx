import React, { useState } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  Text,
  Select,
  Input,
  Button,
  IconButton,
  UnorderedList,
  ListItem,
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

const ExposureDiversityReport = ({ addClaimCheck }) => {
  const navigate = useNavigate();
  // For development only
  const BACKEND_URL_DB = `${window.location.protocol}//${window.location.hostname}:5001`;
  const BACKEND_URL_API = `${window.location.protocol}//${window.location.hostname}:5002`;

  // For production
  // const BACKEND_URL_DB = import.meta.env.VITE_BACKEND_URL_DB;
  // const BACKEND_URL_API = import.meta.env.VITE_BACKEND_URL_API;
  
  const logo = useColorModeValue(logoBalanceBright, logoBalanceDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
  const { colorMode, toggleColorMode } = useColorMode();

  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [showTransparency, setShowTransparency] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notClaimsMatchingMessage, setNotClaimsMatchingMessage] = useState({ message: "", suggestions: [] });
  const { isOpen: isSpinnerOpen, onOpen: onSpinnerOpen, onClose: onSpinnerClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isLanguageAlertOpen, onOpen: onLanguageAlertOpen, onClose: onLanguageAlertClose } = useDisclosure();
  const { isOpen: isNotClaimsMatchingOpen, onOpen: onNotClaimsMatchingOpen, onClose: onNotClaimsMatchingClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();

  const toggleTransparency = () => setShowTransparency(!showTransparency);

  const handleVerify = () => {
    if (!query) {
      onAlertOpen();
      return;
    }
  
    if (!language) {
      onLanguageAlertOpen();
      return;
    }
  
    onSpinnerOpen();
  
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
  
        // Call the API to perform the fact-checking
        const response = await fetch(`${BACKEND_URL_API}/factcheck`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: query, language }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          setErrorMessage(`Fact-Check failed: ${errorText}`);
          onErrorOpen();
        }
  
        const factCheckResult = await response.json();
  
        if (factCheckResult.success) {
          // Extract claims, ratings, and links
          const claims = factCheckResult.data.slice(0, 3).map((item) => item.Claim);
          const ratings = factCheckResult.data.slice(0, 3).map((item) => item.Rating || "Unknown");
          const links = factCheckResult.data.slice(0, 3).map((item) => item.URL || "No URL");
  
          const claimData = {
            query: query,
            claims: claims,
            ratings: ratings,
            links: links,
            language: language,
            date: new Date().toISOString(),
          };
  
          // Save the claims to the database
          const dbResponse = await fetch(`${BACKEND_URL_DB}/claims`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(claimData),
          });
  
          if (dbResponse.ok) {
            const newClaimCheck = await dbResponse.json();
            addClaimCheck(newClaimCheck); // Add claim to parent state
            navigate(`/profile/claim-check-results/${newClaimCheck.id}`, { state: { claimCheck: newClaimCheck } });
          } else if (dbResponse.status === 409) {
            console.warn("Duplicate query.");
            setErrorMessage("This query has already been analyzed. Please check your list of claims.");
            onErrorOpen();
          } else {
            console.error("Failed to save claim:", await dbResponse.text());
            setErrorMessage(`Failed to save claim: ${await dbResponse.text()}`);
            onErrorOpen();
          }
        } else {
          // Display error message if no claims are found
          setNotClaimsMatchingMessage(factCheckResult.message || "Unknown error occurred.");
          onNotClaimsMatchingOpen();
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setErrorMessage(`Error during verification: ${error.message}`);
        onErrorOpen();
      } finally {
        onSpinnerClose();
      }
    }, 5000);
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
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Verify Claims</Heading>          
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
          <Box borderBottom="1px" borderColor="gray.300" mb="4"></Box>
          <Text mb="4">Enter a query to search for fact checks or verify the authenticity of a claim using reliable sources:</Text>
          <Select 
            placeholder="Select the language"
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            mb="4"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
          </Select>
          <Input
            placeholder="Enter a query or claim to verify"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            mb="6"
            _placeholder={{
              color: useColorModeValue("gray.500", "gray.400"),
            }}
          />
          <Flex justify="center" mb="4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                _active={{ bg: activeColor }}
                size="md"
                width="fit-content"
                px="8"
                onClick={handleVerify}
              >
                Verify
              </Button>
            </motion.div>
          </Flex>

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

          {/* Language Alert Modal */}
          <Modal isOpen={isLanguageAlertOpen} onClose={onLanguageAlertClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Missing Language</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Please select a language before proceeding with the verification.
              </ModalBody>
              <ModalFooter>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="md"
                    onClick={onLanguageAlertClose}
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

          {/* Not Matching Claims Modal */}
          <Modal isOpen={isNotClaimsMatchingOpen} onClose={onNotClaimsMatchingClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Not Found</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>{notClaimsMatchingMessage}</Text>
                <Text mt="4">Suggestions:</Text>
                <UnorderedList>
                  <ListItem>Make sure all keywords are spelled correctly.</ListItem>
                  <ListItem>Try different keywords</ListItem>
                  <ListItem>Try more general keywords</ListItem>
                  <ListItem>Try fewer keywords</ListItem>
                </UnorderedList>
              </ModalBody>
              <ModalFooter>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="md"
                    onClick={onNotClaimsMatchingClose}
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

export default ExposureDiversityReport;
