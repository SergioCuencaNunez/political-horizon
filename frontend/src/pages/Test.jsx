import React, { useState } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  IconButton,
  Checkbox,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaTrashAlt } from "react-icons/fa";
import { SunIcon, MoonIcon, ChevronDownIcon, ChevronUpIcon, WarningIcon, WarningTwoIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';

import logoExploreBright from "../assets/logo-explore-bright.png";
import logoExploreDark from "../assets/logo-explore-dark.png";

const MyInteractions = ({ detections, deleteDetection }) => {
  const navigate = useNavigate();

  const logo = useColorModeValue(logoExploreBright, logoExploreDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [detectionToDelete, setDetectionToDelete] = useState(null);
  const [selectedDetections, setSelectedDetections] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const handleDelete = (detection) => {
    setDetectionToDelete(detection);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      if (detectionToDelete) {
        // Delete a single detection
        await deleteDetection(detectionToDelete.id);
      } else {
        // Delete selected detections
        for (const detection of selectedDetections) {
          await deleteDetection(detection.id);
        }
        setSelectedDetections([]);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting detection(s):", error);
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedDetections(detections);
    } else {
      setSelectedDetections([]);
    }
  };

  const handleSelectDetection = (detection, isChecked) => {
    if (isChecked) {
      setSelectedDetections((prev) => [...prev, detection]);
    } else {
      setSelectedDetections((prev) => prev.filter((item) => item.id !== detection.id));
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };
  
  const sortedDetections = [...detections].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
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
          <Flex justify="space-between" align="center" mb="4">
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>My Interactions</Heading>                    
            <HStack spacing="4" display={{ base: "none", md: "none", lg: "flex" }}>
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
          {detections.length > 0 ? (
            <>
              <Box overflowX="auto">
                <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                  <Thead>
                    <Tr>
                      <Th width="10%" textAlign="center"><b>ID</b></Th>
                      <Th width="35%" textAlign="left"><b>Title</b></Th>
                      <Th width="15%" textAlign="center"><b>Prediction</b></Th>
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
                      <Th width="10%" textAlign="center"><b>Results</b></Th>
                      <Th width="10%" textAlign="center"><b>Remove</b></Th>
                      <Th width="10%" textAlign="center"><b>Select</b></Th>
                    </Tr>
                  </Thead>
                  <Tbody as={motion.tbody}>
                    <AnimatePresence>
                      {sortedDetections.map((detection) => (
                        <motion.tr
                          key={detection.id}
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Td textAlign="center">#{detection.id}</Td>
                          <Td textAlign="justify">{detection.title}</Td>
                          <Td textAlign="center">
                            <Badge
                              colorScheme={getPredictionColor(detection.final_prediction)}
                              fontSize="md"
                              p={2}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              gap="2"
                              whiteSpace="normal"
                            >
                              {getPredictionIcon(detection.final_prediction)}
                              <Text as="span" fontSize="md">
                                {detection.final_prediction}
                              </Text>
                            </Badge>
                          </Td>
                          <Td textAlign="center">{formatDate(detection.date)}</Td>
                          <Td textAlign="center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                size="sm"
                                onClick={() =>
                                  navigate(`/profile/detection-results/${detection.id}`, {
                                    state: { detection },
                                  })
                                }
                              >
                                Results
                              </Button>
                            </motion.div>
                          </Td>
                          <Td textAlign="center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button size="sm" color={primaryColor} onClick={() => handleDelete(detection)}>
                                <FaTrashAlt />
                              </Button>
                            </motion.div>
                          </Td>
                          <Td textAlign="center">
                            <Checkbox
                              isChecked={selectedDetections.some((item) => item.id === detection.id)}
                              onChange={(e) => handleSelectDetection(detection, e.target.checked)}
                            />
                          </Td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </Tbody>
                </Table>
              </Box>
              <Flex justify="space-between" align="center" height="40px">
                <Checkbox
                  isChecked={selectedDetections.length === detections.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  Select All
                </Checkbox>
                <AnimatePresence>
                  {selectedDetections.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, scale: 0.8, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          setDetectionToDelete(null);
                          onOpen();
                        }}
                        isDisabled={selectedDetections.length === 0}
                      >
                        Delete Selected
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Flex>
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
                  No interactions found.
                </Text>
                <Text fontSize="md" color="gray.400" textAlign="center">
                  Start receiving diverse news recommendations with Horizon Explore, ensuring balanced perspectives and reducing bias in your daily news consumption.
                </Text>
              </Flex>
            </motion.div>
          )}

          {/* Confirmation Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {detectionToDelete
                  ? "Are you sure you want to delete this interaction?"
                  : "Are you sure you want to delete the selected interactions?"}
              </ModalBody>
              <ModalFooter>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button colorScheme="blue" mr={3} onClick={confirmDelete}>
                    Delete
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button onClick={onClose}>Cancel</Button>
                </motion.div>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default MyInteractions;
