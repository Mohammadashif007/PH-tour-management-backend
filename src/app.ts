/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandlers } from "./app/middlewars/globalErrorHandler";
import httpStatus from "http-status-codes";
import { apiNotFound } from "./app/middlewars/notFound";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Fairhaven");
});

app.use(globalErrorHandlers);

app.use(apiNotFound);

export default app;
