'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _winstonPapertrail = require('winston-papertrail');

var _winstonPapertrail2 = _interopRequireDefault(_winstonPapertrail);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('./utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = (0, _express2.default)();

api.use((0, _cors2.default)());
api.use((0, _compression2.default)());
api.use(_bodyParser2.default.urlencoded({ extended: true }));
api.use(_bodyParser2.default.json());

api.use((0, _expressJwt2.default)({ secret: _config2.default.jwt.secret }).unless({
	path: ['/', '/auth/signup', '/auth/login', '/auth/forgot-password', '/auth/reset-password']
}));

api.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('Missing authentication credentials.');
	}
});

api.use(_expressWinston2.default.logger({
	transports: [new _winston2.default.transports.Papertrail({
		host: _config2.default.logger.host,
		port: _config2.default.logger.port,
		level: 'error'
	})],
	meta: true
}));

api.listen(_config2.default.server.port, function (err) {
	if (err) {
		_logger2.default.error(err);
		process.exit(1);
	}

	require('./utils/db');

	_fs2.default.readdirSync(_path2.default.join(__dirname, 'routes')).map(function (file) {
		require('./routes/' + file)(api);
	});

	_logger2.default.info('API is now running on port ' + _config2.default.server.port + ' in ' + _config2.default.env + ' mode');
});

module.exports = api;