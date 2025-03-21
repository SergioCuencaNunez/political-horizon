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
import { SunIcon, MoonIcon, ChevronDownIcon, ChevronUpIcon, WarningIcon } from "@chakra-ui/icons";
import { FaThumbsUp, FaThumbsDown, FaBook, FaTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';

import logoExploreBright from "../assets/logo-explore-bright.png";
import logoExploreDark from "../assets/logo-explore-dark.png";

const MyInteractions = ({ interactions, deleteInteraction }) => {
  const navigate = useNavigate();

  const logo = useColorModeValue(logoExploreBright, logoExploreDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [interactionToDelete, setInteractionToDelete] = useState(null);
  const [selectedSuggested, setSelectedSuggested] = useState([]);
  const [selectedNotRelevant, setSelectedNotRelevant] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

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
    setSelectedSuggested(isChecked ? interactions.filter(i => i.interaction_type !== "dislike") : []);
  };

  const handleSelectAllNotRelevant = (isChecked) => {
    setSelectedNotRelevant(isChecked ? interactions.filter(i => i.interaction_type === "dislike") : []);
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

  const getInteractionIcon = (interactionType) => {
    if (interactionType === "like") return <IconButton icon={<FaThumbsUp />}/>
    if (interactionType === "dislike") return <IconButton icon={<FaThumbsDown />}/>
    return <IconButton icon={<FaBook />}/>
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
          <Heading fontSize="2xl" mb="3">Suggested News</Heading>
          {interactions.some((i) => i.interaction_type !== "dislike") ? (
            <>
              <Box overflowX="auto">
                <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                  <Thead>
                    <Tr>
                      <Th width="5%" textAlign="center">
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
                      <Th width="5%" textAlign="center">Interaction</Th>
                      <Th width="40%" textAlign="center">Interacted Article</Th>
                      <Th width="50%" textAlign="center">Suggested News</Th>
                      <Th width="5%" textAlign="center">Remove</Th>
                      <Th width="5%" textAlign="center">Select</Th>
                    </Tr>
                  </Thead>
                  <Tbody as={motion.tbody}>
                    <AnimatePresence>
                      {sortedInteractions
                        .filter((interaction) => interaction.interaction_type !== "dislike")
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
                            <Td textAlign="center">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  {getInteractionIcon(interaction.interaction_type)}
                              </motion.div>
                            </Td>
                            {/* Interacted Article */}
                            <Td textAlign="justify">
                              <Box mb={2}>
                                <Text fontWeight="bold">
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
                                    <Text fontWeight="bold">
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
                  isChecked={selectedSuggested.length === interactions.filter(i => i.interaction_type !== "dislike").length} 
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
              <Flex align="center" justify="center" direction="column" h={{ base: "auto", md: "15vh" }}>
                <WarningIcon boxSize="6" color="gray.500" mb="2" />
                <Text fontSize="lg" color="gray.500" textAlign="center">
                  No suggested news found.
                </Text>
                <Text fontSize="md" color="gray.400" textAlign="center">
                  Start receiving diverse news recommendations with Horizon Explore, ensuring balanced perspectives and reducing bias in your daily news consumption.
                </Text>
              </Flex>
            </motion.div>
          )}

          {/* Not Relevant News Table */}
          <Heading fontSize="2xl" mt="6" mb="3">Not Relevant News</Heading>
          {interactions.some((i) => i.interaction_type === "dislike") ? (
            <>
              <Box overflowX="auto">
                <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                  <Thead>
                    <Tr>
                      <Th width="5%" textAlign="center">
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
                      <Th width="5%" textAlign="center">Interaction</Th>
                      <Th width="40%" textAlign="center">Interacted Article</Th>
                      <Th width="50%" textAlign="center">Not Relevant News</Th>
                      <Th width="5%" textAlign="center">Remove</Th>
                      <Th width="5%" textAlign="center">Select</Th>
                    </Tr>
                  </Thead>
                  <Tbody as={motion.tbody}>
                    <AnimatePresence>
                      {sortedInteractions
                        .filter((interaction) => interaction.interaction_type === "dislike")
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
                            <Td textAlign="center">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                {getInteractionIcon(interaction.interaction_type)}
                              </motion.div>
                            </Td>
                            {/* Interacted Article */}
                            <Td textAlign="justify">
                              <Box mb={2}>
                              <Text fontWeight="bold">
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
                                    <Text fontWeight="bold">
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
                  isChecked={selectedNotRelevant.length === interactions.filter(i => i.interaction_type === "dislike").length} 
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
              <Flex align="center" justify="center" direction="column" h={{ base: "auto", md: "15vh" }}>
                <WarningIcon boxSize="6" color="gray.500" mb="2" />
                <Text fontSize="lg" color="gray.500" textAlign="center">
                  No not relevant news found.
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
                  {interactionToDelete
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
