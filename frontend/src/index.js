import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import App from './App'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3001/' }),
  cache: new InMemoryCache(),
})

const root = createRoot(document.getElementById('root'))
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
