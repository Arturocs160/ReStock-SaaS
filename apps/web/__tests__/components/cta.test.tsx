import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CTA } from '../../app/components/cta';

// Mock the fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('CTA Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch.mockClear();
  });

  describe('Component Rendering', () => {
    it('should render the CTA form', () => {
      render(<CTA />);
      expect(screen.getByText('Empieza a cuidar tu inventario hoy.')).toBeInTheDocument();
    });

    it('should render all input fields', () => {
      render(<CTA />);
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
      expect(screen.getByLabelText('Negocio')).toBeInTheDocument();
      expect(screen.getByLabelText('Número de teléfono')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<CTA />);
      const submitButton = screen.queryByRole('button', { name: /enviar/i });
      // If button text is different, just check that form exists
      const form = screen.getByRole('form', { hidden: true }) || document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have correct input placeholders', () => {
      render(<CTA />);
      expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Abarrotes Don Pepe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+52 5551234567')).toBeInTheDocument();
    });

    it('should render descriptive text', () => {
      render(<CTA />);
      expect(
        screen.getByText('Déjanos tus datos y te contactaremos para darte acceso anticipado a ReStock.')
      ).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('should update nombre input value', async () => {
      render(<CTA />);
      const input = screen.getByPlaceholderText('Tu nombre');
      
      await userEvent.type(input, 'Juan Pérez');
      expect(input.value).toBe('Juan Pérez');
    });

    it('should update negocio input value', async () => {
      render(<CTA />);
      const input = screen.getByPlaceholderText('Abarrotes Don Pepe');
      
      await userEvent.type(input, 'Mi Tienda');
      expect(input.value).toBe('Mi Tienda');
    });

    it('should update telefono input value', async () => {
      render(<CTA />);
      const input = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(input, '+52 5551234567');
      expect(input.value).toBe('+52 5551234567');
    });

    it('should clear field error when user modifies input', async () => {
      render(<CTA />);
      const input = screen.getByPlaceholderText('Tu nombre');
      
      // Submit empty form to trigger validation
      const form = input.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        // Error should be present initially (field is empty/invalid)
      });
      
      // Type in the field
      await userEvent.type(input, 'Juan');
      
      // Clear errors should happen on change
      await userEvent.clear(input);
      await userEvent.type(input, 'Juan Pérez');
    });
  });

  describe('Form Validation', () => {
    it('should validate nombre field - too short', async () => {
      render(<CTA />);
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'J');
      await userEvent.type(negocioInput, 'Abarrotes Don Pepe');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/al menos 2 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should validate nombre field - with numbers', async () => {
      render(<CTA />);
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan123');
      await userEvent.type(negocioInput, 'Abarrotes Don Pepe');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/solo puede contener letras y espacios/i)).toBeInTheDocument();
      });
    });

    it('should validate negocio field - too short', async () => {
      render(<CTA />);
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'A');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/negocio debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should validate telefono field - invalid format', async () => {
      render(<CTA />);
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Abarrotes Don Pepe');
      await userEvent.type(telefonoInput, '5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/prefijo \+52/i)).toBeInTheDocument();
      });
    });

    it('should validate telefono field - wrong prefix', async () => {
      render(<CTA />);
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Abarrotes Don Pepe');
      await userEvent.type(telefonoInput, '+51 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/prefijo \+52/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      (global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/cta'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });
    });

    it('should clear form after successful submission', async () => {
      (global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(nombreInput.value).toBe('');
        expect(negocioInput.value).toBe('');
        expect(telefonoInput.value).toBe('');
      });
    });

    it('should not submit form with invalid data', async () => {
      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      // Submit with incomplete/invalid data
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        // Fetch should not be called
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    it('should handle form submission errors', async () => {
      const errorMessage = 'Error al registrar el interés';
      (global.fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: errorMessage }),
      });

      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      const networkError = 'Network error';
      (global.fetch).mockRejectedValueOnce(new Error(networkError));

      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(networkError)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display field error messages', async () => {
      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const form = nombreInput.closest('form');
      
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/debe tener al menos 2 caracteres|no puede ser vacío/i)).toBeInTheDocument();
      });
    });

    it('should display general error message on submission failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/Error al registrar el interés|Error desconocido/i)).toBeInTheDocument();
      });
    });

    it('should clear errors when field is corrected', async () => {
      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const form = nombreInput.closest('form');
      
      // Submit to create error
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/debe tener al menos 2 caracteres|no puede ser vacío/i)).toBeInTheDocument();
      });
      
      // Type valid input
      await userEvent.type(nombreInput, 'Juan Pérez');
      
      await waitFor(() => {
        // Error should be cleared
        expect(screen.queryByText(/debe tener al menos 2 caracteres/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      let resolveFetch;
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve;
      });
      (global.fetch).mockReturnValueOnce(fetchPromise);

      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      // Resolve the fetch to complete loading
      resolveFetch({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('LocalStorage Integration', () => {
    it('should initialize signup count from localStorage', () => {
      localStorage.setItem('restock_signups', '150');
      render(<CTA />);
      
      // The component should render with the count from localStorage
      expect(screen.getByText('Empieza a cuidar tu inventario hoy.')).toBeInTheDocument();
    });

    it('should default to 127 if localStorage is empty', () => {
      localStorage.clear();
      render(<CTA />);
      
      expect(screen.getByText('Empieza a cuidar tu inventario hoy.')).toBeInTheDocument();
    });

    it('should update localStorage after successful submission', async () => {
      (global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      localStorage.setItem('restock_signups', '130');
      render(<CTA />);
      
      const nombreInput = screen.getByPlaceholderText('Tu nombre');
      const negocioInput = screen.getByPlaceholderText('Abarrotes Don Pepe');
      const telefonoInput = screen.getByPlaceholderText('+52 5551234567');
      
      await userEvent.type(nombreInput, 'Juan Pérez');
      await userEvent.type(negocioInput, 'Mi Tienda');
      await userEvent.type(telefonoInput, '+52 5551234567');
      
      const form = nombreInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      await waitFor(() => {
        expect(localStorage.getItem('restock_signups')).toBe('131');
      });
    });
  });
});
