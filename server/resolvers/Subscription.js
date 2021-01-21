const Subscription = {
	newSub: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator("newSub")
		}
	},
	postSub: {
		subscribe(parent, args, { pubsub }, info) {
			return pubsub.asyncIterator(`postSub${ args.id }`)
		}
	}
}

module.exports = { Subscription }
