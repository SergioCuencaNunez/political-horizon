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
  Button,
  Badge,
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
import {
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  WarningTwoIcon,
  WarningIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';

import logoVerifyBright from "../assets/logo-bright.png";
import logoVerifyDark from "../assets/logo-dark.png";

const MyClaimChecks = ({ claimChecks, deleteClaimCheck }) => {
  const navigate = useNavigate();

  const logo = useColorModeValue(logoVerifyBright, logoVerifyDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });
  
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const cardBg = useColorModeValue("white", "gray.700");
  
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [claimCheckToDelete, setClaimCheckToDelete] = useState(null);
  const [selectedClaimChecks, setSelectedClaimChecks] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const handleDelete = (claimCheck) => {
    setClaimCheckToDelete(claimCheck);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      if (claimCheckToDelete) {
        // Delete a single claim check
        await deleteClaimCheck(claimCheckToDelete.id);
      } else {
        // Delete selected claim check
        for (const claimCheck of selectedClaimChecks) {
          await deleteClaimCheck(claimCheck.id);
        }
        setSelectedClaimChecks([]);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting claim check(s):", error);
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedClaimChecks(claimChecks);
    } else {
      setSelectedClaimChecks([]);
    }
  };

  const handleSelectClaimCheck = (claimCheck, isChecked) => {
    if (isChecked) {
      setSelectedClaimChecks((prev) => [...prev, claimCheck]);
    } else {
      setSelectedClaimChecks((prev) => prev.filter((item) => item.id !== claimCheck.id));
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  };
  
  const sortedClaimChecks = [...claimChecks].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const getRatingColor = (rating) => {
    const lowerRating = rating.toLowerCase();
  
    if (["false", "incorrect", "not true", "no", "fake", "falso", "incorrecto", "no verdadero"].includes(lowerRating)) {
      return "red";
    } else if (["true", "yes", "verdadero", "si"].includes(lowerRating)) {
      return "green";
    } else if (["mixture", "altered", "misleading", "engañoso", "alterado", "descontextualizado", "sin contexto"].includes(lowerRating)) {
      return "orange";
    } else if (lowerRating === "inconclusive") {
      return "gray";
    } else {
      return "gray";
    }
  };
  
  const getRatingIcon = (rating) => {
    const lowerRating = rating.toLowerCase();
    if (["false", "incorrect", "not true", "no", "fake", "falso", "incorrecto", "no verdadero"].includes(lowerRating)) {
      return <WarningTwoIcon color="red.500" />;
    } else if (["true", "yes", "verdadero", "si"].includes(lowerRating)) {
      return <CheckCircleIcon color="green.500" />;
    } else if (["mixture", "altered", "misleading", "engañoso", "alterado", "descontextualizado", "sin contexto"].includes(lowerRating)) {
      return <WarningIcon color="orange.500" />;
    } else {
      return <InfoIcon color="gray.500" />;
    }
  };

  const getAggregateRating = (ratings) => {
    const normalizedRatings = ratings.map((rating) => rating.toLowerCase());
  
    const categories = {
      true: ["true", "yes", "verdadero", "si"],
      false: ["false", "incorrect", "not true", "no", "fake", "falso", "incorrecto", "no verdadero"],
      inconclusive: ["mixture", "altered", "misleading", "engañoso", "alterado", "descontextualizado", "sin contexto"],
    };
  
    let trueCount = 0;
    let falseCount = 0;
    let inconclusiveCount = 0;
  
    normalizedRatings.forEach((rating) => {
      if (categories.true.includes(rating)) {
        trueCount++;
      } else if (categories.false.includes(rating)) {
        falseCount++;
      } else if (categories.inconclusive.includes(rating)) {
        inconclusiveCount++;
      }
    });
  
    if (trueCount > falseCount && trueCount > inconclusiveCount) {
      return "True";
    } else if (falseCount > trueCount && falseCount > inconclusiveCount) {
      return "False";
    } else if (inconclusiveCount > trueCount && inconclusiveCount > falseCount) {
      return "Misleading";
    } else if (
      (trueCount > 0 && falseCount > 0 && inconclusiveCount === 0) ||
      (trueCount > 0 && inconclusiveCount > 0 && falseCount === 0) ||
      (falseCount > 0 && inconclusiveCount > 0 && trueCount === 0)
    ) {
      return "Inconclusive";
    } else if (normalizedRatings.length === 1) {
      return ratings[0];
    }
    return "Inconclusive";
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
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>My Claim Checks</Heading>                    
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
          {claimChecks.length > 0 ? (
            <>
              <Box overflowX="auto">
                <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                  <Thead>
                    <Tr>
                      <Th width="10%" textAlign="center"><b>ID</b></Th>
                      <Th width="35%" textAlign="left"><b>Query</b></Th>
                      <Th width="15%" textAlign="center"><b>Rating</b></Th>
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
                      {sortedClaimChecks.map((claimCheck) => (
                        <motion.tr
                          key={claimCheck.id}
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Td textAlign="center">#{claimCheck.id}</Td>
                          <Td textAlign="justify">{claimCheck.query}</Td>
                          <Td textAlign="center">
                            <Badge
                              colorScheme={getRatingColor(getAggregateRating(claimCheck.ratings))}
                              fontSize="md"
                              p={2}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              gap="2"
                              whiteSpace="normal"
                            >
                              {getRatingIcon(getAggregateRating(claimCheck.ratings))}
                              <Text as="span" fontSize="md">
                                {getAggregateRating(claimCheck.ratings)}
                              </Text>
                            </Badge>
                          </Td>
                          <Td textAlign="center">{formatDate(claimCheck.date)}</Td>
                          <Td textAlign="center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                size="sm"
                                onClick={() =>
                                  navigate(`/profile/claim-check-results/${claimCheck.id}`, {
                                    state: { claimCheck },
                                  })
                                }
                              >
                                Results
                              </Button>
                            </motion.div>
                          </Td>
                          <Td textAlign="center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button size="sm" color={primaryColor} onClick={() => handleDelete(claimCheck)}>
                                <FaTrashAlt />
                              </Button>
                            </motion.div>
                          </Td>
                          <Td textAlign="center">
                            <Checkbox
                              isChecked={selectedClaimChecks.some((item) => item.id === claimCheck.id)}
                              onChange={(e) => handleSelectClaimCheck(claimCheck, e.target.checked)}
                            />
                          </Td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </Tbody>
                </Table>
              </Box>
              <Flex justify="space-between" align="center" mb="4" height="40px">
                <Checkbox
                  isChecked={selectedClaimChecks.length === claimChecks.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                >
                  Select All
                </Checkbox>
                <AnimatePresence>
                  {selectedClaimChecks.length > 0 && (
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
                          setClaimCheckToDelete(null);
                          onOpen();
                        }}
                        isDisabled={selectedClaimChecks.length === 0}
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
              <Flex align="center" justify="center" direction="column" h={{ base: "auto", md: "15vh" }} mb={{ base: "4", md: "0" }}>
                <WarningIcon boxSize="6" color="gray.500" mb="2" />
                <Text fontSize="lg" color="gray.500" textAlign="center">
                  No claims checks found.
                </Text>
                <Text fontSize="md" color="gray.400" textAlign="center">
                  Start verifying claims with FactGuard Verify by evaluating their reliability using trusted sources and robust fact-checking methods.
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
                {claimCheckToDelete
                  ? "Are you sure you want to delete this claim check?"
                  : "Are you sure you want to delete the selected claim checks?"}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={confirmDelete}>
                  Delete
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default MyClaimChecks;
