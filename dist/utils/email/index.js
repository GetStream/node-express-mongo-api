'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var email = function email(data) {
	if (!data.type || !data.email) {
		return new Promise(function (reject) {
			var err = 'Missing data.type OR data.email!';
			_logger2.default.error(err);
			reject(err);
		});
	}

	return new Promise(function (resolve, reject) {
		if (_config2.default.env === 'test' || _config2.default.env === 'local') {
			return resolve();
		}

		_mail2.default.setApiKey(_config2.default.email.sendgrid.secret);
		var type = data.type.toLowerCase();

		if (data.type === 'welcome') {
			var msg = _ejs2.default.render(_fs2.default.readFileSync(__dirname + '/templates/welcome.ejs', 'utf8'));

			var obj = {
				to: data.email,
				from: {
					name: _config2.default.email.sender.default.name,
					email: _config2.default.email.sender.default.email
				},
				subject: 'Welcome to Winds!',
				content: [{
					type: 'text/html',
					value: msg
				}]
			};

			_mail2.default.send(obj).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				_logger2.default.error(err);
				reject(err);
			});
		}

		if (data.type === 'password') {
			if (!data.passcode) {
				return new Promise(function (reject) {
					var err = 'Missing data.passcode!';
					_logger2.default.error(err);
					reject(err);
				});
			}

			var _msg = _ejs2.default.render(_fs2.default.readFileSync(__dirname + '/templates/password.ejs', 'utf8'), { passcode: data.passcode });

			var _obj = {
				to: data.email,
				from: {
					name: _config2.default.email.sender.support.name,
					email: _config2.default.email.sender.support.email
				},
				subject: 'Forgot Password',
				content: [{
					type: 'text/html',
					value: _msg
				}]
			};

			_mail2.default.send(_obj).then(function (res) {
				resolve(res);
			}).catch(function (err) {
				_logger2.default.error(err);
				reject(err);
			});
		}
	});
};

exports.default = email;