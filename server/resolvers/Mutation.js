const Post = require('../models/post')
const User = require('../models/user')
const Mutation = {
	signup(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				User.find({ account: args.data.account })
					.exec( async(err, res) => {
						if (err) throw err
						if (res.length !== 0) {
							state = "account already exist"
						} else {
							var userdata = args.data
							userdata.usertype = "normal"
							await User.create(userdata)
							state = "success"
						}
						resolve()
					})
				})
			return state
		}
		return func()
	},
	editProfile(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				User.find({ account: args.data.account })
					.exec( async(err, res) => {
						if (err) throw err
						if (res.length !== 0) {
						await User.updateOne({ account: args.data.account }, { $set: args.data })
							state = "updated"
						} else {
							state = "no such account"
						}
						resolve()
					})
			})
			return state
		}
		return func()
	},
	createPost(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async () => {
			await Post.create(args.data)
			state = "create successfully"
			await pubsub.publish("newSub", {
				newSub: {...args.data, likes: [], comments: [], id: "args.data.id"}
			})
			return state
		}
		return func()
	},
	deletePost(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				Post.find({ _id: args.id })
					.exec( async(err, res) => {
						if (err) throw err
						if (res.length !== 1) {
							state = "post not found"
						} else {
							state = "delete"
							await Post.deleteOne({ _id: args.id })
							await pubsub.publish(`postSub${ args.id }`, {
								postSub: {
									mutation: "DELETED",
									id: args.id
								}
							})
						}
						resolve()
					})
			})
			return state
		}
		return func()
	},
	like(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				Post.find({ _id: args.id })
					.exec( async(err, res) => {
						if (err) throw err
						var likers = res[0].likes
						var isin = false
						for (var i=0; i<likers.length; i++) {
							if (likers[i] === args.user) {
								isin = true
							}
						}
						if (!isin) {
							likers.push(args.user)
							await Post.updateOne({_id: args.id }, { $set: { likes: likers }})
							state = "like"
							await pubsub.publish(`postSub${ args.id }`, {
								postSub: {
									mutation: "LIKED",
									id: args.id
								}
							})
						} else {
							state = "already liked"
						}
						resolve()
					})
			})
			return state
		}
		return func()
	},
	unlike(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				Post.find({ _id: args.id })
					.exec( async(err, res) => {
						if (err) throw err
						var likers = res[0].likes
						for (var i=0; i<likers.length; i++) {
							if (likers[i] === args.user) {
								likers.splice(i, 1)
								await Post.updateOne({ _id: args.id }, { $set: { likes: likers }})
								state = "unlike"
								await pubsub.publish(`postSub${ args.id }`, {
									postSub: {
										mutation: "UNLIKED",
										id: args.id
									}
								})
								break
							}
						}
						if (state === "") {
							state = "not liked"
						}
						resolve()
					})
			})
			return state
		}
		return func()
	},
	comment(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				Post.find({ _id: args.id })
					.exec( async(err, res) => {
						if (err) throw err
						var texts = res[0].comments
						texts.push({ user: args.user, text: args.text })
						await Post.updateOne({ _id: args.id }, { $set: { comments: texts }})
						state = "comment successfully"
						await pubsub.publish(`postSub${ args.id }`, {
							postSub: {
								mutation: "COMMENTADDED",
								id: args.id,
								data: {
									user: args.user,
									text: args.text
								}
							}
						})
						resolve()
					})
			})
			return state
		}
		return func()
	},
	deleteComment(parent, args, { db, pubsub }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				Post.find({ _id: args.id })
					.exec( async(err, res) => {
						if (err) throw err
						var texts = res[0].comments
						for (var i=0; i<texts.length; i++) {
							if (texts[i].text === args.text && texts[i].user === args.user) {
								texts.splice(i, 1)
								await Post.updateOne({ _id: args.id }, { $set: { comments: texts }})
								state = "deleted successfully"
								await pubsub.publish(`postSub${ args.id }`, {
									postSub: {
										mutation: "COMMENTDELETED",
										id: args.id,
										data: {
											user: args.user,
											text: args.text
										}
									}
								})
								break
							}
						}
						if (state === "") {
							state = "comment not found"
						}
						resolve()
					})
			})
			return state
		}
		return func()
	}
}
module.exports = { Mutation }
