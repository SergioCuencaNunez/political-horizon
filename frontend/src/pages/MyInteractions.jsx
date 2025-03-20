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

const MyInteractions = ({ interactions, deleteInteraction }) => {
  const navigate = useNavigate();

  const logo = useColorModeValue(logoExploreBright, logoExploreDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [interactionToDelete, setInteractionToDelete] = useState(null);
  const [selectedInteractions, setSelectedInteractions] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const handleDelete = (interaction) => {
    setInteractionToDelete(interaction);
    onOpen();
  };

  const confirmDelete = async () => {
    if (interactionToDelete) {
      await deleteInteraction(interactionToDelete.id);
    } else {
      for (const interaction of selectedInteractions) {
        await deleteInteraction(interaction.id);
      }
      setSelectedInteractions([]);
    }
    onClose();
  };

  const handleSelectAll = (isChecked) => {
    setSelectedInteractions(isChecked ? interactions : []);
  };

  const handleSelectInteraction = (interaction, isChecked) => {
    setSelectedInteractions((prev) =>
      isChecked ? [...prev, interaction] : prev.filter((item) => item.id !== interaction.id)
    );
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
          {interactions.length > 0 ? (
            <>
              <Box overflowX="auto">
                <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                  <Thead>
                    <Tr>
                      <Th width="15%" textAlign="center">
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
                      <Th width="15%" textAlign="center">Interaction</Th>
                      <Th width="40%" textAlign="center">Recommendations</Th>
                      <Th width="10%" textAlign="center">Remove</Th>
                      <Th width="10%" textAlign="center">Select</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedInteractions.map((interaction) => (
                      <Tr key={interaction.id}>
                        <Td textAlign="center">{formatDate(interaction.interaction_timestamp)}</Td>
                        <Td textAlign="center">{interaction.interaction_type}</Td>
                        <Td textAlign="center">
                          {interaction.recommendations.length > 0 ? (
                            interaction.recommendations.map((rec, index) => (
                              <Box key={index} mb={2}>
                                <Text fontWeight="bold">{rec.headline}</Text>
                                <Text fontSize="sm" color="gray.500">{rec.outlet}</Text>
                                <a href={rec.url} target="_blank" rel="noopener noreferrer">
                                  <Button size="xs" colorScheme="blue" variant="outline">Read</Button>
                                </a>
                              </Box>
                            ))
                          ) : (
                            <Text color="gray.400">No recommendations</Text>
                          )}
                        </Td>
                        <Td textAlign="center">
                          <IconButton
                            icon={<FaTrashAlt />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(interaction)}
                          />
                        </Td>
                        <Td textAlign="center">
                          <Checkbox
                            isChecked={selectedInteractions.some((item) => item.id === interaction.id)}
                            onChange={(e) => handleSelectInteraction(interaction, e.target.checked)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              <Flex justify="space-between" align="center" height="40px">
                <Checkbox
                  isChecked={selectedInteractions.length === interactions.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  Select All
                </Checkbox>
                <AnimatePresence>
                  {selectedInteractions.length > 0 && (
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
                        isDisabled={selectedInteractions.length === 0}
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
