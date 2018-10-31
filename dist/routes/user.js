'use strict';

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (api) {
	api.route('/users').get(_user2.default.list);
	api.route('/users/:userId').get(_user2.default.get);
	api.route('/users/:userId').put(_user2.default.put);
	api.route('/users/').post(_user2.default.post);
	api.route('/users/:userId').delete(_user2.default.delete);
};