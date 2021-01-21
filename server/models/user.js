const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	usertype:		{ type: String, required: true },
	name:			{	type: String, required: true },
	account:		{ type: String, required: true, unique: true },
	email:			{ type: String, required: true },
	password:		{ type: String, required: true },
	picture:		{ type: String },
	age:			{ type: Number },
	phone:			{ type: String },
	address:		{ type: String },
	introduction:	{ type: String },
	lastappear:	{ type: { x: Number, y: Number, s: Number }}
}, {
	collection:	"User"
})

const User = mongoose.model("User", UserSchema)

module.exports = User