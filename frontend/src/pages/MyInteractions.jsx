import React, { useState, useEffect, useRef } from "react";
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
import { SunIcon, MoonIcon, ChevronDownIcon, ChevronUpIcon, WarningIcon } from "@chakra-ui/icons";
import { FaTrashCan } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';

import logoExploreBright from "../assets/logo-explore-bright.png";
import logoExploreDark from "../assets/logo-explore-dark.png";

const MyInteractions = ({ interactions, deleteInteraction }) => {
  const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  const logo = useColorModeValue(logoExploreBright, logoExploreDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const hasFetched = useRef(false);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [interactionToDelete, setInteractionToDelete] = useState(null);
  const [selectedSuggested, setSelectedSuggested] = useState([]);
  const [selectedNotRelevant, setSelectedNotRelevant] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen: isErrorOpen, onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure();

  const READ_TIME_THRESHOLD = 120;

  const suggestedText = useBreakpointValue({
    base: "These are the news articles you liked or spent time reading. We use this to understand your preferences and offer more relevant, balanced recommendations.",
    lg: "  These are the news articles you have interacted with, either by explicitly liking them or by spending a significant amount of time reading them. These interactions help us understand your interests and preferences in order to provide more relevant and balanced recommendations.",
  });

  const notRelevantText = useBreakpointValue({
    base: "These are articles you disliked or didn’t engage with. We use this to avoid showing you similar content in future suggestions.",
    lg: "These are the news articles you have shown little interest in, either by disliking them or not spending enough time reading. This feedback helps us fine-tune your interests and avoid suggesting similar content in future recommendations.",
  });

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
      onErrorOpen();
    }
  };

  const handleDelete = (interaction) => {
    setInteractionToDelete(interaction);
    onOpen();
  };

  const confirmDelete = async () => {
    if (interactionToDelete) {
      await deleteInteraction(interactionToDelete.id);
    } else {
      for (const interaction of [...selectedSuggested, ...selectedNotRelevant]) {
        await deleteInteraction(interaction.id);
      }
      setSelectedSuggested([]);
      setSelectedNotRelevant([]);
    }
    onClose();
  };

  const handleSelectAllSuggested = (isChecked) => {
    setSelectedSuggested(isChecked ? interactions.filter(i => i.interaction_type === "like" || (i.interaction_type === "read" && i.read_time_seconds >= READ_TIME_THRESHOLD)) : []);
  };

  const handleSelectAllNotRelevant = (isChecked) => {
    setSelectedNotRelevant(isChecked ? interactions.filter(i => i.interaction_type === "dislike" || (i.interaction_type === "read" && i.read_time_seconds < READ_TIME_THRESHOLD)) : []);
  };

  const handleSelectInteraction = (interaction, isChecked, type) => {
    if (type === "suggested") {
      setSelectedSuggested((prev) => isChecked ? [...prev, interaction] : prev.filter((item) => item.id !== interaction.id));
    } else {
      setSelectedNotRelevant((prev) => isChecked ? [...prev, interaction] : prev.filter((item) => item.id !== interaction.id));
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

          {/* Suggested News Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Heading fontSize="2xl" mb="2">Suggested News</Heading>
            {userStatus === "returning" && 
              <Text mb="4" textAlign="justify">{suggestedText}</Text>
            }
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
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
                          <Th width="5%" textAlign="center">Remove</Th>
                          <Th width="5%" textAlign="center">Select</Th>
                        </Tr>
                      </Thead>
                      <Tbody as={motion.tbody}>
                        <AnimatePresence>
                          {sortedInteractions
                            .filter((interaction) => interaction.interaction_type === "like" || (interaction.interaction_type === "read" && interaction.read_time_seconds >= READ_TIME_THRESHOLD))
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
                                      onClick={() => handleDelete(interaction)}
                                    />
                                  </motion.div>
                                </Td>
                                <Td textAlign="center">
                                  <Checkbox 
                                    isChecked={selectedSuggested.includes(interaction)} 
                                    onChange={(e) => handleSelectInteraction(interaction, e.target.checked, "suggested")} 
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
                      isChecked={selectedSuggested.length === interactions.filter(i => i.interaction_type === "like" || (i.interaction_type === "read" && i.read_time_seconds >= READ_TIME_THRESHOLD)).length} 
                      onChange={(e) => handleSelectAllSuggested(e.target.checked)}
                    >
                      Select All Suggested
                    </Checkbox>
                    <AnimatePresence>
                      {selectedSuggested.length > 0 && (
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
                              setInteractionToDelete(null);
                              onOpen();
                            }}
                            isDisabled={selectedSuggested.length === 0}
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
                  <Flex align="center" justify="center" direction="column" h={{ base: "20vh", md: "18vh" }}>
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
          </motion.div>

          {/* Not Relevant News Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Heading fontSize="2xl" mt="4" mb="2">Not Relevant News</Heading>
            {userStatus === "returning" && 
              <Text mb="4" textAlign="justify">{notRelevantText}</Text>
            }
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {interactions.some((i) => i.interaction_type === "dislike" || (i.interaction_type === "read" && i.read_time_seconds < READ_TIME_THRESHOLD)) ? (
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
                        <Th width="40%" textAlign="center">Not Relevant News</Th>
                        <Th width="5%" textAlign="center">Remove</Th>
                        <Th width="5%" textAlign="center">Select</Th>
                      </Tr>
                    </Thead>
                    <Tbody as={motion.tbody}>
                      <AnimatePresence>
                        {sortedInteractions
                          .filter((interaction) => interaction.interaction_type === "dislike" || (interaction.interaction_type === "read" && interaction.read_time_seconds < READ_TIME_THRESHOLD))
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
                              {/* Not Relevant News */}
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
                                  <Text color="gray.400">No not relevant news</Text>
                                )}
                              </Td>
                              <Td textAlign="center">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    icon={<FaTrashCan />}
                                    color={primaryColor}
                                    onClick={() => handleDelete(interaction)}
                                  />
                                </motion.div>
                              </Td>
                              <Td textAlign="center">
                                <Checkbox
                                  isChecked={selectedNotRelevant.includes(interaction)} 
                                  onChange={(e) => handleSelectInteraction(interaction, e.target.checked, "notRelevant")} 
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
                    isChecked={selectedNotRelevant.length === interactions.filter(i => i.interaction_type === "dislike" || (i.interaction_type === "read" && i.read_time_seconds < READ_TIME_THRESHOLD)).length} 
                    onChange={(e) => handleSelectAllNotRelevant(e.target.checked)}
                  >
                    Select All Not Relevant
                  </Checkbox>
                  <AnimatePresence>
                    {selectedNotRelevant.length > 0 && (
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
                            setInteractionToDelete(null);
                            onOpen();
                          }}
                          isDisabled={selectedNotRelevant.length === 0}
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
                <Flex align="center" justify="center" direction="column" h={{ base: "20vh", md: "18vh" }}>
                  <WarningIcon boxSize="6" color="gray.500" mb="2" />
                  <Text fontSize="lg" color="gray.500" textAlign="center">
                    No less relevant news found.
                  </Text>
                  <Text fontSize="md" color="gray.400" textAlign="center">
                    If you find certain articles not relevant or unhelpful, let us know by disliking them. Horizon Explore will use this feedback to improve your experience and avoid suggesting similar content.
                  </Text>
                </Flex>
              </motion.div>
            )}
          </motion.div>

          {/* Confirmation Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
              <ModalContent
                width={{ base: "90%"}}
              >
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody textAlign="justify">
                {interactionToDelete
                  ? "Are you sure you want to delete this interaction? This will remove the selected news article and its recommendations."
                  : "Are you sure you want to delete the selected interactions? This will remove the selected news articles and their recommendations."}
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

export default MyInteractions;
