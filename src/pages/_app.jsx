import React from 'react'
import Head from 'next/head'
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'
import 'focus-visible/dist/focus-visible.min.js'
import 'normalize.css'
import 'public/static/styles/App.css'
import { SessionProvider } from 'next-auth/react'

const breakpoints = createBreakpoints({
  sm: '320px',
  md: '512px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
})

const theme = extendTheme({
  colors: {
    theme: {
      purple: '#666FC1',
      lightpurple: '#838CDF',
      faintpurple: '#CBCFEF',
      gray: '#E6E9EF',
      faintgray: 'rgba(230, 233, 239, .49)',
      red: '#FD4747',
      progress: { 500: '#666FC1' },
      subtitle: 'rgba(24, 27, 58, 0.55)',
    },
  },
  breakpoints,
})

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => (
  <SessionProvider session={session}>
    <ChakraProvider theme={theme}>
      <Head>
        <title>The Awakening</title>
      </Head>
      <div className="App">
        <Box className="Content" bgColor="theme.gray">
          <Component {...pageProps} />
        </Box>
      </div>
    </ChakraProvider>
  </SessionProvider>
)

export default MyApp
