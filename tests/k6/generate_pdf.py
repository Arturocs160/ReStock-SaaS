import os
from fpdf import FPDF

class CustomPDF(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 8)
        self.set_text_color(100, 110, 120)
        self.cell(0, 8, 'ReStock-SaaS - Documento de Pruebas e Inventario', 0, 0, 'L')
        self.set_font('helvetica', '', 8)
        self.cell(0, 8, 'Fecha: 18 de junio, 2026', 0, 1, 'R')
        self.set_draw_color(200, 200, 200)
        self.line(10, 16, 200, 16)
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(100, 110, 120)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', 0, 0, 'C')

def create_pdf(output_path):
    pdf = CustomPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # Titulo Principal
    pdf.set_font('helvetica', 'B', 18)
    pdf.set_text_color(30, 41, 59) # Slate 800
    pdf.cell(0, 12, 'Explicacion del Codigo Agregado', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 10)
    pdf.set_text_color(71, 85, 105) # Slate 600
    pdf.cell(0, 6, 'Proyecto: ReStock-SaaS  |  Responsable: ArmandoValerio', 0, 1, 'L')
    pdf.ln(6)

    # ----------------------------------------------------
    # SECCION 1: PARTE 1
    # ----------------------------------------------------
    pdf.set_font('helvetica', 'B', 13)
    pdf.set_text_color(15, 23, 42) # Slate 900
    pdf.cell(0, 10, 'PARTE 1: Pruebas Automatizadas (Jest, Supertest y k6)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 10)
    pdf.set_text_color(51, 65, 85) # Slate 700
    intro_p1 = (
        "Las pruebas estan estructuradas para validar el backend (logica de negocio y rutas), "
        "el frontend (componentes de la interfaz y validacion de formularios) y el rendimiento "
        "(pruebas de carga del servidor)."
    )
    pdf.multi_cell(0, 5, intro_p1)
    pdf.ln(4)

    # Subseccion 1.1
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(29, 78, 216) # Blue 700
    pdf.cell(0, 8, '1. Configuracion de los Entornos de Pruebas', 0, 1, 'L')
    
    # Item 1.1.1
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Backend Config (apps/api/jest.config.js)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    back_conf_text = (
        "- preset: 'ts-jest': Le dice a Jest que use el compilador ts-jest para transformar los archivos "
        "TypeScript (.ts) a JavaScript antes de correr los tests.\n"
        "- testEnvironment: 'node': Configura el entorno de ejecucion como Node.js (ya que en el backend "
        "no necesitamos emular un navegador).\n"
        "- moduleNameMapper: Permite que Jest entienda los alias de rutas como @/ mapeados al directorio raiz "
        "de desarrollo src/.\n"
        "- collectCoverageFrom: Le indica a Jest que calcule la cobertura de codigo en todos los archivos .ts "
        "dentro de src, excluyendo el punto de entrada principal index.ts."
    )
    pdf.multi_cell(0, 5, back_conf_text)
    pdf.ln(2)

    # Item 1.1.2
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Frontend Config (apps/web/jest.config.js)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    front_conf_text = (
        "- nextJest: Importa la configuracion oficial de pruebas de Next.js. Esto carga automaticamente "
        "las variables de entorno de .env y habilita el compilador optimizado SWC.\n"
        "- testEnvironment: 'jest-environment-jsdom': Configura un entorno de navegador simulado (JSDOM) "
        "en Node.js, lo cual es necesario para poder interactuar y renderizar componentes React en los tests.\n"
        "- setupFilesAfterEnv: ['<rootDir>/jest-setup.js']: Carga el archivo de inicializacion de pruebas, "
        "el cual importa @testing-library/jest-dom para anadir funciones especiales como .toBeInTheDocument()."
    )
    pdf.multi_cell(0, 5, front_conf_text)
    pdf.ln(4)

    # Subseccion 1.2
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(29, 78, 216)
    pdf.cell(0, 8, '2. Pruebas del Backend (Jest + Supertest)', 0, 1, 'L')
    
    # Item 1.2.1
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Validacion de Esquemas (apps/api/src/__tests__/schemas/ctaSchema.test.ts)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    schema_text = (
        "Comprueba que las reglas de validacion de datos hechas con Zod funcionen correctamente "
        "antes de procesar cualquier peticion HTTP:\n"
        "- Caso Exitoso: Verifica que cuando se le pasa un objeto correcto (con nombre, email valido y origen), "
        "el validador de Zod de luz verde (result.success === true).\n"
        "- Caso de Error de Email: Pasa un correo con formato invalido y valida que el sistema lo rechace "
        "y arroje el mensaje de error especifico para el campo email.\n"
        "- Caso de Campos Faltantes: Intenta validar un objeto que no tiene correo electronico y comprueba que falle."
    )
    pdf.multi_cell(0, 5, schema_text)
    pdf.ln(2)

    # Item 1.2.2
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Pruebas de Servicios (apps/api/src/__tests__/services/ctaServices.test.ts)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    services_text = (
        "Prueban la logica de negocio simulando la base de datos (con jest.mock) para no alterarla durante las pruebas:\n"
        "- Caso Exitoso: Configura la base de datos falsa (mock) para retornar que no hay ningun correo duplicado. "
        "Comprueba que el servicio cree el registro de interes y retorne el objeto recien creado con su ID unico.\n"
        "- Caso de Error Duplicado: Configura la base de datos para simular que el correo ya esta registrado y "
        "verifica que el servicio lance correctamente un error 'Email already registered', asegurando que no se "
        "intente guardar nada."
    )
    pdf.multi_cell(0, 5, services_text)
    pdf.ln(2)

    # Item 1.2.3
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Pruebas de Rutas (apps/api/src/__tests__/routes/cta.test.ts)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    routes_text = (
        "Utiliza Supertest para levantar el servidor Express en memoria y enviar peticiones HTTP reales al endpoint /cta:\n"
        "- POST /cta Exitoso (201): Valida que al enviar datos correctos, el API responda con el codigo HTTP 201 Created "
        "y los datos del nuevo registro.\n"
        "- Errores de Validacion (400): Valida que si el correo no tiene formato valido o faltan campos obligatorios, "
        "el API responda con 400 Bad Request.\n"
        "- Registro Duplicado (409): Verifica que si el servicio arroja un error de correo duplicado, la ruta lo "
        "capture y responda al usuario con un 409 Conflict.\n"
        "- Fallo del Servidor (500): Simula que la base de datos se cayo y comprueba que la ruta responda de forma "
        "segura con un 500 Internal Server Error sin exponer detalles sensibles."
    )
    pdf.multi_cell(0, 5, routes_text)
    pdf.ln(4)

    # Subseccion 1.3
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(29, 78, 216)
    pdf.cell(0, 8, '3. Pruebas del Frontend (Jest + React Testing Library)', 0, 1, 'L')
    
    # Item 1.3.1
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Validaciones del Formulario (apps/web/__tests__/lib/validationsCTA.test.ts)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    front_val_text = (
        "Prueba a nivel de codigo que el esquema de validacion en el frontend (interestSchema con Zod) sea estricto:\n"
        "- Nombre: Acepta caracteres en espanol (como la N y acentos), pero rechaza nombres vacios, con numeros, "
        "menores a 2 caracteres o mayores a 100.\n"
        "- Negocio: Valida reglas similares de longitud y caracteres especiales.\n"
        "- Telefono: Verifica estrictamente que el numero comience con el prefijo internacional de Mexico (+52 o +52 "
        "seguido de exactamente 10 digitos). Si no cumple el formato, es rechazado."
    )
    pdf.multi_cell(0, 5, front_val_text)
    pdf.ln(2)

    # Item 1.3.2
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Pruebas del Componente CTA (apps/web/__tests__/components/cta.test.tsx)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    front_comp_text = (
        "Simula el comportamiento de un usuario interactuando con el formulario de llamada a la accion:\n"
        "- Renderizado: Asegura que el titulo, los campos (Nombre, Negocio, Telefono) y el boton de enviar aparezcan.\n"
        "- Interaccion y Escritura: Simula al usuario escribiendo en los campos (userEvent.type) y valida que los inputs "
        "reflejen el texto introducido.\n"
        "- Manejo de Errores Visuales: Simula que el usuario intenta enviar el formulario en blanco y verifica que "
        "aparezcan los errores visuales en color rojo (ej. 'al menos 2 caracteres', 'prefijo +52').\n"
        "- Envio de Datos: Simula un envio correcto mockeando fetch para interceptar la llamada al backend (/cta), "
        "verifica que se manden los datos correctos y que los campos se limpien tras el exito.\n"
        "- Persistencia (localStorage): Verifica que tras un registro exitoso, se actualice el contador en localStorage."
    )
    pdf.multi_cell(0, 5, front_comp_text)
    pdf.ln(4)

    # Subseccion 1.4
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(29, 78, 216)
    pdf.cell(0, 8, '4. Pruebas de Rendimiento (k6)', 0, 1, 'L')
    
    # Item 1.4.1
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Prueba de Disponibilidad (tests/k6/health-check.js)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    health_text = (
        "Prueba rapida (smoke test) para validar que la raiz del API esta activa y respondiendo bajo carga basica:\n"
        "- stages: Escala la carga de usuarios virtuales a 10 VUs en 10s, mantiene 10 VUs por 20s y baja a 0 en 10s.\n"
        "- thresholds: Define limites de fallo si mas del 10% de peticiones fallan o el 95% de respuestas toman >500ms."
    )
    pdf.multi_cell(0, 5, health_text)
    pdf.ln(2)

    # Item 1.4.2
    pdf.set_font('helvetica', 'B', 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, '  Prueba de Carga del Endpoint (tests/k6/cta-endpoints.js)', 0, 1, 'L')
    
    pdf.set_font('helvetica', '', 9.5)
    pdf.set_text_color(51, 65, 85)
    cta_perf_text = (
        "Simula un escenario de alta concurrencia real donde multiples usuarios se registran al mismo tiempo:\n"
        "- Carga Incremental: Escala gradualmente de 0 a 50 usuarios concurrentes en un periodo de 45 segundos.\n"
        "- Generacion Aleatoria: Usa datos dinamicos en cada iteracion para simular multiples usuarios reales y "
        "prevenir errores de base de datos por llaves unicas duplicadas.\n"
        "- Metricas Personalizadas: Define las metricas cta_errors y cta_latency para trackear rendimiento y fallos.\n"
        "- handleSummary: Genera un reporte personalizado y legible directamente en la consola mostrando porcentajes "
        "de exito, tiempos minimos, maximos, promedios y percentiles claves (p95 y p99)."
    )
    pdf.multi_cell(0, 5, cta_perf_text)
    pdf.ln(8)

    # ----------------------------------------------------
    # SECCION 2: PARTE 2
    # ----------------------------------------------------
    pdf.set_font('helvetica', 'B', 13)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, 'PARTE 2: Apartado de "Inventario por Lotes"', 0, 1, 'L')
    
    pdf.set_font('helvetica', 'I', 9.5)
    pdf.set_text_color(71, 85, 105)
    nota_p2 = (
        "Nota: Este codigo se encuentra en la rama remota 'feature/inventario-lotes'. A continuacion se "
        "detalla la logica e implementacion tecnica de esta solucion basandonos en sus criterios de aceptacion:"
    )
    pdf.multi_cell(0, 5, nota_p2)
    pdf.ln(3)

    # Items de la parte 2
    items_p2 = [
        ("Definicion de Datos Ficticios (Mock Data)",
         "Se crearon constantes estructuradas para representar LoteInventario y Producto con formato de fecha YYYY-MM-DD "
         "y campos como cantidades, fecha de ingreso, caducidad, producto y estado, manteniendo la logica aislada en memoria."),
        
        ("Estados Derivados (Render Logic)",
         "El componente calcula en tiempo real (en el renderizado) los estados clave:\n"
         "- Lotes proximos a caducar: Calcula si quedan menos de 7 dias entre la fecha actual y la fecha de caducidad, "
         "marcandolos como PROXIMO_CADUCAR (destacado en amarillo/naranja con iconos).\n"
         "- Stock Bajo: Evalua si la cantidad actual es inferior al limite minimo establecido y lo destaca en rojo."),
        
        ("Busqueda y Filtros en Memoria",
         "Se aplican filtros con .filter() de JavaScript en base a los criterios de busqueda (por nombre/codigo) "
         "y selectores (por categoria, estado de caducidad/stock y rango de fechas), ejecutandose al instante sobre los mocks."),
        
        ("Interactividad del Dashboard",
         "Se implemento una fila expandible y/o un modal para ver el detalle de cada lote. Los botones Editar, "
         "Eliminar y Agregar simulan la operacion manipulando el estado de React (useState), sin comunicarse con el backend "
         "y mostrando confirmaciones visuales."),
        
        ("Diseno Responsive",
         "Diseno flexible adaptable que colapsa la tabla en tarjetas amigables en pantallas moviles y se muestra como "
         "tabla de datos completa en pantallas desktop.")
    ]
    
    for title, desc in items_p2:
        pdf.set_font('helvetica', 'B', 9.5)
        pdf.set_text_color(29, 78, 216)
        pdf.cell(0, 6, f'  {title}', 0, 1, 'L')
        pdf.set_font('helvetica', '', 9.5)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5, desc)
        pdf.ln(2)

    # Guardar PDF
    pdf.output(output_path)

if __name__ == '__main__':
    # Creando la ruta de salida en el workspace
    workspace_dir = r"c:\Users\Usuario\OneDrive\Escritorio\ReStock-SaaS"
    out_file = os.path.join(workspace_dir, "Reporte_Explicativo_Codigo.pdf")
    create_pdf(out_file)
    print(f"PDF generado exitosamente en: {out_file}")
