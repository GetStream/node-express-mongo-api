'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UserSchema = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseBcrypt = require('mongoose-bcrypt');

var _mongooseBcrypt2 = _interopRequireDefault(_mongooseBcrypt);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _mongooseStringQuery = require('mongoose-string-query');

var _mongooseStringQuery2 = _interopRequireDefault(_mongooseStringQuery);

var _logger = require('../utils/logger');

var _logger2 = _interopRequireDefault(_logger);

var _email = require('../utils/email');

var _email2 = _interopRequireDefault(_email);

var _events = require('../utils/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = exports.UserSchema = new _mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		index: true,
		unique: true,
		required: true
	},
	username: {
		type: String,
		lowercase: true,
		trim: true,
		index: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
	},
	name: {
		type: String,
		trim: true,
		required: true
	},
	bio: {
		type: String,
		trim: true,
		default: ''
	},
	url: {
		type: String,
		trim: true,
		default: ''
	},
	twitter: {
		type: String,
		trim: true,
		default: ''
	},
	background: {
		type: Number,
		default: 1
	},
	interests: {
		type: _mongoose.Schema.Types.Mixed,
		default: []
	},
	preferences: {
		notifications: {
			daily: {
				type: Boolean,
				default: false
			},
			weekly: {
				type: Boolean,
				default: true
			},
			follows: {
				type: Boolean,
				default: true
			}
		}
	},
	recoveryCode: {
		type: String,
		trim: true,
		default: ''
	},
	active: {
		type: Boolean,
		default: true
	},
	admin: {
		type: Boolean,
		default: false
	}
}, { collection: 'users' });

UserSchema.pre('save', function (next) {

	if (!this.isNew) {
		next();
	}

	(0, _email2.default)({
		type: 'welcome',
		email: this.email
	}).then(function () {
		next();
	}).catch(function (err) {
		_logger2.default.error(err);
		next();
	});
});

UserSchema.pre('findOneAndUpdate', function (next) {
	if (!this._update.recoveryCode) {
		return next();
	}

	(0, _email2.default)({
		type: 'password',
		email: this._conditions.email,
		passcode: this._update.recoveryCode
	}).then(function () {
		next();
	}).catch(function (err) {
		_logger2.default.error(err);
		next();
	});
});

UserSchema.plugin(_mongooseBcrypt2.default);
UserSchema.plugin(_mongooseTimestamp2.default);
UserSchema.plugin(_mongooseStringQuery2.default);

UserSchema.index({ email: 1, username: 1 });

module.exports = exports = _mongoose2.default.model('User', UserSchema);