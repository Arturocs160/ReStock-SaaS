import { Request, Response } from "express";
import { createInterest } from "../services/ctaServices";
import { ctaSchema } from "../schemas/ctaSchema";

export async function createInterestController(req: Request, res: Response) {
  try {
    // Validate input data
    const validatedData = ctaSchema.parse(req.body);

    // Call the service with validated data
    const result = await createInterest(validatedData);

    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: error.errors,
      });
    }

    if (error.message === "Email already registered") {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error("Error creating interest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
