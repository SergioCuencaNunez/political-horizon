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
  Collapse,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SunIcon, MoonIcon, ArrowBackIcon, RepeatIcon, ChevronDownIcon, ChevronUpIcon, WarningIcon, WarningTwoIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

import logoDetectBright from "../assets/logo-bright.png";
import logoDetectDark from "../assets/logo-dark.png";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

const DetectionResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const BACKEND_URL_DB = `${window.location.protocol}//${window.location.hostname}:5002`;

  const logo = useColorModeValue(logoDetectBright, logoDetectDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });
  const cardBg = useColorModeValue("white", "gray.700");

  const { colorMode, toggleColorMode } = useColorMode();
  const modelCardBg = useColorModeValue("gray.50", "gray.800");
  const contentBorderColor = useColorModeValue("gray.200", "gray.600");
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const textColor = useColorModeValue("black", "white");
  const textColor2 = useColorModeValue("gray.500", "gray.400")
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const allDetectionsBg = useColorModeValue("gray.100", "gray.600");
  const startNewDetectionHoverBg = useColorModeValue("gray.200", "gray.500");
  const startNewDetectionActiveBg = useColorModeValue("gray.300", "gray.400");
  const allDetectionsHoverBg = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const allDetectionsActiveBg = useColorModeValue(primaryActiveLight, primaryActiveDark);

  const modelClassificationText1 = useBreakpointValue({
    base: (
      <span>
        Models classify the article as <strong>True</strong>, <strong>Fake</strong>, or <strong>Uncertain</strong>.
      </span>
    ),
    md: (
      <span>
        Models classify the article as <strong>True</strong>, <strong>Fake</strong>, or <strong>Uncertain</strong>, determined by analyzing the models' probabilities.
      </span>
    ),
    lg: (
      <span>
        Models classify the article as <strong>True</strong>, <strong>Fake</strong>, or <strong>Uncertain</strong>. Each classification is determined by analyzing the probabilities calculated by the models.
      </span>
    ),
  });

  const modelClassificationText2 = useBreakpointValue({
    base: (
      <span>
        <strong>True:</strong> The majority of models consider the article credible.
      </span>
    ),
    md: (
      <span>
        <strong>True:</strong> The majority of models consider the article credible, with probabilities surpassing the confidence threshold.
      </span>
    ),
    lg: (
      <span>
        <strong>True:</strong> The majority of models consider the article credible, with probabilities surpassing the confidence threshold.
      </span>
    ),
  });

  const modelClassificationText3 = useBreakpointValue({
    base: (
      <span>
        <strong>Fake:</strong> The models identify significant indicators of falsehood.
      </span>
    ),
    md: (
      <span>
        <strong>Fake:</strong> The models identify significant indicators of falsehood, with probabilities exceeding the confidence threshold.
      </span>
    ),
    lg: (
      <span>
        <strong>Fake:</strong> The models identify significant indicators of falsehood, with probabilities meeting or exceeding the confidence threshold.
      </span>
    ),
  });

  const modelClassificationText4 = useBreakpointValue({
    base: (
      <span>
        <strong>Uncertain:</strong> Occurs when the models either fail to reach a strong consensus.
      </span>
    ),
    md: (
      <span>
        <strong>Uncertain:</strong> Occurs when the models either fail to reach a strong consensus, indicating the need for further review.
      </span>
    ),
    lg: (
      <span>
        <strong>Uncertain:</strong> Occurs when the models either fail to reach a strong consensus or their confidence scores fall below the predefined threshold, indicating the need for further review.
      </span>
    ),
  });

  const modelClassificationText5 = useBreakpointValue({
    base: (
      <span>
        The final prediction for the article is determined using <strong>majority voting</strong>. In the event of a tie, the prediction defaults to <strong>Uncertain</strong>.
        </span>
    ),
    md: (
      <span>
        The final prediction for the article is determined using a <strong>majority voting</strong> mechanism. In the event of a tie, the prediction defaults to <strong>Uncertain</strong>, emphasizing the need for human review.
        </span>
    ),
    lg: (
      <span>
        The final prediction for the article is determined using a <strong>majority voting</strong> mechanism. Each model contributes its classification, and the category with the highest number of votes is chosen as the final prediction. In the event of a tie, the prediction defaults to <strong>Uncertain</strong>, emphasizing the need for human review.
      </span>
    ),
  });

  const insightsText1 = useBreakpointValue({
    base: "This analysis aggregates results from models for a holistic evaluation.",
    md: "This analysis integrates results from multiple ML and DL models to ensure a holistic evaluation.",
    lg: "This analysis integrates results from multiple machine learning and deep learning models to ensure a holistic evaluation of the article.",
  });

  const insightsText2 =  useBreakpointValue({
    base: "The probabilities provided are used to inform the final prediction through majority voting. For further investigation, please use trusted fact-checking sources such as ",
    md: "The probabilities provided by each model are used to inform the final prediction through majority voting. For further investigation, it is advised to compare the article's claims with trusted fact-checking sources, such as ",
    lg: "The probabilities and classifications provided by each model are used to inform the final prediction through a majority voting approach, ensuring transparency and accuracy in the assessment. For further investigation, it is advised to compare the article's claims with trusted fact-checking databases or reliable sources or databases, such as ",
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchDetection = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${BACKEND_URL_DB}/detections/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });        
        if (!response.ok) {
          throw new Error("Detection not found.");
        }
        const data = await response.json();
        setDetection(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetection();
  }, [id]);

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" />
        <Text ml="4">Loading detection details...</Text>
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
                Detection Not Found
              </Heading>
    
              <Text fontSize="md" color={textColor} textAlign="center">
                The requested detection with ID: <Text as="span" fontWeight="bold" color={errorTextColor}>#{id}</Text> does not exist.
                Please check your list and try again.
              </Text>
    
              <HStack spacing="4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    leftIcon={<ArrowBackIcon />}
                    size="md"
                    bg={allDetectionsBg}
                    color={textColor}
                    _hover={{ bg: startNewDetectionHoverBg }}
                    _active={{ bg: startNewDetectionActiveBg }}
                    onClick={() => navigate("/profile")}
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  leftIcon={<RepeatIcon />}
                  size="md"
                  bg={allDetectionsBg}
                  color={textColor}
                  _hover={{ bg: startNewDetectionHoverBg }}
                  _active={{ bg: startNewDetectionActiveBg }}
                  onClick={() => navigate("/profile/start-new-detection")}
                >
                  Start New Detection
                </Button>
              </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="md"
                    bg={primaryColor}
                    color="white"
                    _hover={{ bg: allDetectionsHoverBg }}
                    _active={{ bg: allDetectionsActiveBg }}
                    onClick={() => navigate("/profile/my-news-detections")}
                  >
                    All Detections
                  </Button>
                </motion.div>
              </HStack>
            </VStack>
          </Box>
        </motion.div>
      </Flex>
    );
  }  

  if (!detection) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Text fontSize="lg" color="gray.500" textAlign="center">
          No detection found.
        </Text>
      </Flex>
    );
  }

  const {models, true_probabilities, fake_probabilities, predictions, final_prediction} = detection;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };

  const getPredictionColor = (prediction) => {
    if (prediction === "Fake") return "red";
    if (prediction === "True") return "green";
    return "orange";
  };
  
  const getPredictionIcon = (prediction) => {
    if (prediction === "Fake") return <WarningTwoIcon color="red.500" />;
    if (prediction === "True") return <CheckCircleIcon color="green.500" />;
    return <WarningIcon color="orange.500" />;
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
              <Heading fontSize={{ base: "3xl", md: "4xl" }}>Detection Results</Heading>
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
          </motion.div>

          <Divider mb="4" />

          {/* Article Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Box mb="4">
              <Heading size="md" mb="2" color={textColor}>
                Article Summary
              </Heading>
              <VStack align="flex-start" spacing="2">
                <Text fontSize="md">
                  <b>Detection ID:</b> #{detection.id}
                </Text>
                <Text fontSize="md">
                  <b>Title:</b> {detection.title}
                </Text>
                <Box
                  maxH="150px"
                  overflowY="auto"
                  border="1px"
                  borderColor={contentBorderColor}
                  p={2}
                  borderRadius="md"
                  textAlign="justify"
                >
                  <Text fontSize="md" whiteSpace="pre-wrap">
                  <b>Content:</b> {detection.content}
                  </Text>
                </Box>
                <Text fontSize="md">
                  <b>Confidence Threshold Established:</b> {detection.confidence}%
                </Text>
                <Text fontSize="md">
                  <b>Date Analyzed:</b> {formatDate(detection.date)}
                </Text>
              </VStack>
            </Box>
          </motion.div>

          <Divider mb="4" />

          {/* Final Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Box mb="4">
              <Heading size="md" mb="2" color={textColor}>
                Final Prediction
              </Heading>
              <Badge
                colorScheme={getPredictionColor(detection.final_prediction)}
                fontSize="lg"
                px={4}
                py={2}
                display="flex"
                alignItems="center"
                gap="2"
                justifyContent="center"
                textAlign="center"
                whiteSpace="normal"
              >
                {getPredictionIcon(final_prediction)}
                <Text as="span" fontSize="lg">
                  {final_prediction}
                </Text>
              </Badge>
            </Box>

            {/* Advanced Options */}
            <Box>
              <Flex align="center" mb="4" justify={{ base: "center", md: "flex-start" }}>
                <Text fontSize="md" fontWeight="bold" color={textColor2}>
                  Detailed Model Analysis
                </Text>
                <IconButton
                  aria-label="Toggle Detailed Model Analysis"
                  icon={showAdvanced ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  size="xs"
                  ml={2}
                />
              </Flex>
            </Box>
            <Collapse in={showAdvanced} animateOpacity style={{ overflow: "visible" }}>
              <Text mb="2" fontSize="md" textAlign="justify">
                {modelClassificationText1}
              </Text>
              <Box as="ul" pl={5} mb="2" textAlign="justify">
                <Box as="li" mb="1">
                  <Text fontSize="md">
                    {modelClassificationText2}
                  </Text>
                </Box>
                <Box as="li" mb="1">
                  <Text fontSize="md">
                    {modelClassificationText3}
                  </Text>
                </Box>
                <Box as="li" mb="1">
                  <Text fontSize="md">
                    {modelClassificationText4}
                  </Text>
                </Box>
              </Box>
              <Text mb="4" fontSize="md" textAlign="justify">
                {modelClassificationText5}
              </Text>
              {/* Machine Learning Models */}
              <Heading size="md" mb="2" color={textColor}>
                Machine Learning Models
              </Heading>
              <Flex wrap="wrap" direction={{ base: "column", md: "row" }} justify="space-between" mb="6" gap="6">
                {models.slice(0, 3).map((model, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ flex: "1 1 calc(33.333% - 1rem)"}}
                  >
                    <Box
                      key={index}
                      flex="1 1 calc(33% - 1rem)"
                      p="5"
                      bg={modelCardBg}
                      borderRadius="md"
                      shadow="md"
                      textAlign="justify"
                    >
                      <Text fontSize="lg" fontWeight="bold" mb="2" textAlign="center">
                        {model}
                      </Text>
                      <Divider mb={4} />
                      <Flex justify="space-between" px={{base: "2", md: "14", lg: "12"}} mb="4">
                        <Box textAlign="center">
                          <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color={textColor2}>
                            True
                          </Text>
                          <Text fontSize="2xl" fontWeight="medium">
                            {true_probabilities[index]}
                          </Text>
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color={textColor2}>
                            Fake
                          </Text>
                          <Text fontSize="2xl" fontWeight="medium">
                            {fake_probabilities[index]}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex justify="center">
                        <Badge
                          colorScheme={getPredictionColor(predictions[index])}
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
                          {getPredictionIcon(predictions[index])}
                          <Text as="span" fontSize="md">
                          {predictions[index]}
                          </Text>
                        </Badge>
                      </Flex>
                    </Box>
                  </motion.div>
                ))}
              </Flex>
              
              {/* Deep Learning Models */}
              <Heading size="md" mb="2" color={textColor}>
                Deep Learning Models
              </Heading>
              <Flex wrap="wrap" direction={{ base: "column", md: "row" }} justify="space-between" mb="6" gap="8">
                {models.slice(3).map((model, index) => (
                  <motion.div
                    key={index+3}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ flex: "1 1 calc(33.333% - 1rem)"}}
                  >
                    <Box
                      key={index+3}
                      flex="1 1 calc(33% - 1rem)"
                      p="5"
                      bg={modelCardBg}
                      borderRadius="md"
                      shadow="md"
                      textAlign="justify"
                    >
                      <Text fontSize="lg" fontWeight="bold" mb="2" textAlign="center">
                        {model}
                      </Text>
                      <Divider mb={4} /> 
                      <Flex justify="space-between" px={{base: "2", md: "14", lg: "24"}}  mb="2">
                        <Box textAlign="center">
                          <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color={textColor2}>
                            True
                          </Text>
                          <Text fontSize="2xl" fontWeight="medium">
                            {true_probabilities[index+3]}
                          </Text>
                        </Box>
                        <Box textAlign="center">
                          <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" color={textColor2}>
                            Fake
                          </Text>
                          <Text fontSize="2xl" fontWeight="medium">
                            {fake_probabilities[index+3]}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex justify="center">
                        <Badge
                          colorScheme={getPredictionColor(predictions[index+3])}
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
                          {getPredictionIcon(predictions[index+3])}
                          <Text as="span" fontSize="md">
                          {predictions[index+3]}
                          </Text>
                        </Badge>
                      </Flex>
                    </Box>
                  </motion.div>
                ))}
              </Flex>
            </Collapse>
          </motion.div>
          
          <Divider mb="4" />

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Box textAlign="justify">
              <Heading size="md" mb="2" color={textColor}>
                Insights
              </Heading>
              <Text fontSize="md" mb="2">
                {insightsText1}
              </Text>
              <Text fontSize="md">
                {insightsText2}
                <Link
                  to="/profile/start-new-claim-check"
                  style={{
                    color: hoverColor,
                    fontWeight: 'bold',
                  }}
                >
                  FactGuard Verify
                </Link>
                .
              </Text>
            </Box>
          </motion.div>

          {/* Navigation Buttons */}
          <Flex justify="center" mt="8">
            <Stack direction={{ base: "column", md: "row" }} spacing="4" align="center">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  size="md"
                  bg={allDetectionsBg}
                  color={textColor}
                  _hover={{ bg: startNewDetectionHoverBg }}
                  _active={{ bg: startNewDetectionActiveBg }}
                  onClick={() => navigate("/profile/start-new-detection")}
                >
                  Start New Detection
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="md"
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: allDetectionsHoverBg }}
                  _active={{ bg: allDetectionsActiveBg }}
                  onClick={() => navigate("/profile/my-news-detections")}
                >
                  All Detections
                </Button>
              </motion.div>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default DetectionResults;
