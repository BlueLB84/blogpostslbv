'use strict';

function checkParams(paramsArr) {
	return function (req, res, next) {
		for (let i=0; i<paramsArr.length; i++) {
			const field = paramsArr[i];
			if (!(field in req.body)) {
				const message = `Missing \`${field}\` in request body`;
				console.error(message);
				return res.status(400).send(message);
			}
		}
		next();
	}
}

module.exports = {checkParams};