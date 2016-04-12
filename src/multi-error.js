import ExtendableError from 'es6-error'
import { map, get } from 'lodash'

export default class MultiError extends ExtendableError {
  constructor(message, options = {}) {
    let {prop = 'message', primaryDelimeter = ', ', secondaryDelimeter = ' | '} = options
    super(message)
    this.message = message
    this.rootMessage = message
    this.errors = []
    this.messageProp = prop
    this.primaryDelimeter = primaryDelimeter
    this.secondaryDelimeter = secondaryDelimeter
    return this
  }
  get shouldThrow() {
    return this.getErrorsPresent()
  }
  get errorsPresent() {
    return this.getErrorsPresent()
  }
  get messages () {
    return this.getMessages()
  }
  setMessage(message) {
    this.message = message
    this.stack = (new Error(message)).stack
    return this
  }
  getErrorsPresent() {
    return (this.errors.length !== 0)
  }
  getMessages(prop) {
    prop = prop || this.messageProp
    if (!this.errorsPresent) return false
    return map(this.errors, error => {
      return get(error, prop)
    })
  }
  updateMessage() {
    if (!this.errorsPresent) return false
    let messages = this.messages.join(this.primaryDelimeter)
    let message = [this.rootMessage, messages].join(this.secondaryDelimeter)
    this.setMessage(message)
    return this
  }
  push(error) {
    let ensure = (error instanceof Error) ? error : new Error(error)
    this.errors.push(ensure)
    this.updateMessage()
    return this
  }
  pushAll(arr) {
    arr.forEach(item => {
      this.push(item)
    })
  }
}
