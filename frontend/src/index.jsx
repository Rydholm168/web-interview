import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { CssBaseline, GlobalStyles, ThemeProvider, createTheme } from '@mui/material'
import App from './App'

const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3001/' }),
  cache: new InMemoryCache(),
})

const theme = createTheme({
  typography: {
    fontFamily: 'ballinger, sans-serif',
    button: { fontFamily: 'ballinger, sans-serif' },
  },
})

const root = createRoot(document.getElementById('root'))
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles
      styles={{
        body: { fontFamily: 'ballinger, sans-serif' },
      }}
    />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ThemeProvider>
)
