'use strict';

function checkID() {
	return function (req, res, next) {
		if (req.params.id !== req.body.id) {
			const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
			console.error(message);
			return res.status(400).send(message);
		}
		next();
	}
}

module.exports = {checkID};