'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _winstonPapertrail = require('winston-papertrail');

var _winstonPapertrail2 = _interopRequireDefault(_winstonPapertrail);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = void 0;

if (_config2.default.env == 'test' || _config2.default.env == 'local' || _config2.default.env == 'development') {
	logger = console;
} else {
	var papertrailTransport = new _winston2.default.transports.Papertrail({
		host: _config2.default.logger.host,
		port: _config2.default.logger.port
	});

	logger = new _winston2.default.Logger({
		transports: [papertrailTransport]
	});
}

exports.default = logger;