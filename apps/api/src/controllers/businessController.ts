import { Request, Response } from 'express';
import { getNegocioBySubdomainModel, updateNegocioModel } from '../models/negocioModel'; 

export const updateBusinessHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, subdomain, status } = req.body;
    
    
    let id_negocio = (req as any).user?.id_negocio;

   
    if (!id_negocio) {
      const negocioActual = await getNegocioBySubdomainModel(subdomain);
      id_negocio = negocioActual?.id_negocio;
    }

    
    if (!id_negocio) {
      id_negocio = "11111111-1111-1111-1111-111111111111"; 
    }

    
    const existingBusiness = await getNegocioBySubdomainModel(subdomain);
    if (existingBusiness && existingBusiness.id_negocio !== id_negocio) {
      res.status(409).json({ 
        message: 'El subdominio ya está registrado por otra tienda.' 
      });
      return;
    }

    
    const updatedBusiness = await updateNegocioModel(id_negocio, name, subdomain);

    if (!updatedBusiness) {
      res.status(404).json({ message: 'No se encontró el negocio para actualizar.' });
      return;
    }

    
    res.status(200).json({ 
      message: '¡Identidad del negocio actualizada con éxito!',
      data: updatedBusiness
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || 'Error interno del servidor al actualizar el negocio.' 
    });
  }
};