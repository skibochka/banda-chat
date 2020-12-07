/**
 * @exports
 * @extends Error
 */
export class AuthenticationError extends Error {
  /**
   * @constructor
   * @param {object} message
   */
  constructor(message) {
    super();
    this.message = message;
    this.name = 'E_MISSING_OR_INVALID_TOKEN';
  }
}
