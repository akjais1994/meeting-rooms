import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client"

const httpLink = new HttpLink({
    uri: "http://smart-meeting.herokuapp.com",
});

const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        token: "B0R9xG6VWk7ZqcBDWmbCcUJk/41/1b2dDHqv00StxCM=",
      }
    });
  
    return forward(operation);
  })

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authMiddleware, httpLink]),
})
