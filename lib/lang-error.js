'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

var _lodash = require('lodash');

var _stringTemplate = require('string-template');

var _stringTemplate2 = _interopRequireDefault(_stringTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LangError = (function (_ExtendableError) {
  _inherits(LangError, _ExtendableError);

  function LangError() {
    var code = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ret;

    var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var _ref$locales = _ref.locales;
    var locales = _ref$locales === undefined ? {} : _ref$locales;
    var _ref$nestedLocalesPro = _ref.nestedLocalesProp;
    var nestedLocalesProp = _ref$nestedLocalesPro === undefined ? null : _ref$nestedLocalesPro;
    var _ref$defaultAsErrorMe = _ref.defaultAsErrorMessage;
    var defaultAsErrorMessage = _ref$defaultAsErrorMe === undefined ? false : _ref$defaultAsErrorMe;
    var _ref$defaultLocale = _ref.defaultLocale;
    var defaultLocale = _ref$defaultLocale === undefined ? 'en' : _ref$defaultLocale;

    _classCallCheck(this, LangError);

    var message = false;
    if (defaultAsErrorMessage && locales) {
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
    _this._messages = {};
    _this.messagesFromRaw = true;
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LangError, [{
    key: 'getMessagesFromRaw',
    value: function getMessagesFromRaw() {
      var _this2 = this;

      return (0, _lodash.mapValues)(this.rawMessages, function (message) {
        return (0, _stringTemplate2.default)(message, _this2.props);
      });
    }
  }, {
    key: 'getMessagesFromJson',
    value: function getMessagesFromJson() {
      return this.jsonMessages;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        'name': 'LangError',
        'message': this.message,
        'messages': this.messages
      };
    }
  }, {
    key: 'fromJSON',
    value: function fromJSON(data) {
      this.messagesFromRaw = false;
      this.jsonMessages = data.messages;
      this.message = data.message;
      this.messages = data.messages;
      return this;
    }
  }, {
    key: 'localesAvailable',
    get: function get() {
      return (0, _lodash.keys)(this.locales);
    }
  }, {
    key: 'rawMessages',
    get: function get() {
      var _this3 = this;

      var localeKeys = (0, _lodash.zipObject)(this.localesAvailable, this.localesAvailable);
      return (0, _lodash.mapValues)(localeKeys, function (locale) {
        var found = (0, _lodash.get)(_this3.locales, locale + '.' + _this3.nestedLocalesProp + '.' + _this3.code);
        var fallback = (0, _lodash.get)(_this3.locales, locale + '.' + _this3.nestedLocalesProp + '.fallback');
        var general = (0, _lodash.get)(_this3.locales, locale + '.' + _this3.nestedLocalesProp + '.general');
        if (found) return found;
        if (fallback) return fallback;
        if (general) return general;
        return false;
      });
    }
  }, {
    key: 'messages',
    get: function get() {
      if (this.messagesFromRaw) {
        this._messages = this.getMessagesFromRaw();
      } else {
        this._messages = this.getMessagesFromJson();
      }
      return this._messages;
    },
    set: function set(value) {
      this._messages = value;
      return this._messages;
    }
  }]);

  return LangError;
})(_es6Error2.default);

exports.default = LangError;