import { ChakraProvider, Box, Text, Heading } from "@chakra-ui/react";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box p={6}>
        <Heading fontSize="3xl">Heading (Default Weight 700 → Nexa Heavy) POLITICAL HORIZON</Heading>

        <Text fontSize="md" fontWeight="300">
          Regular Text (300 → Nexa Regular) POLITICAL HORIZON
        </Text>

        <Text fontSize="xl" fontWeight="500">
          Bold Text (500 → Nexa Bold)
        </Text>

        <Text fontSize="xl" fontWeight="700">
          Heavy Text (700 → Nexa Heavy)
        </Text>

        <Text fontSize="xl" fontWeight="900">
          Black Text (900 → Nexa Black)
        </Text>

        <Text fontSize="xl" fontStyle="italic">
          Italic Regular Text (Uses Nexa-Regular-Italic.otf)
        </Text>

        <Text fontSize="xl" fontWeight="500" fontStyle="italic">
          Italic Bold Text (Uses Nexa-Bold-Italic.otf)
        </Text>

        <Text fontSize="xl" fontWeight="700" fontStyle="italic">
          Italic Heavy Text (Uses Nexa-Heavy-Italic.otf)
        </Text>

        <Text fontSize="xl" fontWeight="900" fontStyle="italic">
          Italic Black Text (Uses Nexa-Black-Italic.otf)
        </Text>
      </Box>
    </ChakraProvider>
  );
}

export default App;
