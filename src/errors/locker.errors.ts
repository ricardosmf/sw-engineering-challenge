export class LockerNotFoundError extends Error {
    constructor(id: string) {
        super(`Locker with ID ${id} not found`);
        this.name = 'LockerNotFoundError';
    }
}

export class LockersNotFoundError extends Error {
    constructor() {
        super(`Lockers not found`);
        this.name = 'LockersNotFoundError';
    }
}

export class LockerUpdateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LockerUpdateError';
    }
}

export class LockerIsOcuppiedError extends Error {
    constructor(id: string) {
        super(`Locker with ID ${id} is already occupied`);
        this.name = 'LockerIsOcuppiedError';
    }
}