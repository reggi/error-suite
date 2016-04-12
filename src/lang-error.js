import ExtendableError from 'es6-error'
import { get, keys, mapValues, zipObject, map } from 'lodash'
import stringTemplate from 'string-template'

export default class LangError extends ExtendableError {
  constructor(code = null, props = {}, {locales = null, nestedLocalesProp = null, defaultAsErrorMessage = false, defaultLocale = 'en'} = {}) {
    let message = false
    if (defaultAsErrorMessage && locales) {
      let defaultLocaleLocation = get(locales, `${defaultLocale}.${nestedLocalesProp}`) || get(locales, `${defaultLocale}`) || false
      if (!defaultLocaleLocation) throw new Error('no locale found')
      let rawDefaultMessage = get(defaultLocaleLocation, code)
      let defaultMessage = stringTemplate(rawDefaultMessage, props)
      message = defaultMessage
    }
    super(message || code)
    this.locales = locales
    this.nestedLocalesProp = nestedLocalesProp
    this.code = code
    this.props = props
    this._messages = {}
    this.messagesFromRaw = true
    return this
  }
  get localesAvailable() {
    return keys(this.locales)
  }
  get rawMessages() {
    let localeKeys = zipObject(this.localesAvailable, this.localesAvailable)
    return mapValues(localeKeys, locale => {
      let found = get(this.locales, `${locale}.${this.nestedLocalesProp}.${this.code}`)
      let fallback = get(this.locales, `${locale}.${this.nestedLocalesProp}.fallback`)
      let general = get(this.locales, `${locale}.${this.nestedLocalesProp}.general`)
      if (found) return found
      if (fallback) return fallback
      if (general) return general
      return false
    })
  }
  get messages() {
    if (this.messagesFromRaw) {
      this._messages = this.getMessagesFromRaw()
    } else {
      this._messages = this.getMessagesFromJson()
    }
    return this._messages
  }
  set messages(value) {
    this._messages = value
    return this._messages
  }
  getMessagesFromRaw() {
    return mapValues(this.rawMessages, message => {
      return stringTemplate(message, this.props)
    })
  }
  getMessagesFromJson() {
    return this.jsonMessages
  }
  toJSON () {
    return {
      'name': 'LangError',
      'message': this.message,
      'messages': this.messages
    }
  }
  fromJSON (data) {
    this.messagesFromRaw = false
    this.jsonMessages = data.messages
    this.message = data.message
    this.messages = data.messages
    return this
  }
}
