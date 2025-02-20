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
  FaShieldAlt,
  FaRobot,
  FaGlobe,
  FaBolt,
  FaSearch,
  FaBookOpen,
  FaCheckCircle,
  FaTasks,
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
    base: "FactGuard supports transparency for fake news detection and claim verification. Join a community committed to accuracy.",
    md: "FactGuard supports transparency with state-of-the-art tools for fake news detection, claim verification, and responsible content sharing. By leveraging Deep Learning, it is able to detect misinformation and uphold accuracy across the globe. Join a community committed to building a trustworthy and reliable media ecosystem.",
  });

  const discoverText = useBreakpointValue({
    base: "FactGuard combats misinformation with powerful AI tools. Leverage real-time fact-checking to promote trust.",
    md: "Our tools are designed to combat misinformation and empower users worldwide. Leverage our advanced DL-driven solutions to promote factual content and foster trust. FactGuard is not just a tool—it’s a commitment to ensuring the credibility of online information.",
  });

  const discoverTextLg = useBreakpointValue({
    lg: "With FactGuard, you’ll access real-time fact-checking capabilities, educational resources, and a global network of verification partners. Whether you’re an individual, a team, or an organization, FactGuard is here to help you navigate a world of information with confidence.",
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
          <Box w={{ base: '100%', md: '55%' }} textAlign={{ base: 'center', md: 'left' }}>
            <Heading mb="4" fontSize={{ base: '3xl', md: '4xl' }}>
              Discover the Power of FactGuard
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
            alt="Fake news detection illustration"
            w={{ base: '66%', sm: '46%' ,md: '41%', lg: '36%', xl: '26%' }}
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
          <Heading mb="4" fontSize={{ base: '2xl', md: '3xl' }}>Empowering Truth in a World of Noise</Heading>
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
            Empowering Truth
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
            Fact-Checking Simplified
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
            Verify Claims Instantly
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
            AI-Powered Verification
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
            Promoting Media Literacy
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
          Why Choose FactGuard?
        </Heading>
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
          {[
          {
              icon: FaShieldAlt,
              title: 'AI-Powered Security',
              text: 'Secure, accurate fact-checking using ML algorithms.',
          },
          {
              icon: FaSearch,
              title: 'Real-Time Fact Checking',
              text: 'Quickly verify the authenticity of content in real time.',
          },
          {
              icon: FaRobot,
              title: 'AI Efficiency',
              text: 'Let AI handle the heavy lifting to save you time.',
          },
          {
              icon: FaGlobe,
              title: 'Global Coverage',
              text: 'Access a global network of fact-checking partners.',
          },
          {
              icon: FaBookOpen,
              title: 'Educational Resources',
              text: 'Learn tools and techniques to identify misinformation.',
          },
          {
              icon: FaBolt,
              title: 'Instant Results',
              text: 'Fast, actionable insights for media professionals.',
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
        <Heading mb="3" textAlign="center" fontSize={{ base: '2xl', md: '3xl' }}>
              Benefits of Using FactGuard
        </Heading>
        <HStack
            align="center"
            spacing={{ base: 8, md: 12, lg: 16, xl: 24 }} 
            flexDirection={{ base: 'column', md: 'column', lg: 'row' }}
            w="100%"
          >
            <Image
              src={benefitsImage}
              alt="FactGuard benefits illustration"
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
                          <FaCheckCircle />
                        </Box>
                        <Heading size="md">Enhanced Content Trust</Heading>
                      </HStack>
                      <Text fontSize={{ base: 'sm', md: 'md' }}>
                        {useBreakpointValue({
                          base: "Build trust in your brand by ensuring the authenticity of your content.",
                          lg: "Build trust in your brand by ensuring the authenticity of your content. With FactGuard's tools, you can confidently share verified information with your audience.",
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
                          <FaTasks />
                        </Box>
                        <Heading size="md">Comprehensive Fact-Checking</Heading>
                      </HStack>
                      <Text fontSize={{ base: 'sm', md: 'md' }}>
                        {useBreakpointValue({
                          base: "Build trust in your brand by ensuring the authenticity of your content.",
                          lg: "Utilize advanced tools to verify claims and enhance credibility. FactGuard provides accurate results to support your decisions and messaging.",
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
                          base: "Save time and resources with automated fake news detection processes.",
                          lg: "Save time and resources with automated fake news detection processes. Let our intelligent systems streamline your fact-checking efforts.",
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
          <Heading mb="4" fontSize={{ base: '2xl', md: '3xl' }}>Be Part of the Solution</Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} mb="3">
            Empower yourself and your community by promoting factual, unbiased content.
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
