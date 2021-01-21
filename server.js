const express = require('express');
const path = require('path');
const port = process.env.PORT || 80;
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

const bodyParser = require('body-parser')
const apiRoute = require('./src/route/api');
app.use('/api', apiRoute);
app.use(bodyParser.json());

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);
console.log("Server Ready!")

//--------

require("dotenv-defaults").config();

const { GraphQLServer, PubSub } = require('graphql-yoga')
const { Query } = require("./server/resolvers/Query")
const { Mutation } = require("./server/resolvers/Mutation")
const { Subscription } = require("./server/resolvers/Subscription")

const mongoose = require("mongoose");

const Post = require("./server/models/post")
const User = require("./server/models/user")

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

	server.start({ port: process.env.PORT || 4000 , bodyParserOptions: { limit: "64mb"}}, () => {
        console.log(`The server is up on port ${process.env.PORT | 4000}!`)
    })
})
