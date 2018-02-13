import async from 'async';
import validator from 'validator';

import User from '../models/user';
import Follow from '../models/follow';

import logger from '../utils/logger';

exports.list = (req, res) => {
	const params = req.params || {};
	const query = req.query || {};

	const page = parseInt(query.page, 10) || 0;
	const perPage = parseInt(query.per_page, 10) || 10;

	User.apiQuery(req.query)
		.select('name email username bio url twitter background')
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.get = (req, res) => {
	User.findById(req.params.userId)
		.then(user => {
			user.password = undefined;
			user.recoveryCode = undefined;

			res.json(user);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.put = (req, res) => {
	const data = req.body || {};

	if (data.email && !validator.isEmail(data.email)) {
		return res.status(422).send('Invalid email address.');
	}

	if (data.username && !validator.isAlphanumeric(data.username)) {
		return res.status(422).send('Usernames must be alphanumeric.');
	}

	User.findByIdAndUpdate({ _id: req.params.userId }, data, { new: true })
		.then(user => {
			if (!user) {
				return res.sendStatus(404);
			}

			user.password = undefined;
			user.recoveryCode = undefined;

			res.json(user);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.post = (req, res) => {
	const data = Object.assign({}, req.body, { user: req.user.sub }) || {};

	User.create(data)
		.then(user => {
			res.json(user);
		})
		.catch(err => {
			logger.error(err);
			res.status(500).send(err);
		});
};

exports.delete = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.params.user },
		{ active: false },
		{
			new: true
		}
	)
		.then(user => {
			if (!user) {
				return res.sendStatus(404);
			}

			res.sendStatus(204);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};
