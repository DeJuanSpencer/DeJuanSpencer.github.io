// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import projectRoutes from "./routes/projects";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/projects", projectRoutes);

export default app;
