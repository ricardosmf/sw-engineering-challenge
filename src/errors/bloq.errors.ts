export class BloqNotFoundError extends Error {
    constructor(id: string) {
        super(`Bloq with ID ${id} not found`);
        this.name = 'BloqNotFoundError';
    }
}

export class BloqsNotFoundError extends Error {
    constructor() {
        super(`Bloq not found`);
        this.name = 'BloqsNotFoundError';
    }
}

export class BloqUpdateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BloqUpdateError';
    }
}