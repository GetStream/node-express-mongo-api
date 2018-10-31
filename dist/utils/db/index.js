'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var connection = _mongoose2.default.connect(_config2.default.database.uri);

connection.then(function (db) {
	_logger2.default.info('Successfully connected to ' + _config2.default.database.uri + ' MongoDB cluster in ' + _config2.default.env + ' mode.');
	return db;
}).catch(function (err) {
	if (err.message.code === 'ETIMEDOUT') {
		_logger2.default.info('Attempting to re-establish database connection.');
		_mongoose2.default.connect(_config2.default.database.uri);
	} else {
		_logger2.default.error('Error while attempting to connect to database:');
		_logger2.default.error(err);
	}
});

exports.default = connection;