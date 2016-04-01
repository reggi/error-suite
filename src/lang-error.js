import ExtendableError from 'es6-error'
import { get, keys, mapValues, zipObject, map } from 'lodash'
import stringTemplate from 'string-template'

export default class LangError extends ExtendableError {
  constructor(code, props, {locales, nestedLocalesProp, defaultAsErrorMessage, defaultLocale = 'en'}) {
    let message = false
    if (defaultAsErrorMessage) {
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
    return this
  }
  get localesAvailable() {
    return this.getLocalesAvailable()
  }
  get rawMessages() {
    return this.getRawMessages()
  }
  get messages() {
    return this.getMessages()
  }
  getLocalesAvailable() {
    return keys(this.locales)
  }
  getRawMessages() {
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
  getMessages() {
    return mapValues(this.rawMessages, message => {
      return stringTemplate(message, this.props)
    })
  }
}
