import { Request, Response } from 'express';
import { createInterestService } from '../services/ctaServices';

export async function createInterest(req: Request, res: Response) {
    try {
        const { nombre, negocio, telefono } = req.body;
        console.log(`Received interest from: ${nombre}, ${negocio}, ${telefono}`);
        const newInterest = await createInterestService(nombre, negocio, telefono);
        res.status(201).json({ message: 'Registro exitoso' });
    } catch (error) {
        console.error('Error creating interest:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}