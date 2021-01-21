require("dotenv-defaults").config();

const { GraphQLServer, PubSub } = require('graphql-yoga')
const { Query } = require("./resolvers/Query")
const { Mutation } = require("./resolvers/Mutation")
const { Subscription } = require("./resolvers/Subscription")

const mongoose = require("mongoose");

const Post = require("./models/post")
const User = require("./models/user")

const pubsub = new PubSub()

if (!process.env.MONGO_URL) {
	console.error("Missing MONGO_URL!!!");
	process.exit(1);
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

const server = new GraphQLServer({
	typeDefs: "./server/schema.graphql",
	resolvers: {
		Query,
		Mutation,
		Subscription
	},
	context: {
		db,
		pubsub
	}
})

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')

	server.start({ port: process.env.PORT | 4000 , bodyParserOptions: { limit: "64mb"}}, () => {
        console.log(`The server is up on port ${process.env.PORT | 4000}!`)
    })
})
