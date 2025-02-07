import express, { Request, Response } from "express";
import 'express-async-errors';
import { json } from "body-parser";
import { patientsRouter, observationsRouter } from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors";

const app = express();
app.use(json());

// the routes management
app.use(patientsRouter);
app.use(observationsRouter);

// 404 error handling middleware
app.all("*", async (req: Request, res: Response) => {
    throw new NotFoundError('Not found');
})
// error handling middleware
app.use(errorHandler);

export { app };