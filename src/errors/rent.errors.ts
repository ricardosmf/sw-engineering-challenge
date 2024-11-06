export class RentNotFoundError extends Error {
    constructor(id: string) {
        super(`Rent with ID ${id} not found`);
        this.name = 'RentNotFoundError';
    }
}

export class RentsActiveNotFoundError extends Error {
    constructor() {
        super(`Active rents not found`);
        this.name = 'RentActiveNotFoundError';
    }
}

export class RentNotFoundForLockerError extends Error {
    constructor(id: string) {
        super(`Rent for locker with ID ${id} not found`);
        this.name = 'RentNotFoundForLockerError';
    }
}

export class RentUpdateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RentUpdateError';
    }
}

export class RentValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RentValidationError';
    }
}