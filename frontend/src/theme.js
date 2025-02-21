import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.100', 'gray.900')(props),
        color: mode('black', 'white')(props),
        fontFamily: 'Plus Jakarta Sans, serif'
      },
    }),
  },
  fonts: {
    heading: 'Plus Jakarta Sans, serif',
    body: 'Plus Jakarta Sans, serif',
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 700,
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 500,
      },
    },
    Menu: {
      baseStyle: {
        list: {
          fontWeight: 500,
        },
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          fontWeight: 500,
        },
      },
    },
    Link: {
      baseStyle: {
        fontWeight: 500,
      },
    },
  },
  breakpoints: {
    sm: '30em',  // 480px
    md: '48em',  // 768px
    lg: '62em',  // 992px
    xl: '80em',  // 1280px
    '2xl': '90em', // 1440px
  },
});

export default theme;
