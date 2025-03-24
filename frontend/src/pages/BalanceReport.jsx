import React, { useState, useEffect, useRef } from "react";
import {
  HStack,
  Stack,
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
import { SunIcon, MoonIcon, InfoOutlineIcon, LockIcon, RepeatIcon } from "@chakra-ui/icons";
import { 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Radar, 
  RadarChart, 
  Tooltip, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer 
} from "recharts";
import GaugeComponent from "react-gauge-component";
import { GiCapitol, GiBigWave, GiScales } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import logoBalanceBright from "../assets/logo-balance-bright.png";
import logoBalanceDark from "../assets/logo-balance-dark.png";

const BalanceReport = () => {
  // For development only
  const BACKEND_URL = `${window.location.protocol}//${window.location.hostname}:5001`;

  // For production
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const logo = useColorModeValue(logoBalanceBright, logoBalanceDark);
  const logoHeight = useBreakpointValue({ base: '28px', md: '33px' });

  const { colorMode, toggleColorMode } = useColorMode();

  const cardBg = useColorModeValue("white", "gray.700");
  const modelCardBg = useColorModeValue("gray.50", "gray.800");
  const transparencyColor = useColorModeValue("gray.500", "gray.400");
  const textColor = useColorModeValue("black", "white");
  
  const fillColor = useColorModeValue("#A0AEC0", "#CBD5E0");
  const backgroundColor = useColorModeValue("#ffffff", "#1A202C");
  const graphColor = useColorModeValue("#1A202C", "#EDF2F7");
  const borderColor =useColorModeValue("#CBD5E0", "#4A5568");

  const labelColor = useColorModeValue("#2D3748", "#E2E8F0");

  const hasFetched = useRef(false);
  const [userStatus, setUserStatus] = useState(null);
  const [isEngagementFlipped, setIsEngagementFlipped] = useState(false);

  const frontRef = useRef(null);
  const [frontHeight, setFrontHeight] = useState(0);

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const [showTransparency, setShowTransparency] = useState(false);
  const toggleTransparency = () => setShowTransparency(!showTransparency);

  const transparencyText = useBreakpointValue({
    base: "Horizon Balance generates this report based on your interactions with Horizon Explore and the news recommendations you've received.",
    lg: "Horizon Balance generates this comprehensive report by analyzing your interactions within Horizon Explore, including how you engage with recommended articles. It helps you to better understand your news consumption patterns.",
  }); 
  const moreTransparencyText = useBreakpointValue({
    base: "It helps you understand your exposure and preferences in a transparent and structured way.",
    lg: "By combining engagement signals with content diversity metrics, Horizon Balance empowers you to reflect on your reading habits and encourages a more balanced and open news consumption experience. This transparency is key to fostering critical thinking and reducing ideological bias.",
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
    }
  };

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

  useEffect(() => {
    const updateHeight = () => {
      if (frontRef.current) {
        setFrontHeight(frontRef.current.offsetHeight);
      }
    };
  
    const resizeObserver = new ResizeObserver(updateHeight);
    if (frontRef.current) {
      resizeObserver.observe(frontRef.current);
    }
  
    window.addEventListener('resize', updateHeight);
  
    // Llamada inicial tras pequeño delay por animaciones
    setTimeout(updateHeight, 200);
  
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
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
    "Fox News": "#FEB2B2",
    "Breitbart": "#FEB2B2",
    "USA Today": "#FAF089",
    "Reuters": "#FAF089",
    "ABC News": "#FAF089",
    "CBS News": "#FAF089",
    "NBC News": "#FAF089",
    "The Guardian": "#90cdf4",
    "The New York Times": "#90cdf4",
    "HuffPost": "#90cdf4",
    "Los Angeles Times": "#90cdf4",
    "NPR": "#90cdf4",
  };

  const topOutletData = report?.most_frequented_sources?.length
  ? report.most_frequented_sources.reduce(
      (max, item) => (item.count > max.count ? item : max),
      { outlet: "", count: 0 }
    )
  : { outlet: "", count: 0 };
  
  const radarColor = outletColors[topOutletData.outlet];

  const headingText = useBreakpointValue({
    base: "This report provides a detailed analysis of your news consumption habits, including political exposure, and overall information balance.",
    lg: "This report provides a comprehensive analysis of your news consumption habits, including political exposure, reading engagement, source diversity, and overall information balance.",
  }); 

  const gridColor = useColorModeValue("#B0B0B0", "#888888");
  const axisColor = useColorModeValue("#4A4A4A", "#E0E0E0");

  const xAxisAngle = useBreakpointValue({ base: -45, md: 0, lg: 0 });
  const xAxisFontSize = useBreakpointValue({ base: 9, md: 11, lg: 13 });

  const xAxisTickProps = useBreakpointValue({
    base: { angle: 0, textAnchor: "middle", fontSize: 9, fontWeight: "bold", fill: textColor },
    md: { angle: 0, textAnchor: "middle", fontSize: 11, fontWeight: "bold", fill: textColor },
    lg: { angle: 0, textAnchor: "middle", fontSize: 13, fontWeight: "bold", fill: textColor },
  });

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
          ) : userStatus === "new" ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.5 }}
            >
              <Flex align="center" justify="center" direction="column" h={{ base: "auto", md: "20vh" }}>
                <LockIcon boxSize="6" color="gray.500" mb="2" />
                <Text fontSize="lg" color="gray.500" textAlign="center">
                  Like or read a few articles to unlock this feature.
                </Text>
                <Text fontSize="md" color="gray.400" textAlign="center" mb="2">
                  To access your Balance Report, please interact with a few articles in Horizon Explore. Once interactions are recorded, your personalized report will be generated automatically and available here.
                </Text>
              </Flex>
            </motion.div>
          ) : report ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.5 }}
              >
                <Text mb="4" textAlign="justify">{headingText}</Text>
              </motion.div>

              {/* Political Exposure */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="4">Political Exposure</Heading>
                  <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} spacing={4} mb="6">
                    {["LEFT", "CENTER", "RIGHT"].map((leaning) => (
                      <Badge
                        key={leaning}
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
                    ))}
                  </SimpleGrid>
                </Box>
              </motion.div>

              <Divider mb="6" />

              {/* Reading Engagement */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="4">Reading Engagement Analysis</Heading>
                  <Box position="relative" minHeight={`${frontHeight}px`} perspective="1000px">
                    <motion.div
                      style={{
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                        position: "relative",
                      }}
                      animate={{ rotateY: isEngagementFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Front Side */}
                      <Box
                        ref={frontRef}
                        overflowX="auto"
                        p="2"
                        bg={modelCardBg}
                        borderRadius="md"
                        shadow="md"
                        position="absolute"
                        width="100%"
                        minHeight="fit-content"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
                          <Thead>
                            <Tr>
                              <Th width="20%" textAlign="center">Leaning</Th>
                              <Th width="20%" textAlign="center">Avg Read Time (s)</Th>
                              <Th width="20%" textAlign="center">Fully Read (%)</Th>
                              <Th width="20%" textAlign="center">Quick Reads (%)</Th>
                              <Th width="20%" textAlign="center">
                                <Flex justify="center" align="center" gap="1">
                                  <Text>Engagement Score</Text>
                                  <IconButton
                                    size="xs"
                                    icon={<InfoOutlineIcon />}
                                    onClick={() => setIsEngagementFlipped(true)}
                                    aria-label="Info"
                                  />
                                </Flex>
                              </Th>
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
                                  <Td textAlign="center">{report.engagement_metrics.engagement_score[leaning]}</Td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </Tbody>
                        </Table>
                      </Box>

                      {/* Back Side */}
                      <Box
                        overflowX="auto"
                        p="4"
                        bg={modelCardBg}
                        borderRadius="md"
                        shadow="md"
                        position="absolute"
                        width="100%"
                        height="100%"
                        minHeight={`${frontHeight}px`}           
                        transform="rotateY(180deg)"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <Flex direction="column" justify="center" align="center" height="100%">
                          <Box>
                            <Heading size="md" textAlign="center" mb="4">
                              How is it Calculated?
                            </Heading>

                            <Flex direction="column" align="center" justify="center" gap="2">
                              <Text fontSize="md" textAlign="center">
                                The <strong>Engagement Score</strong> measures how deeply you read articles.
                              </Text>
                              <Text fontSize="md" textAlign="center">
                                A <strong>full read</strong> is counted when you spend <strong>60 seconds or more</strong> on an article.
                              </Text>
                              <Text fontSize="md" textAlign="center">
                                <strong>Quick reads</strong> are under 60 seconds.
                              </Text>
                              <Text fontSize="md" textAlign="center">
                                The score reflects the <strong>percentage of full reads</strong>.
                              </Text>
                            </Flex>
                          </Box>

                          <Flex justify="center" mt="4">
                            <IconButton
                              size="sm"
                              icon={<RepeatIcon />}
                              onClick={() => setIsEngagementFlipped(false)}
                              aria-label="Back"
                            />
                          </Flex>
                        </Flex>
                      </Box>
                    </motion.div>
                  </Box>
                  <Text mt="4" mb="2" textAlign="justify">{report.reading_behavior_message}</Text>
                </Box>
              </motion.div>

              <Divider mb="6" />

              {/* Source Diversity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Box mb="4">
                  <Heading size="md" mb="4">Source Diversity</Heading>  
                  <Stack direction={{ base: "column", xl: "row" }} spacing={3}>
                    <Box flex="1" minW="0">
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={report.time_read_per_outlet}>
                          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                          <XAxis dataKey="outlet"
                            stroke={axisColor}
                            interval={0}
                            angle={xAxisAngle}
                            textAnchor={xAxisAngle ? "end" : "middle"}
                            height={xAxisAngle ? 60 : 30}
                            fontSize={xAxisFontSize}
                            fontWeight= "bold"
                            fill= {textColor}
                            tickFormatter={(name) => name.length > 15 ? name.slice(0, 10) + "…" : name}
                          />
                          <YAxis stroke={axisColor} />
                          <Tooltip
                            formatter={(value) => `${value} sec`}
                            labelFormatter={(label) => `Outlet: ${label}`}
                            cursor={{
                              fill: fillColor,
                              fillOpacity: 0.2,
                            }}
                            contentStyle={{
                              backgroundColor: backgroundColor,
                              color: graphColor,
                              border: "1px solid",
                              borderColor: borderColor,
                              borderRadius: "6px",
                              fontSize: "14px",
                            }}
                            labelStyle={{
                              color: labelColor,
                              fontWeight: "bold",
                            }}
                            itemStyle={{
                              color: labelColor,
                              fontSize: "13px",
                            }}
                          />
                          <Bar
                            dataKey="time_read_seconds"
                            barSize={Math.min(150, 300 / report.time_read_per_outlet.length)}
                          >
                            {report.time_read_per_outlet.map((source, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={outletColors[source.outlet] || "#ccc"}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <Text fontSize="md" textAlign="justify">
                        {`${report.time_read_per_outlet[0].outlet} is the source you spend the most time reading, with a total of ${report.time_read_per_outlet[0].time_read_seconds} seconds.`}
                      </Text>
                    </Box>

                    <Box flex="1" minW="0">
                      {report.most_frequented_sources.length > 2 ? (
                        <> 
                          <ResponsiveContainer width="100%" height={400}>
                            <RadarChart
                              cx="50%"
                              cy="50%"
                              outerRadius="80%"
                              data={report.most_frequented_sources}
                            >
                              <PolarGrid stroke={gridColor} strokeDasharray="3 3"/>
                              <PolarAngleAxis dataKey="outlet" stroke={axisColor} tick={xAxisTickProps} />
                              <PolarRadiusAxis stroke={axisColor} tick={{ fontSize: 12 }} />
                              <Tooltip
                                cursor={{
                                  fill: fillColor,
                                  fillOpacity: 0.2,
                                }}
                                contentStyle={{
                                  backgroundColor: backgroundColor,
                                  color: graphColor,
                                  border: "1px solid",
                                  borderColor: borderColor,
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                }}
                                labelStyle={{
                                  color: labelColor,
                                  fontWeight: "bold",
                                }}
                                itemStyle={{
                                  color: labelColor,
                                  fontSize: "13px",
                                }}
                              />
                              <Radar
                                name="Exposure"
                                dataKey="count"
                                stroke={radarColor}
                                fill={radarColor}
                                fillOpacity={0.4}
                                strokeWidth={2}
                                dot={true}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                          <Text fontSize="md" textAlign="justify">
                            {`Based on your interaction frequency, ${report.most_frequented_sources[0].outlet} is the source you visit most often.`}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Flex align="center" justify="center" direction="column">
                            <LockIcon boxSize="6" color="gray.500" mb="2" />
                            <Text fontSize="md" color="gray.500" textAlign="center">
                              In order to provide a more detailed analysis of your source diversity, please interact with more articles.
                            </Text>
                          </Flex>
                        </>
                      )}
                    </Box>
                  </Stack>
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
                  <Heading size="md" mb="4">Overall Information Balance</Heading>
                  <Box overflowX="auto" p="2" bg={modelCardBg} borderRadius="md" shadow="md">
                    <Table colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"} mb="4">
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
                            key="entropy"
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
                            key="kl"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Td fontWeight="semibold" textAlign="left">KL Divergence</Td>
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
                  <GaugeComponent
                    key={colorMode}
                    type="semicircle"
                    value={report.balance_score * 100}
                    minValue={0}
                    maxValue={100}
                    style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}
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
                    <Text textAlign="center">{report.balance_message}</Text>
                </Box>
              </motion.div>
            </>
          ) : (
            <Text fontSize="md" color="gray.400" textAlign="center">Error loading report data.</Text>
          )}

          {/* Transparency Section */}
          <Flex direction="column">
            <Flex align="center" cursor="pointer" onClick={toggleTransparency} color={transparencyColor}>
              <InfoOutlineIcon />
              <Text fontSize="sm" fontWeight="bold" ml={2}>
                More Information and Details
              </Text>
            </Flex>
            <Collapse in={showTransparency}>
              <Box mt={4} p={4} borderRadius="md" bg={modelCardBg}>
                <Text fontSize="sm" textAlign="justify">
                  {transparencyText}
                </Text>
                <Text mt={2} fontSize="sm" textAlign="justify">
                  {moreTransparencyText}
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
