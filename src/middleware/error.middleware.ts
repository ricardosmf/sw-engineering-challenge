import { Request, Response, NextFunction } from 'express';
import { LockerIsOcuppiedError, LockerNotFoundError, LockersNotFoundError, LockerUpdateError } from '../errors/locker.errors';
import { BloqNotFoundError, BloqsNotFoundError, BloqUpdateError } from '../errors/bloq.errors';
import { RentNotFoundError, RentNotFoundForLockerError, RentsActiveNotFoundError, RentUpdateError, RentValidationError } from '../errors/rent.errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof LockerNotFoundError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof LockersNotFoundError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof LockerUpdateError) {
        return res.status(400).json({
            error: err.message
        });
    }

    if (err instanceof LockerIsOcuppiedError) {
        return res.status(400).json({
            error: err.message
        });
    }

    if (err instanceof BloqNotFoundError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof BloqsNotFoundError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof BloqUpdateError) {
        return res.status(400).json({
            error: err.message
        });
    }

    if (err instanceof RentNotFoundError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof RentNotFoundForLockerError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof RentsActiveNotFoundError) {
        return res.status(404).json({
            error: err.message
        });
    }

    if (err instanceof RentUpdateError) {
        return res.status(400).json({
            error: err.message
        });
    }

    if (err instanceof RentValidationError) {
        return res.status(404).json({
            error: err.message
        });
    }

    // Default error
    return res.status(500).json({
        error: 'Internal server error'
    });
};