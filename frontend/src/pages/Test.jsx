// Versión corregida de MyBalanceReports con límites de ancho para evitar overflow
import React, { useState, useEffect } from "react";
import {
  HStack,
  Box,
  Flex,
  Heading,
  IconButton,
  Button,
  Text,
  Divider,
  Badge,
  SimpleGrid,
  Grid,
  Input,
  useDisclosure,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react";
import {
  SunIcon,
  MoonIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import GaugeComponent from "react-gauge-component";
import { GiCapitol, GiBigWave, GiScales } from "react-icons/gi";
import { AnimatePresence, motion } from "framer-motion";

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';
const primaryHoverLight = '#b0001a';
const primaryHoverDark = '#d83a52';
const primaryActiveLight = '#970016';
const primaryActiveDark = '#e14f64';

import logoBalanceBright from "../assets/logo-balance-bright.png";
import logoBalanceDark from "../assets/logo-balance-dark.png";

import BlurOverlay from "../components/BlurOverlay";

const MyBalanceReports = ({ users, balanceReports, deleteBalanceReport }) => {
  const navigate = useNavigate();

  const logo = useColorModeValue(logoBalanceBright, logoBalanceDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);

  const cardBg = useColorModeValue("white", "gray.700");
  const modelCardBg = useColorModeValue("gray.50", "gray.800");

  const gridColor = useColorModeValue("#B0B0B0", "#888888");
  const textColor = useColorModeValue("black", "white");
  const textColor2 = useColorModeValue('gray.500', 'gray.300');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [balanceReportToDelete, setBalanceReportToDelete] = useState(null);

  const [animationKey, setAnimationKey] = useState(0);

  const { colorMode, toggleColorMode } = useColorMode();
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  const getPoliticalIcon = (leaning) => {
    const iconSize = 15;
    switch (leaning) {
      case "RIGHT":
        return <GiCapitol size={iconSize} />;
      case "LEFT":
        return <GiBigWave size={iconSize} />;
      case "CENTER":
        return <GiScales size={iconSize} />;
      default:
        return null;
    }
  };

  const getBalanceReportForUser = (userId) => {
    return balanceReports.find((report) => report.user_id === userId);
  };

  const usersWithReports = users.filter((user) => getBalanceReportForUser(user.id) != null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowEmptyMessage(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleDelete = (balanceReport) => {
    setBalanceReportToDelete(balanceReport);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      if (balanceReportToDelete) {
        await deleteBalanceReport(balanceReportToDelete.user_id);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting balance report:", error);
    }
  };

  const [searchUserId, setSearchUserId] = useState("");
  const [searchUsername, setSearchUsername] = useState("");

  const filteredUsers = usersWithReports.filter((user) =>
    user.username.toLowerCase().includes(searchUsername.toLowerCase()) &&
    user.id.toString().includes(searchUserId)
  );

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
            <Heading fontSize={{ base: '3xl', md: '4xl' }}>All Balance Reports</Heading>
            <HStack spacing="4">
              <Box
                as="img"
                src={logo}
                alt="Horizon Balance Logo"
                maxHeight={logoHeight}
                maxWidth="120px"
                objectFit="contain"
              />
              <IconButton
                aria-label="Toggle theme"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </HStack>
          </Flex>

          <Box borderBottom="1px" borderColor="gray.300" mb="4"></Box>

          <Flex gap="4" mb="6" wrap="wrap">
            <Input
              placeholder="Filter by User ID"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              flex="2"
            />
            <Input
              placeholder="Search by username"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              flex="3"
            />
          </Flex>

          <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
            {filteredUsers.map((user) => {
              const balanceReport = getBalanceReportForUser(user.id);
              const interactions = {
                LEFT: parseFloat(balanceReport.exposure.LEFT),
                CENTER: parseFloat(balanceReport.exposure.CENTER),
                RIGHT: parseFloat(balanceReport.exposure.RIGHT),
              };
              return (
                <Box
                  key={user.id}
                  width="100%"
                  mx="auto"
                  bg={modelCardBg}
                  borderRadius="md"
                  p={6}
                  shadow="md"
                  overflow="hidden"
                >
                  <Box mb="4">
                    <Heading size="sm">
                      <Text as="span" fontSize="md" color={textColor2} textTransform="uppercase">Username:</Text>{" "}
                      <Text as="span" fontWeight="bold" textTransform="uppercase">{user.username}</Text>
                    </Heading>
                    <Heading size="sm">
                      <Text as="span" fontSize="md" color={textColor2} textTransform="uppercase">ID:</Text>{" "}
                      <Text as="span" fontWeight="bold" textTransform="uppercase">#{user.id}</Text>
                    </Heading>
                    <Heading size="sm">
                      <Text as="span" fontSize="md" color={textColor2} textTransform="uppercase">Political Leaning:</Text>{" "}
                      <Text as="span" fontWeight="bold" textTransform="uppercase">{user.political_leaning}</Text>
                    </Heading>
                  </Box>

                  <Divider mb="4" />

                  <Box mb="4">
                    <Heading size="sm" mb="2">Political Exposure</Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} width="100%" minW="0">
                      {["LEFT", "CENTER", "RIGHT"].map((leaning) => (
                        <Badge
                          key={leaning}
                          colorScheme={leaning === "RIGHT" ? "red" : leaning === "LEFT" ? "blue" : "yellow"}
                          p={2}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          justifyContent="center"
                          width="100%"
                          whiteSpace="normal"
                          textAlign="center"
                          wordBreak="break-word"
                        >
                          {getPoliticalIcon(leaning)}
                          <Text fontSize="sm" fontWeight="bold">
                            {leaning}: {interactions[leaning].toFixed(1)}%
                          </Text>
                        </Badge>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Divider mb="4" />

                  <Box mb="4">
                    <Heading size="sm" mb="2">Source Diversity</Heading>
                    <HStack spacing={2} mb="2" justify="center">
                      <Text>
                        Top Read Outlet: <Text as="span" fontWeight="semibold">{balanceReport.top_read_outlet}</Text>
                      </Text>
                      <Text>|</Text>
                      <Text>
                        Top Frequent Outlet: <Text as="span" fontWeight="semibold">{balanceReport.top_freq_outlet}</Text>
                      </Text>
                    </HStack>
                  </Box>

                  <Divider mb="4" />

                  <Box mb="4">
                    <Heading size="sm" mb="2">Overall Information</Heading>
                    <HStack spacing={2} mb="2" justify="center">
                      <Text>Shannon Entropy: <Text as="span" fontWeight="semibold">{parseFloat(balanceReport.shannon_entropy).toFixed(3)}</Text></Text>
                      <Text>|</Text>
                      <Text>KL Divergence: <Text as="span" fontWeight="semibold">{parseFloat(balanceReport.kl_divergence).toFixed(3)}</Text></Text>
                    </HStack>
                    <Box maxW={{ base: "100%", lg: "350px" }} mx="auto">
                      <GaugeComponent
                        type="semicircle"
                        value={balanceReport.balance_score * 100}
                        minValue={0}
                        maxValue={100}
                        arc={{
                          width: 0.3,
                          padding: 0.015,
                          cornerRadius: 3,
                          subArcs: [
                            { limit: 30, color: "#FEB2B2" },
                            { limit: 60, color: "#FBD38D" },
                            { limit: 100, color: "#9AE6B4" },
                          ],
                        }}
                        pointer={{
                          type: "blob",
                          color: "#222",
                          baseColor: "#fff",
                          strokeWidth: 2,
                          width: 25,
                          length: 0.45,
                          animate: true,
                          animationDuration: 2000,
                        }}
                        labels={{
                          valueLabel: {
                            formatTextValue: (value) => `${value.toFixed(1)}%`,
                            style: {
                              fill: textColor,
                              fontWeight: "bold",
                              fontSize: "26px",
                              textShadow: "none",
                            },
                          },
                          tickLabels: {
                            type: "outer",
                            ticks: [
                              { value: 0, label: "0%" },
                              { value: 50, label: "50%" },
                              { value: 100, label: "100%" },
                            ],
                            style: {
                              fill: gridColor,
                              fontSize: "14px",
                              textShadow: "none",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <Box mt="4">
                    <Flex justify="center" gap={4} wrap="wrap">
                      <Button colorScheme="blue" onClick={() => handleDelete(balanceReport)}>
                        Delete Report
                      </Button>
                      <Button
                        bg={primaryColor}
                        color="white"
                        _hover={{ bg: hoverColor }}
                        _active={{ bg: activeColor }}
                        onClick={() => navigate(`/admin/profile/balance-report/${user.id}`, { state: { balanceReport } })}
                      >
                        View Full Report
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </Grid>

          {usersWithReports.length === 0 && showEmptyMessage && (
            <Flex align="center" justify="center" direction="column" mt={6}>
              <WarningIcon boxSize="6" color="gray.500" mb="2" />
              <Text fontSize="lg" color="gray.500" textAlign="center">
                No Balance Reports found.
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                None of the users have interacted with any articles yet.
              </Text>
            </Flex>
          )}

          {/* Confirmation Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={{ base: "90%" }}>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete this balance report and all its data (interactions and recommendations)?
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={confirmDelete}>
                  Delete
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default MyBalanceReports;
