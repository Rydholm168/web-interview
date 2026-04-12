import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { host: '0.0.0.0', port: Number(process.env.PORT) || 3001 },
})

console.log(`Server running at ${url}`)
