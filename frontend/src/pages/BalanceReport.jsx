import React, { useState, useEffect } from "react";
import {
  VStack,
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
  Divider,
  SimpleGrid,
  IconButton,
  Badge,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Collapse,
  Spinner,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6";
import { Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { GiCapitol, GiBigWave, GiScales } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  const modelCardBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("black", "white");
  
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);
  const { colorMode, toggleColorMode } = useColorMode();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const [showTransparency, setShowTransparency] = useState(false);
  const toggleTransparency = () => setShowTransparency(!showTransparency);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/user/balance-report`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

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

  const outletColors = {
    "Fox News": useColorModeValue("#FED7D7", "#FEB2B2"),
    "Breitbart": useColorModeValue("#FED7D7", "#FEB2B2"),
    "USA Today": useColorModeValue("#FEFCBF", "#FAF089"),
    "Reuters": useColorModeValue("#FEFCBF", "#FAF089"),
    "ABC News": useColorModeValue("#FEFCBF", "#FAF089"),
    "CBS News": useColorModeValue("#FEFCBF", "#FAF089"),
    "NBC News": useColorModeValue("#FEFCBF", "#FAF089"),
    "The Guardian": useColorModeValue("#bee3f8", "#90cdf4"),
    "The New York Times": useColorModeValue("#bee3f8", "#90cdf4"),
    "Slate": useColorModeValue("#bee3f8", "#90cdf4"),
    "HuffPost": useColorModeValue("#bee3f8", "#90cdf4"),
    "Los Angeles Times": useColorModeValue("#bee3f8", "#90cdf4"),
    "NPR": useColorModeValue("#bee3f8", "#90cdf4"),
  };

  const headingText = useBreakpointValue({
    base: "This report provides a detailed analysis of your news consumption habits, including political exposure, and overall information balance.",
    lg: "This report provides a comprehensive analysis of your news consumption habits, including political exposure, reading engagement, source diversity, and overall information balance.",
  }); 

  const gridColor = useColorModeValue("#B0B0B0", "#888888");
  const axisColor = useColorModeValue("#4A4A4A", "#E0E0E0");

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
            <Flex align="center" justify="center" h="100vh">
              <Spinner size="xl" />
            <Text ml="4">Loading balance report details...</Text>
          </Flex>
          ) : report ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.5 }}
              >
                <Text mb="4" textAlign="justify">{headingText}</Text>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="2">Political Exposure & Engagement Breakdown</Heading>
                  <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing={4}>
                    {["LEFT", "CENTER", "RIGHT"].map((leaning) => (
                      <VStack key={leaning} spacing={2} align="center" p={3} borderRadius="md">
                        {/* Political Exposure Badge */}
                        <Badge
                          colorScheme={leaning === "RIGHT" ? "red" : leaning === "LEFT" ? "blue" : "yellow"}
                          p={2}
                          display="flex"
                          alignItems="center"
                          gap="2"
                          justifyContent="center"
                          width="full"
                        >
                          {getPoliticalIcon(leaning)}
                          <Text fontSize="sm" fontWeight="bold">
                            {leaning}: {((report.interactions[leaning] / Object.values(report.interactions).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%
                          </Text>
                        </Badge>

                        {/* Engagement Counters (Inline on Mobile, Below on Desktop) */}
                        <HStack spacing={4} mt={{ base: 0, lg: 2 }}>
                          {/* Likes Counter */}
                          <HStack>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                icon={<FaThumbsUp />}
                                aria-label="Likes"
                                colorScheme="green"
                                size="sm"
                              />
                            </motion.div>
                            <Text>{report.likes_dislikes[leaning].likes}</Text>
                          </HStack>

                          {/* Dislikes Counter */}
                          <HStack>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                icon={<FaThumbsDown />}
                                aria-label="Dislikes"
                                colorScheme="red"
                                size="sm"
                              />
                            </motion.div>
                            <Text>{report.likes_dislikes[leaning].dislikes}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    ))}
                  </SimpleGrid>
                </Box>
              </motion.div>

              <Divider mb="6" />

              {/* Reading Engagement & Intensity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="2">Reading Engagement Analysis</Heading>
                  <Box overflowX="auto" p="2" bg={modelCardBg} borderRadius="md" shadow="md">
                    <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                      <Thead>
                        <Tr>
                          <Th width="20%" textAlign="center">Leaning</Th>
                          <Th width="20%" textAlign="center">Avg Read Time (s)</Th>
                          <Th width="20%" textAlign="center">Fully Read (%)</Th>
                          <Th width="20%" textAlign="center">Quick Reads (%)</Th>
                          <Th width="20%" textAlign="center">Engagement Score</Th>
                        </Tr>
                      </Thead>
                      <Tbody as={motion.tbody}>
                        <AnimatePresence>
                          {["LEFT", "CENTER", "RIGHT"].map((leaning) => (
                            <motion.tr
                              key={leaning}
                              layout
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -50 }}
                              transition={{ duration: 0.5 }}
                            >
                              <Td fontWeight="semibold" textAlign="left">{leaning}</Td>
                              <Td textAlign="center">{report.avg_read_time[leaning]} sec</Td>
                              <Td textAlign="center">{report.engagement_metrics.fully_read[leaning]}%</Td>
                              <Td textAlign="center">{report.engagement_metrics.quick_reads[leaning]}%</Td>
                              <Td textAlign="center">{report.engagement_metrics.engagement_score}</Td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </Tbody>
                    </Table>
                  </Box>
                  <Text mt="4" mb="2" textAlign="justify">{report.reading_behavior_message}</Text>
                </Box>
              </motion.div>

              {/* Source Diversity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="2">Source Diversity</Heading>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={report.most_frequented_sources}>
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                      <XAxis dataKey="outlet" stroke={axisColor} />
                      <YAxis stroke={axisColor} />
                      <Tooltip />
                        <Bar dataKey="count" barSize={Math.min(150, 300 / report.most_frequented_sources.length)}>
                          {report.most_frequented_sources.map((source, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={outletColors[source.outlet] || "#ccc"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </motion.div>

              <Divider mb="6" />

              {/* Overall Information Balance */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="2">Overall Information Balance</Heading>
                  <Box overflowX="auto" p="2" bg={modelCardBg} borderRadius="md" shadow="md">
                    <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"}>
                      <Thead>
                        <Tr>
                          <Th textAlign="center">Metric</Th>
                          <Th textAlign="center">Value</Th>
                          <Th textAlign="center">Interpretation</Th>
                        </Tr>
                      </Thead>
                      <Tbody as={motion.tbody}>
                        <AnimatePresence>
                          <motion.tr
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Td fontWeight="semibold" textAlign="left">Shannon Entropy</Td>
                            <Td textAlign="center">{report.shannon_entropy}</Td>
                            <Td textAlign="center">Higher means more diverse consumption</Td>
                          </motion.tr>
                          <motion.tr
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                          >                        <Td fontWeight="semibold" textAlign="left">KL Divergence</Td>
                            <Td textAlign="center">{report.kl_divergence}</Td>
                            <Td textAlign="center">Closer to 0 means a more balanced reading</Td>
                          </motion.tr>
                        </AnimatePresence>
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </motion.div>

              {/* Balance Score */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="lg" color={textColor} mb="2" textAlign="center">
                    {(report.balance_score * 100).toFixed(1)}%
                  </Heading>
                  <Text textAlign="justify">{report.balance_message}</Text>
                </Box>
              </motion.div>
            </>
          ) : (
            <Text>Error loading report data.</Text>
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
                    base: "Horizon Balance generates this report based on your interactions with Horizon Explore and the news recommendations you've received.",
                    lg: "Horizon Balance generates this comprehensive report by analyzing your interactions within Horizon Explore, including how you engage with recommended articles. It helps you to better understand your news consumption patterns.",
                  })}
                </Text>
                <Text mt={2} fontSize="sm" textAlign="justify">
                  {useBreakpointValue({
                    base: "It helps you understand your exposure and preferences in a transparent and structured way.",
                    lg: "By combining engagement signals with content diversity metrics, Horizon Balance empowers you to reflect on your reading habits and encourages a more balanced and open news consumption experience. This transparency is key to fostering critical thinking and reducing ideological bias.",
                  })}
                </Text>
              </Box>
            </Collapse>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default BalanceReport;
