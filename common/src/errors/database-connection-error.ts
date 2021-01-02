import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
    statusCode = 500
    reason = 'Error connection to database';
    constructor() {
        super('Error connecting db');

        // Only for extend class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(){
        return [
            { message: this.reason }
        ]
    }
}