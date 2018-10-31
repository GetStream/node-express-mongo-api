'use strict';

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _follow = require('../models/follow');

var _follow2 = _interopRequireDefault(_follow);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.list = function (req, res) {
	var params = req.params || {};
	var query = req.query || {};

	var page = parseInt(query.page, 10) || 0;
	var perPage = parseInt(query.per_page, 10) || 10;

	_user2.default.apiQuery(req.query).select('name email username bio url twitter background').then(function (users) {
		res.json(users);
	}).catch(function (err) {
		_logger2.default.error(err);
		res.status(422).send(err.errors);
	});
};

exports.get = function (req, res) {
	_user2.default.findById(req.params.userId).then(function (user) {
		user.password = undefined;
		user.recoveryCode = undefined;

		res.json(user);
	}).catch(function (err) {
		_logger2.default.error(err);
		res.status(422).send(err.errors);
	});
};

exports.put = function (req, res) {
	var data = req.body || {};

	if (data.email && !_validator2.default.isEmail(data.email)) {
		return res.status(422).send('Invalid email address.');
	}

	if (data.username && !_validator2.default.isAlphanumeric(data.username)) {
		return res.status(422).send('Usernames must be alphanumeric.');
	}

	_user2.default.findByIdAndUpdate({ _id: req.params.userId }, data, { new: true }).then(function (user) {
		if (!user) {
			return res.sendStatus(404);
		}

		user.password = undefined;
		user.recoveryCode = undefined;

		res.json(user);
	}).catch(function (err) {
		_logger2.default.error(err);
		res.status(422).send(err.errors);
	});
};

exports.post = function (req, res) {
	var data = Object.assign({}, req.body, { user: req.user.sub }) || {};

	_user2.default.create(data).then(function (user) {
		res.json(user);
	}).catch(function (err) {
		_logger2.default.error(err);
		res.status(500).send(err);
	});
};

exports.delete = function (req, res) {
	_user2.default.findByIdAndUpdate({ _id: req.params.user }, { active: false }, {
		new: true
	}).then(function (user) {
		if (!user) {
			return res.sendStatus(404);
		}

		res.sendStatus(204);
	}).catch(function (err) {
		_logger2.default.error(err);
		res.status(422).send(err.errors);
	});
};