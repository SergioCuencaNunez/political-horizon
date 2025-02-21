import React, { useState } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
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

import logoDetectBright from "../assets/logo-bright.png";
import logoDetectDark from "../assets/logo-dark.png";

const StartNewDetection = ({ addDetection }) => {
  const navigate = useNavigate();
  // For development only
  const BACKEND_URL_DB = `${window.location.protocol}//${window.location.hostname}:5002`;
  const BACKEND_URL_API = `${window.location.protocol}//${window.location.hostname}:5002`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const logo = useColorModeValue(logoDetectBright, logoDetectDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });
  
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
  const { colorMode, toggleColorMode } = useColorMode();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [confidence, setConfidence] = useState(70);
  const [showTransparency, setShowTransparency] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen: isSpinnerOpen, onOpen: onSpinnerOpen, onClose: onSpinnerClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();

  const toggleTransparency = () => setShowTransparency(!showTransparency);

  const handleAnalyze = () => {
    if (!title || !content) {
      onAlertOpen();
      return;
    }
  
    onSpinnerOpen();

    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");

        // Call the API to perform the prediction
        const response = await fetch(`${BACKEND_URL_API}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ news_text: content, confidence_threshold: confidence }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          setErrorMessage(`Detection failed: ${errorText}`);
          onErrorOpen();
        }
    
        const predictionResult = await response.json();
    
        if (predictionResult.success) {
          // Extract detection details
          const models = predictionResult.detections.slice(0, 5).map((item) => item.Model);
          const trueProbabilities = predictionResult.detections.slice(0, 5).map((item) => item["True Probability"]);
          const fakeProbabilities = predictionResult.detections.slice(0, 5).map((item) => item["Fake Probability"]);
          const predictions = predictionResult.detections.slice(0, 5).map((item) => item.Prediction);
    
          const detectionData = {
            title: title,
            content: content,
            models: models,
            confidence: confidence,
            true_probabilities: trueProbabilities,
            fake_probabilities: fakeProbabilities,
            predictions: predictions,
            final_prediction: predictionResult.final_prediction,
            date: new Date().toISOString(),
          };
    
          // Save the detection data to the database
          const dbResponse = await fetch(`${BACKEND_URL_DB}/detections`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(detectionData),
          });
    
          if (dbResponse.ok) {
            const newDetection = await dbResponse.json();
            addDetection(newDetection); // Add detection to parent state
            navigate(`/profile/detection-results/${newDetection.id}`, { state: { detection: newDetection } });
          } else if (dbResponse.status === 409) {
            console.warn("Duplicate detection.");
            setErrorMessage("This detection already exists. Please check your list of detections.");
            onErrorOpen();
          } else {
            console.error("Failed to save detection:", await dbResponse.text());
            setErrorMessage(`Failed to save detection: ${await dbResponse.text()}`);
            onErrorOpen();
          }
        } else {
          // Display error message if no detections are found
          setErrorMessage(predictionResult.message || "No detections found for the input.");
          onErrorOpen();
        }
      } catch (error) {
        console.error("Error during detection analysis:", error);
        setErrorMessage(`Error during detection analysis: ${error.message}`);
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
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>Detect Fake News</Heading>          
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
          <Text mb="4">Enter the title and paste/upload a news article to analyze its authenticity:</Text>
          <Input
            placeholder="Enter article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb="4"
            _placeholder={{
              color: useColorModeValue("gray.500", "gray.400"),
            }}
          />
          <Textarea
            placeholder="Paste your article content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            mb="4"
            _placeholder={{
              color: useColorModeValue("gray.500", "gray.400"),
            }}
          />
          
          {/* Confidence Threshold */}
          <Flex direction="column">
            <Flex align="center" justify="space-between" mb="4">
              <Text mr="4">Confidence Threshold:</Text>
              {useBreakpointValue({
                base: (
                  <Select
                    value={confidence}
                    onChange={(e) => setConfidence(parseInt(e.target.value))}
                    width="50%"
                    maxWidth="150px"
                  >
                    {[...Array(11).keys()].map((val) => (
                      <option key={val} value={50 + val * 5}>
                        {50 + val * 5}%
                      </option>
                    ))}
                  </Select>
                ),
                lg: (
                  <Flex flex="1" align="center">
                    <Slider
                      defaultValue={confidence}
                      min={50}
                      max={100}
                      step={5}
                      onChange={(val) => setConfidence(val)}
                      width="100%"
                    >
                      <SliderTrack bg="gray.200">
                        <SliderFilledTrack bg={primaryColor} />
                      </SliderTrack>
                      <SliderThumb
                        boxSize={5}
                        border="1px"
                        borderColor={useColorModeValue("gray.200", "gray.400")}
                      />
                    </Slider>
                    <Text ml={4} fontWeight="bold">{confidence}%</Text>
                  </Flex>
                ),
              })}
            </Flex>
            <Text fontSize="sm" mb="4" textAlign="justify" color={useColorModeValue("gray.500", "gray.400")}>
              {useBreakpointValue({
                base: "Adjust the confidence threshold using the selection box. FactGuard Detect will only classify news as fake or true if the certainty exceeds the selected threshold.",
                lg: "The confidence slider lets you adjust the threshold that determines the minimum certainty required for classifying news. For instance, if set to 70%, FactGuard Detect will only classify news as fake or true when it is at least 70% confident in its prediction.",
              })}
            </Text>
          </Flex>
          
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
                onClick={handleAnalyze}
              >
                Analyze
              </Button>
            </motion.div>
          </Flex>

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
                    base: "FactGuard Detect uses advanced ML and DL models to analyze the authenticity of news. It selects the most accurate model to ensure trustworthy results.",
                    lg: "FactGuard Detect utilizes advanced Machine Learning (ML) and Deep Learning (DL) models to analyze the authenticity of news articles. By training multiple models on large datasets of verified fake and real news, the system evaluates their performance and selects the most accurate and reliable one based on key metrics like accuracy, precision, and recall.",
                  })}
                </Text>
                <Text mt={2} fontSize="sm" textAlign="justify">
                  {useBreakpointValue({
                    base: "Continuous improvements are made to enhance accuracy and transparency.",
                    lg: "This approach ensures that the best-performing model is used to deliver consistent and trustworthy results. While no prediction system is perfect, FactGuard Detect is continuously improved to enhance accuracy and maintain transparency.",
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
                <Text mt="4">Analyzing News with {confidence}% Confidence Threshold... Please Wait.</Text>
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

export default StartNewDetection;
