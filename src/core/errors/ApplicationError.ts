export class ApplicationError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: Record<string, unknown>

  constructor(message: string, code: string, statusCode = 500, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApplicationError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends ApplicationError {
  constructor(message = 'Falha de conexão com o servidor') {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message = 'Sem permissão para acessar este recurso') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends ApplicationError {
  constructor(entity: string) {
    super(`${entity} não encontrado`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}
