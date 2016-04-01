'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiError = exports.LangError = undefined;

var _langError = require('./lang-error');

var _langError2 = _interopRequireDefault(_langError);

var _multiError = require('./multi-error');

var _multiError2 = _interopRequireDefault(_multiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.LangError = _langError2.default;
exports.MultiError = _multiError2.default;