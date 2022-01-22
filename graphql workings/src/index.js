import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db"
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Comment,
    Post
  },
  context: {
    db,
    pubsub
  },
});

server.start((setup) => {
  console.log("The server is up on " + setup.port);
});

// GRAPHQL 101 Notes
// graph-ql types are made up of scalar and custom types 
// scalar types include Int, Boolean, String, Float and ID while custom types includes one or more combinations of scalar types as an object

// Demonstrating use of resolver parameters
// greeting(parent, args, ctx, info) {  // resolver arguments. parent contains relational data, 
    //     // args contains arguments passed down from the query,
    //     //  ctx contains contextual data, can retrieve ID of logged in user
    //     // info contains information sent from the client 
    //   if (args.name && args.position) {
    //     return `Hello ${args.name}, You are my favourite ${args.position}`;
    //   } else {
    //     return "Hello";
    //   }
    // },
    // grades(parent, args, ctx, info) {s
    //   return [99, 80, 93];
    // },

    // the graphql enum type helps us to model data that are sets of constants. therefore the returned value must be one of the set of enum types.