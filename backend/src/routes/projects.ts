// src/routes/projects.ts
import express, { Request, Response } from "express";
import { Project } from "../models/Project";

const router = express.Router();

// Sample project data
const projects: Project[] = [
  { id: 1, title: "Senzu App", techStack: "Next.js, Express, MongoDB" },
  {
    id: 2,
    title: "Group Chat App with AI",
    techStack: "React, Node.js, OpenAI",
  },
  { id: 3, title: "SMART Goals App", techStack: "Blazor, .NET Core" },
];

// Get all projects
router.get("/", (req: Request, res: Response) => {
  res.json(projects);
});

export default router;
