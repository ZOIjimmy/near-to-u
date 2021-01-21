const Post = require('../models/post')
const User = require('../models/user')
const Query = {
	login(parent, args, { db }, info) {
		var state = ""
		const func = async() => {
			await new Promise(resolve => {
				User.find({ account: args.account })
					.exec((err, res) => {
						if (err) throw err
						if (res.length === 0) {
							state = "account not found"
						} else if (args.password === res[0].password) {
							state = res[0].name
						} else {
							state = "wrong password"
						}
						resolve()
					})
			})
			return state
		}
		return func()
	},
	getPosts(parent, args, { db }, info) {
		const inRange = (post) => {
			return ((post.location.x - args.locale.x) ** 2 +
							(post.location.y - args.locale.y) ** 2 <
							args.locale.s ** 2)
		}
		const func = async() => {
			var x
			await new Promise(resolve => {
				Post.find()
					.exec((err, res) => {
						if (err) throw err
						x=res.filter(inRange)
						resolve()
					})
			})
			return x
		}
		return func()
	},
	getPostFromId(parent, args, { db }, info) {
		const func = async() => {
			var x
			await new Promise(resolve => {
				Post.find({ _id: args.id })
					.exec((err, res) => {
						if (err) throw err
						x = res[0]
						resolve()
					})
			})
			return x
		}
		return func()
	},
	search(parent, args, { db }, info) {
		var matchingposts = []
		const func = async() => {
			await new Promise(resolve => {
				Post.find().exec((err, res) => {
					if (err) throw err
					for (var i=0; i<res.length; i++) {
						if (args.type === 0){
							matchingposts.push(res[i])
						} else if (args.type>=4 && 
							res[i].title.search(args.text) !== -1) {
								matchingposts.push(res[i])
						} else if (args.type%4>=2 &&
							res[i].tags.includes(args.text)) {
								matchingposts.push(res[i])
						} else if (args.type%2===1 &&
							res[i].text !== undefined) {
								if (res[i].text.search(args.text) !== -1) {
									matchingposts.push(res[i])
								}
						}
						resolve()
					}
				})
			})
			matchingposts.sort((a, b)=>{return b.likes.length-a.likes.length})
			return matchingposts.slice(0, args.limit)
		}
		return func()
	},
	getProfile(parent, args, { db }, info) {
		var data = {}
		const func = async() => {
			await new Promise(resolve => {
				User.find({ account: args.account })
					.exec((err, res) => {
						if (err) throw err
						data = res
						resolve()
					})
			})
			if (data.length == 1) {
				return data[0]
			}
		}
		return func()
	}	
}

module.exports = { Query }
