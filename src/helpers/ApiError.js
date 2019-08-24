export default class ApiError extends Error {
  constructor(code = 500, resource = 'Resource', message = '') {
    super();
    this.name = 'ApiError';
    this.code = code;
    this.message = this.getMessage(code, resource, message);
  }

  getMessage(code, resource, message) {
    if (message.length) {
      return message;
    } else if (code === 401) {
      return 'Invalid Token.';
    } else if (code === 404) {
      return `${resource} Not Found.`;
    } else if (code === 500) {
      return 'Internal Server Error.';
    } else {
      return 'An Error Occurred.';
    }
  }
}
