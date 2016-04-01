'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

var _lodash = require('lodash');

var _stringTemplate = require('string-template');

var _stringTemplate2 = _interopRequireDefault(_stringTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import locales from '../src/locales'


var LangError = function (_ExtendableError) {
  _inherits(LangError, _ExtendableError);

  function LangError(code, props, _ref) {
    var _ret;

    var locales = _ref.locales;
    var nestedLocalesProp = _ref.nestedLocalesProp;
    var defaultAsErrorMessage = _ref.defaultAsErrorMessage;
    var _ref$defaultLocale = _ref.defaultLocale;
    var defaultLocale = _ref$defaultLocale === undefined ? 'en' : _ref$defaultLocale;

    _classCallCheck(this, LangError);

    var message = false;
    if (defaultAsErrorMessage) {
      var defaultLocaleLocation = (0, _lodash.get)(locales, defaultLocale + '.' + nestedLocalesProp) || (0, _lodash.get)(locales, '' + defaultLocale) || false;
      if (!defaultLocaleLocation) throw new Error('no locale found');
      var rawDefaultMessage = (0, _lodash.get)(defaultLocaleLocation, code);
      var defaultMessage = (0, _stringTemplate2.default)(rawDefaultMessage, props);
      message = defaultMessage;
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LangError).call(this, message || code));

    _this.locales = locales;
    _this.nestedLocalesProp = nestedLocalesProp;
    _this.code = code;
    _this.props = props;
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LangError, [{
    key: 'getLocalesAvailable',
    value: function getLocalesAvailable() {
      return (0, _lodash.keys)(this.locales);
    }
  }, {
    key: 'getRawMessages',
    value: function getRawMessages() {
      var _this2 = this;

      var localeKeys = (0, _lodash.zipObject)(this.localesAvailable, this.localesAvailable);
      return (0, _lodash.mapValues)(localeKeys, function (locale) {
        var found = (0, _lodash.get)(_this2.locales, locale + '.' + _this2.nestedLocalesProp + '.' + _this2.code);
        var fallback = (0, _lodash.get)(_this2.locales, locale + '.' + _this2.nestedLocalesProp + '.fallback');
        var general = (0, _lodash.get)(_this2.locales, locale + '.' + _this2.nestedLocalesProp + '.general');
        if (found) return found;
        if (fallback) return fallback;
        if (general) return general;
        return false;
      });
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      var _this3 = this;

      return (0, _lodash.mapValues)(this.rawMessages, function (message) {
        return (0, _stringTemplate2.default)(message, _this3.props);
      });
    }
  }, {
    key: 'localesAvailable',
    get: function get() {
      return this.getLocalesAvailable();
    }
  }, {
    key: 'rawMessages',
    get: function get() {
      return this.getRawMessages();
    }
  }, {
    key: 'messages',
    get: function get() {
      return this.getMessages();
    }
  }]);

  return LangError;
}(_es6Error2.default);

exports.default = LangError;