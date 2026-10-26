'use client';
import { workflowWords } from './workflow-translations';
import { createContext, useContext, useEffect, useState } from 'react';
const words: Record<string, string> = {
  'Rides from others': 'Alguien me lleva',
  'Food pantry assistance': 'Ayuda de despensas',
  'School meal programs': 'Programas de comidas escolares',
  'Senior food programs': 'Programas de alimentos para mayores',
  Unsure: 'No sé',
  'No preference': 'Sin preferencia',
  Pescatarian: 'Pescetariana',
  'Other/custom': 'Otra / personalizada',
  milk: 'leche',
  egg: 'huevo',
  fish: 'pescado',
  shellfish: 'mariscos',
  'tree nuts': 'frutos secos',
  peanuts: 'cacahuetes',
  wheat: 'trigo',
  soy: 'soja',
  sesame: 'sésamo',
  'More fruits and vegetables': 'Más frutas y verduras',
  'More whole grains': 'Más granos integrales',
  'Increase fiber': 'Aumentar fibra',
  'Increase protein': 'Aumentar proteínas',
  'Reduce added sugar': 'Reducir azúcar añadida',
  'Reduce sodium': 'Reducir sodio',
  'Cook more meals at home': 'Cocinar más en casa',
  'Build balanced meals': 'Preparar comidas equilibradas',
  'Healthy-weight support': 'Apoyo para un peso saludable',
  'Stretch my food budget': 'Aprovechar mi presupuesto',
  'Heart-conscious choices': 'Opciones para cuidar el corazón',
  'Blood-sugar-conscious choices': 'Opciones para cuidar la glucosa',
  'General healthy eating': 'Alimentación saludable general',
  'No additional preference': 'Sin preferencia adicional',
  'Toaster oven': 'Horno tostador',
  'Slow cooker': 'Olla de cocción lenta',
  'Pressure cooker': 'Olla a presión',
  'Rice cooker': 'Arrocera',
  Grill: 'Parrilla',
  'Baking sheet': 'Bandeja para hornear',
  Knife: 'Cuchillo',
  'Cutting board': 'Tabla para cortar',
  'Can opener': 'Abrelatas',
  'Measuring cups': 'Tazas medidoras',
  'Very limited cooking equipment': 'Equipo de cocina muy limitado',
  'Interactive map of resources on the current results page':
    'Mapa interactivo de recursos de esta página de resultados',
  'Loading the neighborhood map…': 'Cargando el mapa…',
  'Map background unavailable. Use the resource list and address-based directions.':
    'Fondo del mapa no disponible. Usa la lista de recursos y las indicaciones por dirección.',

  'Loading profile…': 'Cargando preferencias…',
  'Your profile is saved only in this browser. These preferences do not currently filter live listings. It is not an account, and FreshRoute does not send these preferences to a server.':
    'Tus preferencias se guardan solo en este navegador. Actualmente no filtran los listados oficiales. No es una cuenta y FreshRoute no las envía a un servidor.',
  'Saved on this device': 'Guardado en este dispositivo',
  'Ready to save changes': 'Listo para guardar cambios',
  'You can clear it anytime.': 'Puedes borrarlo cuando quieras.',
  'Location and household': 'Ubicación y hogar',
  'ZIP code': 'Código postal',
  'Maximum distance': 'Distancia máxima',
  'Maximum time': 'Tiempo máximo',
  'Household size': 'Personas en el hogar',
  Adults: 'Adultos',
  Children: 'Niños',
  'Optional age ranges': 'Rangos de edad opcionales',
  'Budget, transportation and assistance':
    'Presupuesto, transporte y asistencia',
  'Weekly food budget': 'Presupuesto semanal de alimentos',
  'Custom amount': 'Cantidad personalizada',
  Prioritize: 'Priorizar',
  'Free resources first': 'Recursos gratuitos primero',
  'Cheapest possible': 'Lo más económico posible',
  'Best balance of nutrition and price': 'Equilibrio entre nutrición y precio',
  'Closest options': 'Opciones más cercanas',
  'Food assistance': 'Asistencia alimentaria',
  'SNAP and WIC are payment/access details. They never increase a nutrition match.':
    'SNAP y WIC son opciones de pago o acceso; no aumentan una coincidencia nutricional.',
  'Food preferences and allergies': 'Preferencias alimentarias y alergias',
  'Dietary preferences': 'Preferencias de dieta',
  'Food allergies': 'Alergias alimentarias',
  'Other dietary preference': 'Otra preferencia de dieta',
  'Other allergy or note': 'Otra alergia o nota',
  Optional: 'Opcional',
  'A missing ingredient label does not make a food allergy safe. FreshRoute shows confirmed conflicts, no listed conflicts, or unknown information.':
    'La falta de una etiqueta de ingredientes no garantiza seguridad para alergias. La información puede ser desconocida; verifica con el proveedor.',
  'Nutrition, healthy eating and kitchen': 'Nutrición, alimentación y cocina',
  'Nutrition goals': 'Objetivos de nutrición',
  'Healthy eating preferences': 'Preferencias de alimentación',
  'Food storage': 'Almacenamiento de alimentos',
  'Kitchen equipment': 'Equipo de cocina',
  Refrigerator: 'Refrigerador',
  Freezer: 'Congelador',
  Neither: 'Ninguno',
  'Healthy-weight, heart-conscious and blood-sugar-conscious choices are preferences only. FreshRoute does not diagnose, treat disease or make weight-loss plans.':
    'Estas opciones son solo preferencias. FreshRoute no diagnostica, trata enfermedades ni crea planes para perder peso.',
  'Save food preferences': 'Guardar preferencias',
  'Clear device profile': 'Borrar preferencias del dispositivo',
  '1 mile': '1 milla',
  '3 miles': '3 millas',
  '5 miles': '5 millas',
  '10 miles': '10 millas',
  '15 minutes': '15 minutos',
  '30 minutes': '30 minutos',
  '45 minutes': '45 minutos',
  '60 minutes': '60 minutos',
  Custom: 'Personalizado',
  'Prefer not to say': 'Prefiero no responder',
  None: 'Ninguno',
  Walking: 'A pie',
  'Public transit': 'Transporte público',
  Car: 'Automóvil',
  'Ride from someone else': 'Alguien me lleva',
  Bicycle: 'Bicicleta',
  'No reliable transportation': 'Sin transporte confiable',
  Vegetarian: 'Vegetariana',
  Vegan: 'Vegana',
  'Gluten-free': 'Sin gluten',
  Halal: 'Halal',
  Kosher: 'Kosher',
  'Lactose-free': 'Sin lactosa',
  Other: 'Otra',
  Milk: 'Leche',
  Eggs: 'Huevos',
  Fish: 'Pescado',
  Shellfish: 'Mariscos',
  'Tree nuts': 'Frutos secos',
  Peanuts: 'Cacahuetes',
  Wheat: 'Trigo',
  Soy: 'Soja',
  Sesame: 'Sésamo',
  Microwave: 'Microondas',
  Stove: 'Estufa',
  Oven: 'Horno',
  'Air fryer': 'Freidora de aire',
  Toaster: 'Tostadora',
  Blender: 'Licuadora',
  'Frying pan': 'Sartén',
  Pot: 'Olla',
  'Mixing bowl': 'Tazón',
  'No cooking equipment': 'Sin equipo de cocina',
  'Location is unavailable. Search by ZIP or community instead.':
    'Ubicación no disponible. Busca por código postal o comunidad.',
  'Location access was denied or unavailable. Search by ZIP, community or listed address instead.':
    'Se denegó la ubicación o no está disponible. Busca por código postal, comunidad o dirección publicada.',
  'Address service unavailable. Try a ZIP code or browser location.':
    'Servicio de direcciones no disponible. Usa un código postal o la ubicación del navegador.',
  'Invalid address response.': 'Respuesta de dirección no válida.',
  'Address lookup timed out. Try a ZIP code or browser location.':
    'La búsqueda tardó demasiado. Usa un código postal o la ubicación del navegador.',
  'Food & nutrition resources': 'Recursos de alimentación y nutrición',
  'Use trusted sources for nutrition and food assistance.':
    'Usa fuentes confiables de nutrición y asistencia alimentaria.',
  'Always check the actual product label for ingredients, allergens and nutrition. FreshRoute does not publish simulated product labels.':
    'Consulta la etiqueta real para ingredientes, alérgenos y nutrición. FreshRoute no publica etiquetas simuladas.',
  'USDA MyPlate': 'MiPlato del USDA',
  'Maryland Food Bank food finder':
    'Buscador de alimentos de Maryland Food Bank',
  'Maryland SNAP information': 'Información sobre SNAP de Maryland',
  'Your approximate location': 'Tu ubicación aproximada',
  'Selected address · approximate area':
    'Dirección seleccionada · zona aproximada',
  'Estimated center': 'Centro estimado',
  'not provided': 'no publicado',
  'Nearby results use an approximate community center. Closest does not mean available or eligible.':
    'Los resultados usan un centro comunitario aproximado. La cercanía no confirma disponibilidad ni elegibilidad.',
  'No listed locations for that ZIP. Try another Maryland ZIP, community or optional address lookup.':
    'No hay ubicaciones publicadas para ese código postal. Prueba otro código, comunidad o la búsqueda opcional por dirección.',
  'ZIP center estimated from listed resource locations, not an official ZIP boundary or your address.':
    'El centro del código postal se estima con los recursos publicados; no es un límite oficial ni tu dirección.',
  'Searching names and listed addresses locally. To find resources near a different street address, use the optional address lookup below.':
    'Se buscan nombres y direcciones publicadas localmente. Para otra dirección usa la búsqueda opcional.',
  'Search cleared.': 'Búsqueda borrada.',
  'Waiting for your browser’s location permission…':
    'Esperando permiso de ubicación del navegador…',
  'Location rounded to about 1 km before use and kept in memory only. If the map is loaded, map-area requests can reveal an approximate location.':
    'La ubicación se redondea a aproximadamente 1 km y solo se guarda en memoria. El mapa puede revelar la zona aproximada.',
  'Search location cleared. Browser location permission can be revoked in your browser settings.':
    'Ubicación borrada. Puedes revocar el permiso en la configuración del navegador.',
  'Enter a street number, street, Maryland city and ZIP for address lookup.':
    'Ingresa el número, la calle, la ciudad de Maryland y el código postal.',
  'Choose the matching address below. Coordinates are approximate.':
    'Elige la dirección correcta abajo. Las coordenadas son aproximadas.',
  'No matching Maryland address found. Check the street number, city and ZIP, or use ZIP search.':
    'No se encontró una dirección en Maryland. Revisa la dirección o usa el código postal.',
  'Address lookup unavailable.':
    'La búsqueda por dirección no está disponible.',
  'Find food': 'Buscar alimentos',
  'Choose a meal': 'Elegir una comida',
  'Plan your spending': 'Planificar gastos',
  Colors: 'Colores',
  Close: 'Cerrar',
  Pine: 'Pino',
  Moss: 'Musgo',
  Dusk: 'Atardecer',
  'Custom accent color': 'Color de acento personalizado',
  'Restore default': 'Restaurar predeterminado',
  Language: 'Idioma',
  'Main navigation': 'Navegación principal',
  'More resources': 'Más recursos',
  Community: 'Comunidad',
  Learn: 'Aprender',
  About: 'Acerca de',
  'Sourced directory': 'Directorio con fuentes',
  'Food preferences': 'Preferencias alimentarias',
  'Provider data': 'Datos de proveedores',
  'Data & methodology': 'Datos y metodología',
  Privacy: 'Privacidad',
  Terms: 'Términos',
  Credits: 'Créditos',
  'Skip to content': 'Saltar al contenido',
  'Find food.': 'Encuentra alimentos.',
  'Plan your next meal.': 'Planifica tu próxima comida.',
  'Find food resources, simple meals, and grocery costs in one place.':
    'Encuentra recursos alimentarios, comidas sencillas y costos de compras en un solo lugar.',
  'Find food near you.': 'Encuentra alimentos cerca de ti.',
  'Location or resource': 'Ubicación o recurso',
  'ZIP, community, resource name or listed address':
    'Código postal, comunidad, recurso o dirección publicada',
  Transportation: 'Transporte',
  'Public transportation': 'Transporte público',
  'Any travel': 'Cualquier transporte',
  'Transport is a planning preference; distances are straight-line, not routes or travel times.':
    'El transporte es una preferencia de planificación; las distancias son en línea recta, no rutas ni tiempos de viaje.',
  'Use my location': 'Usar mi ubicación',
  'Locating…': 'Localizando…',
  'Clear location': 'Borrar ubicación',
  Filters: 'Filtros',
  Reset: 'Restablecer',
  'Resource type': 'Tipo de recurso',
  Distance: 'Distancia',
  'Phone listed': 'Con teléfono',
  Service: 'Servicio',
  'All services': 'Todos los servicios',
  'SNAP accepted': 'Acepta SNAP',
  'Benefits information': 'Información sobre beneficios',
  'All resources': 'Todos los recursos',
  'Food Pantry': 'Despensa de alimentos',
  'SNAP-Authorized Retailer': 'Comercio autorizado para SNAP',
  'Community Meal / Soup Kitchen': 'Comedor comunitario',
  'Grocery Store': 'Tienda de comestibles',
  'Farmers Market': 'Mercado agrícola',
  'WIC Resource': 'Recurso WIC',
  'Food Distribution': 'Distribución de alimentos',
  'Youth/Summer Meals': 'Comidas para jóvenes / verano',
  'Senior Food Assistance': 'Asistencia alimentaria para mayores',
  'Emergency Food Assistance': 'Asistencia alimentaria de emergencia',
  'Other Food Resource': 'Otro recurso alimentario',
  'Official source listings': 'Listados de fuentes oficiales',
  'Listings refresh every 60 seconds while this page is open. Hours, eligibility and stock must be confirmed with the provider. No stock feed is connected.':
    'Los listados se actualizan cada 60 segundos mientras esta página está abierta. Confirma horarios, requisitos y existencias con el proveedor. No hay una conexión de inventario.',
  'Sources & dates': 'Fuentes y fechas',
  'Refresh listings': 'Actualizar listados',
  'Last successful source retrieval': 'Última consulta de fuentes correcta',
  'Resources to explore': 'Recursos para explorar',
  'Loading resources…': 'Cargando recursos…',
  Near: 'Cerca de',
  'up to': 'hasta',
  mi: 'mi',
  'Sort resources': 'Ordenar recursos',
  'Nearest first': 'Más cercanos primero',
  'Name A–Z': 'Nombre A–Z',
  'Straight-line distance · not travel time':
    'Distancia en línea recta · no tiempo de viaje',
  'View details': 'Ver detalles',
  Online: 'En línea',
  'Hours not supplied — verify with provider':
    'Horario no publicado: confirma con el proveedor',
  'Eligibility and visit requirements not supplied.':
    'No se publicaron requisitos de elegibilidad y visita.',
  'Address not supplied': 'Dirección no publicada',
  'Stock unknown — contact provider before visiting.':
    'Existencias desconocidas: contacta al proveedor antes de ir.',
  'Purchases are not free food assistance.':
    'Las compras no son asistencia alimentaria gratuita.',
  'Verified from source': 'Verificado en la fuente',
  'Potentially outdated': 'Posiblemente desactualizado',
  'Recently imported': 'Importado recientemente',
  'Verification recommended': 'Se recomienda verificar',
  'No matches in this view': 'No hay coincidencias en esta vista',
  'Try another ZIP, a larger distance or fewer filters. No matches does not mean no help exists.':
    'Prueba otro código postal, una distancia mayor o menos filtros. Sin coincidencias no significa que no haya ayuda.',
  'Clear filters': 'Borrar filtros',
  'Resources couldn’t load': 'No se pudieron cargar los recursos',
  'Please retry or use the official directory linked below.':
    'Vuelve a intentarlo o usa el directorio oficial enlazado abajo.',
  Retry: 'Reintentar',
  Previous: 'Anterior',
  Next: 'Siguiente',
  Page: 'Página',
  of: 'de',
  'Optional map': 'Mapa opcional',
  'Show map': 'Mostrar mapa',
  'Hide map': 'Ocultar mapa',
  'Load interactive map': 'Cargar mapa interactivo',
  'Loading the map shares your IP address and the displayed area with OpenStreetMap.':
    'Al cargar el mapa se comparten tu dirección IP y la zona mostrada con OpenStreetMap.',
  'Need food assistance now?': '¿Necesitas ayuda alimentaria ahora?',
  'Confirm options through the Maryland Food Bank directory or 211 Maryland.':
    'Confirma opciones en el directorio de Maryland Food Bank o 211 Maryland.',
  Location: 'Ubicación',
  Hours: 'Horario',
  'Eligibility & visit instructions': 'Requisitos e instrucciones de visita',
  Cost: 'Costo',
  'Services explicitly listed': 'Servicios publicados',
  'Not confirmed by source': 'No confirmado por la fuente',
  'Not supplied. Check with the provider.':
    'No publicado. Consulta con el proveedor.',
  'Published schedule. Not live availability.':
    'Horario publicado. No indica disponibilidad en tiempo real.',
  'Get directions': 'Obtener indicaciones',
  Call: 'Llamar',
  'Source information is shown in its original language.':
    'La información de la fuente se muestra en su idioma original.',
  'Source differences — verify directly':
    'Diferencias entre fuentes: verifica directamente',
  'Visit official resource': 'Visitar recurso oficial',
  Imported: 'Importado',
  'Source updated': 'Fuente actualizada',
  'Last verified from source': 'Última verificación en la fuente',
  'Not supplied': 'No publicado',
  'Find near a street address': 'Buscar cerca de una dirección',
  'Optional: this sends your typed address to the U.S. Census Bureau. ZIP search stays local.':
    'Opcional: envía la dirección escrita a la Oficina del Censo de EE. UU. La búsqueda por código postal es local.',
  'Maryland street address': 'Dirección en Maryland',
  'Send this address to Census for this lookup':
    'Enviar esta dirección al Censo para esta consulta',
  'Locate address': 'Localizar dirección',
  'Looking up…': 'Buscando…',
  'Optional location is rounded and kept only for this visit.':
    'La ubicación opcional se redondea y se conserva solo durante esta visita.',
  'Independent student project.': 'Proyecto estudiantil independiente.',
  'Colors are saved on this device.':
    'Los colores se guardan en este dispositivo.',
  'Choose a palette or set an accent. Readable text and buttons adjust automatically.':
    'Elige una paleta o un acento. El texto y los botones se ajustan para mantener su legibilidad.',
  'Meal ideas need ingredients you actually have.':
    'Las ideas de comidas necesitan ingredientes que realmente tengas.',
  'Current pantry ingredients are not confirmed.':
    'Los ingredientes actuales de las despensas no están confirmados.',
  'Inventory-based suggestions are unavailable until a provider confirms ingredients. Your food preferences remain saved on this device.':
    'Las sugerencias según inventario no están disponibles hasta que un proveedor confirme los ingredientes. Tus preferencias alimentarias permanecen guardadas en este dispositivo.',
  'Edit food preferences': 'Editar preferencias alimentarias',
  'Find sourced food resources': 'Buscar recursos con fuentes',
  'Enter your budget to see what is left after groceries.':
    'Ingresa tu presupuesto para ver cuánto queda después de las compras.',
  'Use your own prices': 'Usa tus propios precios',
  'Enter prices from your receipt or retailer. No live or demo prices are supplied.':
    'Ingresa precios de tu recibo o comercio. No se proporcionan precios en tiempo real ni de demostración.',
  'Budget ($)': 'Presupuesto ($)',
  'Grocery item': 'Producto',
  'Price per unit ($)': 'Precio por unidad ($)',
  Quantity: 'Cantidad',
  'Add item': 'Agregar producto',
  Remove: 'Eliminar',
  'Total groceries': 'Total de compras',
  Remaining: 'Restante',
  'Over budget': 'Por encima del presupuesto',
  'Enter a valid budget and nonnegative prices; quantities must be at least 1.':
    'Ingresa un presupuesto y precios válidos no negativos; las cantidades deben ser al menos 1.',
  'Total includes only the items and quantities entered here. It does not add taxes, fees or other household expenses.':
    'El total incluye solo los productos y cantidades ingresados aquí. No agrega impuestos, cargos ni otros gastos del hogar.',
  'No groceries added yet.': 'Aún no se han agregado productos.',
};
type Context = {
  language: string;
  setLanguage: (s: string) => void;
  t: (s: string) => string;
};
const Language = createContext<Context>({
  language: 'en',
  setLanguage: () => {},
  t: (s) => s,
});
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, set] = useState('en');
  useEffect(() => {
    try {
      set(localStorage.getItem('freshroute-language') === 'es' ? 'es' : 'en');
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const setLanguage = (s: string) => {
    set(s);
    try {
      localStorage.setItem('freshroute-language', s);
    } catch {}
  };
  return (
    <Language.Provider
      value={{
        language,
        setLanguage,
        t: (s) => (language === 'es' ? workflowWords[s] || words[s] || s : s),
      }}
    >
      {children}
    </Language.Provider>
  );
}
export const useLanguage = () => useContext(Language);
