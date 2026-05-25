'use client';

export function Features() {
  const benefits = [
    {
      icon: '📊',
      title: 'Control en Tiempo Real',
      description: 'Visualiza tu inventario desde cualquier dispositivo instantáneamente'
    },
    {
      icon: '⏰',
      title: 'Alertas de Vencimiento',
      description: 'Notificaciones automáticas de productos próximos a caducar'
    },
    {
      icon: '📉',
      title: 'Reducción de Pérdidas',
      description: 'Minimiza productos obsoletos y mermas por manejo ineficiente'
    },
    {
      icon: '⚡',
      title: 'Operaciones Más Rápidas',
      description: 'Automatiza procesos que antes hacías manualmente en hojas de cálculo'
    },
    {
      icon: '💰',
      title: 'Mayor Rentabilidad',
      description: 'Optimiza costos y mejora márgenes con gestión eficiente'
    },
    {
      icon: '🔒',
      title: 'Datos Seguros',
      description: 'Información centralizada y protegida en la nube'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            El Problema que Enfrenta tu Negocio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Farmacias y tiendas pierden miles en ingresos por irregularidades en inventario y productos caducados
          </p>
        </div>

        {/* Problem Definition */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-red-50 p-8 rounded-lg border border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-3">El Problema</h3>
            <p className="text-red-800">
              Irregularidades en la cantidad de productos y stock caducado que se vende o se pierde sin control.
            </p>
          </div>

          <div className="bg-orange-50 p-8 rounded-lg border border-orange-200">
            <h3 className="text-xl font-bold text-orange-900 mb-3">La Causa</h3>
            <p className="text-orange-800">
              Manejo ineficiente del inventario basado en hojas de cálculo manuales y procesos desorganizados.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-3">La Solución</h3>
            <p className="text-green-800">
              ReStock-SaaS: gestión inteligente de inventario que te recupera control y rentabilidad.
            </p>
          </div>
        </div>

        {/* Benefits Title */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Beneficios que Transforman tu Negocio
          </h3>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="text-4xl mb-3">{benefit.icon}</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h4>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Cansado de las hojas de cálculo?
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            ReStock-SaaS automatiza tu gestión de inventario. Mantén el control, evita pérdidas, aumenta ganancias.
          </p>
          <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition">
            Comenzar Prueba Gratuita
          </button>
        </div>
      </div>
    </section>
  );
}
