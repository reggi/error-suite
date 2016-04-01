import assert from 'assert'
import { MultiError, LangError } from '../src/index'

const locales = {
  "en": {
    "login_errors": {
      "invalid_name": "Invalid Name: {name}!",
      'invalid_email': "Invalid email!",
    }
  },
  "de": {
    "login_errors": {
      "invalid_name": "Ungültiger Name: {name}!",
      "invalid_email": "Ungültiger email!",
    }
  },
  "es": {
    "login_errors": {
      "invalid_name": "Nombre no válido: {name}!",
      "invalid_email": "el correo electrónico es invalido",
    }
  }
}

describe('MultiError', () => {
  it('should work', () => {
    let multierror = new MultiError('Invalid Form.')
    multierror.push('Invalid Name')
    multierror.push('Invalid Email')
    multierror.push('Invalid Phone Number')
    assert.equal(multierror.errors[0] instanceof Error, true)
    assert.equal(multierror.errors[1] instanceof Error, true)
    assert.equal(multierror.errors[2] instanceof Error, true)
    assert.equal(multierror.errors[0].message, 'Invalid Name')
    assert.equal(multierror.errors[1].message, 'Invalid Email')
    assert.equal(multierror.errors[2].message, 'Invalid Phone Number')
    assert.equal(multierror.messages.length, 3)
    assert.equal(multierror.messages[0], 'Invalid Name')
    assert.equal(multierror.messages[1], 'Invalid Email')
    assert.equal(multierror.messages[2], 'Invalid Phone Number')
    assert.equal(multierror.errorsPresent, true)
    assert.equal(multierror.shouldThrow, true)
    assert.equal(multierror.message, 'Invalid Form. | Invalid Name, Invalid Email, Invalid Phone Number')
  })
  it('should not throw when no errors pushed', () => {
    let multierror = new MultiError('Invalid Form.')
    if (false) multierror.push('Invalid Name')
    assert.equal(multierror.errorsPresent, false)
    assert.equal(multierror.shouldThrow, false)
  })
})

describe('LangError', () => {
  it('should work', () => {
    let langerror = new LangError('invalid_name', { name: 'Thomas' }, {locales, nestedLocalesProp: 'login_errors'})

    assert.deepEqual(langerror.localesAvailable, ['en', 'de', 'es'])
    assert.deepEqual(langerror.rawMessages, { en: 'Invalid Name: {name}!', de: 'Ungültiger Name: {name}!', es: 'Nombre no válido: {name}!' })
    assert.deepEqual(langerror.messages, { en: 'Invalid Name: Thomas!', de: 'Ungültiger Name: Thomas!', es: 'Nombre no válido: Thomas!' })
    assert.equal(langerror.message, 'invalid_name')
  })
  it('should use default (en) lang message for error message', () => {
    let langerror = new LangError('invalid_name', { name: 'Thomas' }, {locales, nestedLocalesProp: 'login_errors', defaultAsErrorMessage: true})

    assert.deepEqual(langerror.localesAvailable, ['en', 'de', 'es'])
    assert.deepEqual(langerror.rawMessages, { en: 'Invalid Name: {name}!', de: 'Ungültiger Name: {name}!', es: 'Nombre no válido: {name}!' })
    assert.deepEqual(langerror.messages, { en: 'Invalid Name: Thomas!', de: 'Ungültiger Name: Thomas!', es: 'Nombre no válido: Thomas!' })
    assert.equal(langerror.message, 'Invalid Name: Thomas!')
  })
  it('should use default (de) lang message for error message', () => {
    let langerror = new LangError('invalid_name', { name: 'Thomas' }, {locales, nestedLocalesProp: 'login_errors', defaultAsErrorMessage: true, defaultLocale: 'de'})

    assert.deepEqual(langerror.localesAvailable, ['en', 'de', 'es'])
    assert.deepEqual(langerror.rawMessages, { en: 'Invalid Name: {name}!', de: 'Ungültiger Name: {name}!', es: 'Nombre no válido: {name}!' })
    assert.deepEqual(langerror.messages, { en: 'Invalid Name: Thomas!', de: 'Ungültiger Name: Thomas!', es: 'Nombre no válido: Thomas!' })
    assert.equal(langerror.message, 'Ungültiger Name: Thomas!')
  })
})

describe('MultiError & LangError', () => {
  it('should work', () => {
    const langDefinition = {locales, nestedLocalesProp: 'login_errors', defaultAsErrorMessage: true}
    let multierror = new MultiError('Invalid Form.')
    multierror.push(new LangError('invalid_name', { name: 'Thomas' }, langDefinition))
    multierror.push(new LangError('invalid_email', { name: 'Thomas' }, langDefinition))

    assert.equal(multierror.errorsPresent, true)
    assert.equal(multierror.shouldThrow, true)
    assert.equal(multierror.message, 'Invalid Form. | Invalid Name: Thomas!, Invalid email!')
    assert.deepEqual(multierror.messages, [ 'Invalid Name: Thomas!', 'Invalid email!' ])
    assert.deepEqual(multierror.getMessages('messages.de'), [ 'Ungültiger Name: Thomas!', 'Ungültiger email!' ])
    assert.deepEqual(multierror.getMessages('messages.es'), [ 'Nombre no válido: Thomas!', 'el correo electrónico es invalido' ])
    assert.deepEqual(multierror.getMessages('messages.en'), [ 'Invalid Name: Thomas!', 'Invalid email!' ])
  })
})
