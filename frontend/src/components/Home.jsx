import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
  Button,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  FaBalanceScale,
  FaChartPie,
  FaUsers,
  FaRegLightbulb,
  FaSyncAlt,
  FaGlobe,
  FaHandshake,
  FaRegNewspaper,
  FaBrain
} from 'react-icons/fa';
import Marquee from 'react-fast-marquee';
import { motion } from "framer-motion";

import discoverBright from '../assets/discover-bright.png';
import discoverDark from '../assets/discover-dark.png';
import benefitsBright from '../assets/benefits-bright.png';
import benefitsDark from '../assets/benefits-dark.png';

const Home = () => {
  const primaryColorLight = '#c6001e';
  const primaryColorDark = '#cf2640';
  const primaryHoverLight = '#b0001a';
  const primaryHoverDark = '#d83a52';
  const primaryActiveLight = '#970016';
  const primaryActiveDark = '#e14f64';

  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const hoverColor = useColorModeValue(primaryHoverLight, primaryHoverDark);
  const activeColor = useColorModeValue(primaryActiveLight, primaryActiveDark);

  const gradient = 'linear(to-r, #2a3a4a, #34495d, #3f5c76)';

  const boxBg = useColorModeValue('white', 'gray.700');
  const boxColor = useColorModeValue('black', 'white');

  const discoverImage = useColorModeValue(discoverBright, discoverDark);
  const benefitsImage = useColorModeValue(benefitsBright, benefitsDark);
  
  const heroText = useBreakpointValue({
    base: "Political Horizon promotes balanced and diverse political news recommendations. Join our community to experience news differently.",
    md: "Political Horizon integrates advanced hybrid recommendation techniques combining Collaborative and Content-Based Filtering to ensure personalized yet diverse news exposure. Through bias mitigation approaches, we aim to break ideological silos, foster understanding across political spectrums, and support a balanced, informed democracy."
  });

  const discoverText = useBreakpointValue({
    base: "Political Horizon uses innovative strategies to reduce bias in political news recommendations.",
    md: "Our hybrid recommendation system employs Controlled Exposure and Diversified Relevance techniques to balance personalized content with exposure to diverse political viewpoints. We aim to minimize ideological echo chambers, promoting informed and well-rounded political discourse."
  });

  const discoverTextLg = useBreakpointValue({
    lg: "With Political Horizon, users experience a uniquely balanced news environment, continuously evaluated using metrics like Shannon entropy and the Gini index. Whether you lean left, right, or center, our system ensures a fair and transparent approach to news consumption, empowering you with comprehensive perspectives."
  });

  
  return (
    <VStack spacing="10" px={{ base: '0', xl: '5' }} w="100%">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <HStack
          align="center"
          justify="space-between"
          w="100%"
          flexWrap={{ base: 'wrap', md: 'nowrap' }}
        >
          <Box w={{ base: '100%', md: '60%' }} textAlign={{ base: 'center', md: 'left' }}>
            <Heading mb="4" fontSize={{ base: '3xl', md: '4xl' }}>
              Breaking Bias, Building Balance
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} mb="3">
              {discoverText}
            </Text>
            <Text fontSize={{ md: 'lg' }} mb="3">
              {discoverTextLg}
            </Text>
          </Box>
          <Image
            src={discoverImage}
            alt="Politician Illustration"
            w={{ base: '60%', sm: '55%' ,md: '40%', lg: '35%', xl: '26%' }}
            mx={{ base: 'auto', md: '0' }}
          />
        </HStack>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bgGradient={gradient}
          color="white"
          p={{ base: '6', md: '10' }}
          borderRadius="md"
          textAlign="center"
        >
          <Heading mb="4" fontSize={{ base: '2xl', md: '3xl' }}>Balancing Perspectives in Political News</Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} mb="3">
            {heroText}
          </Text>
          <a href="/signup" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                _active={{ bg: activeColor }}
                size="md"
              >
                Get Started
              </Button>
            </motion.div>
          </a>
        </Box>
      </motion.div>

      {/* Marquee Section */}
      <Box
        w="100%"
        overflow="hidden"
        position="relative"
        bgGradient={useColorModeValue(
          'linear(to-r, gray.100, gray.300)',
          'linear(to-r, gray.700, gray.900)'
        )}
        borderTop="2px solid"
        borderBottom="2px solid"
        borderColor={useColorModeValue('gray.300', 'gray.600')}
        py="5"
      >
        <Marquee speed={125} autoFill={true} >
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue('gray.800', 'gray.100')}
            style={{
              marginRight: '50px',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
            }}
          >
            Balanced Perspectives
          </Text>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue('gray.800', 'gray.100')}
            style={{
              marginRight: '50px',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
            }}
          >
            Diverse Exposure
          </Text>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue('gray.800', 'gray.100')}
            style={{
              marginRight: '50px',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
            }}
          >
            Breaking Echo Chambers
          </Text>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue('gray.800', 'gray.100')}
            style={{
              marginRight: '50px',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
            }}
          >
            Innovative Recommendations
          </Text>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={useColorModeValue('gray.800', 'gray.100')}
            style={{
              marginRight: '50px',
              whiteSpace: 'nowrap',
              lineHeight: '1.5',
            }}
          >
            Fair News Environment
          </Text>
        </Marquee>
      </Box>
        
      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <Heading mb="6" textAlign="center" fontSize={{ base: '2xl', md: '3xl' }}>
          Why Choose Political Horizon?
        </Heading>
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
          {[
          {
              icon: FaBalanceScale,
              title: 'Balanced Recommendations',
              text: 'Delivering a balanced mix of news from various political leanings.',
          },
          {
              icon: FaChartPie,
              title: 'Diversity Metrics',
              text: 'Evaluated using Shannon entropy and Gini index to ensure diverse perspectives.',
          },
          {
              icon: FaUsers,
              title: 'User-Centric Design',
              text: 'Personalized news experiences tailored to your interests with enhanced diversity.',
          },
          {
              icon: FaRegLightbulb,
              title: 'Innovative Techniques',
              text: 'Combines hybrid methods to mitigate biases effectively.',
          },
          {
              icon: FaSyncAlt,
              title: 'Continuous Improvement',
              text: 'Regular assessment and refinement to adapt to evolving user needs.',
          },
          {
              icon: FaGlobe,
              title: 'Broad Perspectives',
              text: 'Ensures exposure to a wide array of political viewpoints globally.',
          },
          ].map((feature, index) => (
            <GridItem key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ height: '100%' }}
              >
                <Box
                  p="5"
                  bg={boxBg}
                  color={boxColor}
                  shadow="md"
                  borderRadius="md"
                  textAlign="center"
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                >
                  <HStack justify="center" spacing="3" mb="5">
                    <Box fontSize={{ base: 'md', md: 'lg' }} color={primaryColor}>
                      <feature.icon />
                    </Box>
                    <Heading size={{ base: 'sm', md: 'md' }}>{feature.title}</Heading>
                  </HStack>
                  <Text fontSize={{ base: 'sm', md: 'md' }}>{feature.text}</Text>
                </Box>
              </motion.div>
            </GridItem>
          ))}
        </Grid>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <Heading mb="6" textAlign="center" fontSize={{ base: '2xl', md: '3xl' }}>
              Benefits of Using Political Horizon
        </Heading>
        <HStack
            align="center"
            spacing={{ base: 8, md: 12, lg: 16, xl: 24 }} 
            flexDirection={{ base: 'column', md: 'column', lg: 'row' }}
            w="100%"
          >
            <Image
              src={benefitsImage}
              alt="Political Horizon Benefits Illustration"
              w={{ base: '67%', sm: '47%' ,md: '42%', lg: '37%', xl: '27%' }}
              mx={{ base: 'auto', md: '0' }}
              flexShrink={0}
            />
            <VStack spacing="8" align="flex" w="100%">
              <Grid templateColumns={{ base: '1fr', md: '1fr' }} gap={6}>
                <GridItem>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Box
                      p="5"
                      bg={boxBg}
                      color={boxColor}
                      shadow="md"
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                    >
                      <HStack justify="start">
                        <Box fontSize={{ base: 'md', md: 'lg' }} color={primaryColor}>
                          <FaHandshake />
                        </Box>
                        <Heading size="md">Reduced Polarization</Heading>
                      </HStack>
                      <Text fontSize={{ base: 'sm', md: 'md' }}>
                        {useBreakpointValue({
                          base: "Decrease polarization by exposing users to diverse political views consistently.",
                          lg: "Decrease polarization by exposing users to diverse political views consistently. Political Horizon's hybrid system ensures balanced news exposure, helping users break free from ideological echo chambers.",
                        })}

                      </Text>
                    </Box>
                  </motion.div>
                </GridItem>
                <GridItem>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Box
                      p="5"
                      bg={boxBg}
                      color={boxColor}
                      shadow="md"
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                      style={{ height: '100%' }}
                    >
                      <HStack justify="start">
                        <Box fontSize={{ base: 'md', md: 'lg' }} color={primaryColor}>
                          <FaRegNewspaper />
                        </Box>
                        <Heading size="md">Balanced Information</Heading>
                      </HStack>
                      <Text fontSize={{ base: 'sm', md: 'md' }}>
                        {useBreakpointValue({
                          base: "Access balanced news, fostering a well-rounded understanding of key issues.",
                          lg: "Access balanced news, fostering a well-rounded understanding of key issues. Our Controlled Exposure Strategy carefully integrates diverse political content, promoting informed decision-making.",
                        })}

                      </Text>
                    </Box>
                  </motion.div>
                </GridItem>
                <GridItem>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Box
                      p="5"
                      bg={boxBg}
                      color={boxColor}
                      shadow="md"
                      borderRadius="md"
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                    >
                      <HStack justify="start">
                        <Box fontSize={{ base: 'md', md: 'lg' }} color={primaryColor}>
                          <FaBrain />
                        </Box>
                        <Heading size="md">AI-Powered Efficiency</Heading>
                      </HStack>
                      <Text fontSize={{ base: 'sm', md: 'md' }}>
                        {useBreakpointValue({
                          base: "Leverage AI to personalize news and efficiently diversify your feed.",
                          lg: "Leverage AI to personalize news and efficiently diversify your feed. Our hybrid recommender streamlines the process, delivering personalized yet diverse content seamlessly.",
                        })}
                      </Text>
                    </Box>
                  </motion.div>
                </GridItem>
              </Grid>
            </VStack>
        </HStack>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bgGradient={gradient}
          color="white"
          p="10"
          borderRadius="md"
          textAlign="center"
        >
          <Heading mb="4" fontSize={{ base: '2xl', md: '3xl' }}>Be Part of the Change</Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} mb="3">
            Join us in fostering balanced news environments and enriching public debate.
          </Text>
          <Link to="/about">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                _active={{ bg: activeColor }}
              >
                Learn More
              </Button>
            </motion.div>
          </Link>
        </Box>
      </motion.div>
    </VStack>
  );
};

export default Home;
