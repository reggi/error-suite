# Error Suite

```
npm i error-suite --save
```

## MultiError

```js
import MultiError from 'error-suite'

let multierror = new MultiError('Invalid Form.')
multierror.push('Invalid Name')
multierror.push('Invalid Email')
multierror.push('Invalid Phone Number')

console.log(multierror.errors) // [ [Error: Invalid Name], [Error: Invalid Email], [Error: Invalid Phone Number] ]
console.log(multierror.messages) // [ 'Invalid Name', 'Invalid Email', 'Invalid Phone Number' ]
console.log(multierror.errorsPresent) // true
console.log(multierror.shouldThrow) // true
if (multierror.shouldThrow) throw multierror // Error: Invalid Form. | Invalid Name, Invalid Email, Invalid Phone Number
```

## LangError

```js
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

let langerror = new LangError('invalid_name', { name: 'Thomas' }, {locales, nestedLocalesProp: 'login_errors'})
console.log(langerror.messages) // { en: 'Invalid Name: Thomas!', de: 'Ungültiger Name: Thomas!', es: 'Nombre no válido: Thomas!' })
```
