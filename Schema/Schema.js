import { gql } from "apollo-server";
const typeDefs = gql`
  type Query {
    users: [User!]
    user(id: String!): User!
  }
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    isLoggedIn: Boolean!
  }
  type Mutation {
    signUp(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User

    verifyOtp(otp: Int!, email: String!): User!
    update(id: String!, firstName: String!, lastName: String!): User!
    deleteData(id: String!): User!
    logIn(
      email: String!

      password: String!
    ): User
    forgetPassword(email: String!): String!
    changePassword(
      email: String!
      currentpassword: String!
      newpassword: String!
    ): User!
    logout(id: String!): User
  }
`;
export default typeDefs;
