import { Router } from "express";
import { getExpertById, getExperts } from "../controllers/expertsController.js";

const expertsRoutes = Router();

expertsRoutes.get("/", getExperts);
expertsRoutes.get("/:id", getExpertById);

export default expertsRoutes;