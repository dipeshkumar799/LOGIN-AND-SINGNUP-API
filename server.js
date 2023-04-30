import { ApolloServer } from "apollo-server"; //gql used to define Schema

import resolvers from "./util/resolver.js";
import typeDefs from "./Schema/Schema.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen().then(({ url }) => {
  console.log(`server is running ${url}`);
});
