export class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN_ERROR', status = 0, body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.body = body;
  }
}
