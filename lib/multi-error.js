'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiError = function (_ExtendableError) {
  _inherits(MultiError, _ExtendableError);

  function MultiError(message) {
    var _ret;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, MultiError);

    var _options$prop = options.prop;
    var prop = _options$prop === undefined ? 'message' : _options$prop;
    var _options$primaryDelim = options.primaryDelimeter;
    var primaryDelimeter = _options$primaryDelim === undefined ? ', ' : _options$primaryDelim;
    var _options$secondaryDel = options.secondaryDelimeter;
    var secondaryDelimeter = _options$secondaryDel === undefined ? ' | ' : _options$secondaryDel;

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MultiError).call(this, message));

    _this.message = message;
    _this.rootMessage = message;
    _this.errors = [];
    _this.messageProp = prop;
    _this.primaryDelimeter = primaryDelimeter;
    _this.secondaryDelimeter = secondaryDelimeter;
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MultiError, [{
    key: 'setMessage',
    value: function setMessage(message) {
      this.message = message;
      this.stack = new Error(message).stack;
      return this;
    }
  }, {
    key: 'getErrorsPresent',
    value: function getErrorsPresent() {
      return this.errors.length !== 0;
    }
  }, {
    key: 'getMessages',
    value: function getMessages(prop) {
      prop = prop || this.messageProp;
      if (!this.errorsPresent) return false;
      return (0, _lodash.map)(this.errors, function (error) {
        return (0, _lodash.get)(error, prop);
      });
    }
  }, {
    key: 'updateMessage',
    value: function updateMessage() {
      if (!this.errorsPresent) return false;
      var messages = this.messages.join(this.primaryDelimeter);
      var message = [this.rootMessage, messages].join(this.secondaryDelimeter);
      this.setMessage(message);
      return this;
    }
  }, {
    key: 'push',
    value: function push(error) {
      var ensure = error instanceof Error ? error : new Error(error);
      this.errors.push(ensure);
      this.updateMessage();
      return this;
    }
  }, {
    key: 'shouldThrow',
    get: function get() {
      return this.getErrorsPresent();
    }
  }, {
    key: 'errorsPresent',
    get: function get() {
      return this.getErrorsPresent();
    }
  }, {
    key: 'messages',
    get: function get() {
      return this.getMessages();
    }
  }]);

  return MultiError;
}(_es6Error2.default);

exports.default = MultiError;