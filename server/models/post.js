const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
	author:		{ type: String, required: true },
	location:	{ type: { x: Number, y: Number }, required: true },
	type:			{ type: String, required: true },
	title:		{ type: String, required: true },
	text:			{ type: String },
	picture:	{ type: String },
	video:		{ type: String },
	tags:			{ type: Array },
	likes:		{ type: [String], default: [] },
	comments:	{ type: [{ user: String, text: String }], default: [] },
	time:			{ type: String }
}, {
	collection:	"Post"
})

const Post = mongoose.model("Post", PostSchema)

module.exports = Post
