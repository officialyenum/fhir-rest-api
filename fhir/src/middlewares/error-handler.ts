import { Request, Response, NextFunction } from "express";
import { ErrorBase } from "../errors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorBase) {
        res.status(err.statusCode).json({ errors: err.serializeErrors() });
    }
    res.status(500).json("Something went wrong!");
};