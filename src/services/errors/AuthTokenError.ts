export class AuthTokenError extends Error {
    constructor() {
        super('Invalid token')
    }
}