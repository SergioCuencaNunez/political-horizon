import React from 'react';
import { motion } from "framer-motion";

import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Box p="6" mx="auto">
        <Heading mb="4">About FactGuard</Heading>
        <VStack spacing="4" align="flex-start">
          <Text>
            FactGuard is an advanced tool designed to detect fake news and verify claims in real time.
          </Text>
          <Text>
            It uses state-of-the-art AI models like BERT and RoBERTa for news detection and the Google FactCheck API for claim verification.
          </Text>
          <Text>
            When direct matches are unavailable, FactGuard leverages sophisticated semantic analysis through large language models (LLMs).
          </Text>
        </VStack>
      </Box>
    </motion.div>
  );
};

export default About;