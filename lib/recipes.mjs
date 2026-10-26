// Original, AI-assisted recipe instructions. No store inventory or price data.
const text = (en, es) => ({ en, es });
export const ingredients = {
  'canned-chickpeas': {
    name: text('Canned chickpeas, drained', 'Garbanzos enlatados, escurridos'),
    aliases: [
      'canned chickpeas',
      'canned garbanzo beans',
      'garbanzos enlatados',
    ],
    allergens: [],
    product: true,
  },
  'canned-black-beans': {
    name: text(
      'Canned black beans, drained',
      'Frijoles negros enlatados, escurridos',
    ),
    aliases: ['canned black beans', 'frijoles negros enlatados'],
    allergens: [],
    product: true,
  },
  'canned-corn': {
    name: text('Canned corn, drained', 'Maíz enlatado, escurrido'),
    aliases: ['canned corn', 'maiz enlatado', 'maíz enlatado'],
    allergens: [],
    product: true,
  },
  'olive-oil': {
    name: text('Olive oil', 'Aceite de oliva'),
    aliases: ['olive oil', 'aceite de oliva'],
    allergens: [],
    product: true,
  },
  'lemon-juice': {
    name: text('Bottled lemon juice', 'Jugo de limón embotellado'),
    aliases: ['bottled lemon juice', 'jugo de limon embotellado'],
    allergens: [],
    product: true,
  },
  'rolled-oats': {
    name: text('Old-fashioned rolled oats', 'Avena tradicional en hojuelas'),
    aliases: [
      'rolled oats',
      'old fashioned oats',
      'old-fashioned rolled oats',
      'avena en hojuelas',
      'avena tradicional en hojuelas',
    ],
    allergens: [],
    product: true,
  },
  banana: {
    name: text('Banana', 'Banana'),
    aliases: ['banana', 'bananas', 'banano'],
    allergens: [],
    product: false,
  },
  water: {
    name: text('Drinking water', 'Agua potable'),
    aliases: ['drinking water', 'water', 'agua', 'agua potable'],
    allergens: [],
    product: false,
  },
  'plain-yogurt': {
    name: text('Plain dairy yogurt', 'Yogur natural de leche'),
    aliases: ['plain dairy yogurt', 'plain yogurt', 'yogur natural de leche'],
    allergens: ['milk'],
    product: true,
  },
  'whole-wheat-bread': {
    name: text('Whole-wheat bread', 'Pan integral de trigo'),
    aliases: [
      'whole wheat bread',
      'whole-wheat bread',
      'pan integral de trigo',
    ],
    allergens: ['wheat'],
    product: true,
  },
  'canned-tuna': {
    name: {
      en: 'Canned tuna in water, drained',
      es: 'Atún enlatado en agua, escurrido',
    },
    aliases: ['canned tuna', 'atun enlatado'],
    allergens: ['fish'],
    product: true,
  },
  'peanut-butter': {
    name: { en: 'Peanut butter', es: 'Crema de cacahuate' },
    aliases: ['peanut butter', 'mantequilla de mani', 'crema de cacahuate'],
    allergens: ['peanuts'],
    product: true,
  },
  'wheat-tortilla': {
    name: { en: 'Medium wheat tortilla', es: 'Tortilla mediana de trigo' },
    aliases: ['wheat tortilla', 'tortilla de trigo'],
    allergens: ['wheat'],
    product: true,
  },
  'sweet-potato': {
    name: { en: 'Medium sweet potato', es: 'Camote mediano' },
    aliases: ['sweet potato', 'camote', 'batata'],
    allergens: [],
    product: false,
  },
  'ready-rice': {
    name: {
      en: 'Shelf-stable fully cooked plain rice',
      es: 'Arroz blanco cocido en envase estable',
    },
    aliases: [
      'fully cooked rice',
      'ready to heat rice',
      'arroz cocido en envase',
    ],
    allergens: [],
    product: true,
  },
  'canned-tomatoes': {
    name: {
      en: 'Canned diced tomatoes with juice',
      es: 'Tomates enlatados en cubos con su jugo',
    },
    aliases: ['canned diced tomatoes', 'tomates enlatados'],
    allergens: [],
    product: true,
  },
  'dry-pasta': {
    name: {
      en: 'Dry wheat pasta, small shapes',
      es: 'Pasta seca de trigo, corta',
    },
    aliases: ['dry wheat pasta', 'pasta seca de trigo'],
    allergens: ['wheat'],
    product: true,
  },
  'dry-red-lentils': {
    name: { en: 'Dry split red lentils', es: 'Lentejas rojas partidas secas' },
    aliases: ['dry red lentils', 'split red lentils', 'lentejas rojas secas'],
    allergens: [],
    product: true,
  },
};
export const equipment = [
  ['strainer', 'Fine-mesh strainer / colander', 'Colador de malla fina'],
  [
    'microwave-cover',
    'Vented microwave-safe cover',
    'Tapa ventilada apta para microondas',
  ],
  ['bowl', 'Mixing bowl', 'Tazón'],
  ['spoon', 'Spoon', 'Cuchara'],
  ['fork', 'Fork', 'Tenedor'],
  ['can-opener', 'Can opener', 'Abrelatas'],
  ['measuring-cup', 'Measuring cups', 'Tazas medidoras'],
  ['measuring-spoon', 'Measuring spoons', 'Cucharas medidoras'],
  ['stove', 'Stove', 'Estufa'],
  ['pot', 'Pot', 'Olla'],
  ['microwave', 'Microwave', 'Microondas'],
  [
    'microwave-bowl',
    'Large microwave-safe bowl',
    'Tazón grande apto para microondas',
  ],
  ['oven-mitts', 'Oven mitts', 'Guantes de cocina'],
];
export const allergens = [
  'milk',
  'egg',
  'fish',
  'shellfish',
  'tree nuts',
  'peanuts',
  'wheat',
  'soy',
  'sesame',
];
export const storageGuidance = text(
  'Use clean hands, utensils and drinking water. Use undamaged, commercially canned food labeled ready to eat; never substitute dried beans. Eat promptly. Refrigerate perishables and leftovers at 40°F / 4°C or below within 2 hours (1 hour above 90°F / 32°C). Without refrigeration, prepare only what you will eat and discard the rest within those limits. Follow package storage instructions.',
  'Usa manos y utensilios limpios y agua potable. Usa alimentos comerciales enlatados sin daños y listos para comer; no los sustituyas por frijoles secos. Come pronto. Refrigera los perecederos y las sobras a 40°F / 4°C o menos antes de 2 horas (1 hora si hace más de 90°F / 32°C). Sin refrigeración, prepara solo lo que comerás y desecha lo demás dentro de esos límites. Sigue las instrucciones de conservación del envase.',
);
export const safetySource =
  'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/steps-keep-food-safe';
const ingredient = (id, quantity, unit) => ({ id, quantity, unit });
export const recipes = [
  {
    id: 'chickpea-sandwich',
    name: text('Lemon chickpea sandwich', 'Sándwich de garbanzos y limón'),
    description: text(
      'Mash canned chickpeas into a simple sandwich filling.',
      'Machaca garbanzos enlatados para un relleno sencillo.',
    ),
    servings: 2,
    minutes: 10,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      ingredient('canned-chickpeas', 1, 'cup'),
      ingredient('olive-oil', 1, 'tbsp'),
      ingredient('lemon-juice', 1, 'tbsp'),
      ingredient('whole-wheat-bread', 4, 'slice'),
    ],
    methods: [
      {
        id: 'no-cook',
        name: text('No-cook method', 'Sin cocción'),
        equipment: [
          'bowl',
          'fork',
          'spoon',
          'can-opener',
          'measuring-cup',
          'measuring-spoon',
        ],
        steps: [
          text(
            'Open the chickpeas, drain off the liquid using the lid carefully, and measure the drained chickpeas. Avoid sharp can edges.',
            'Abre los garbanzos, escurre el líquido con cuidado usando la tapa y mide los garbanzos escurridos. Evita los bordes afilados.',
          ),
          text(
            'In a bowl, mash the chickpeas with a fork. Stir in the measured olive oil and bottled lemon juice until combined.',
            'En un tazón, machaca los garbanzos con un tenedor. Incorpora el aceite de oliva y el jugo de limón medidos.',
          ),
          text(
            'Divide the filling between half the bread slices. Cover each with a second slice and serve immediately.',
            'Reparte el relleno sobre la mitad de las rebanadas. Cubre cada una con otra rebanada y sirve de inmediato.',
          ),
        ],
      },
    ],
  },
  {
    id: 'bean-corn-salad',
    name: text(
      'Black bean and corn salad',
      'Ensalada de frijoles negros y maíz',
    ),
    description: text(
      'A small meal of ready-to-eat canned beans and corn with lemon dressing.',
      'Una comida pequeña de frijoles y maíz enlatados listos para comer, con aderezo de limón.',
    ),
    servings: 2,
    minutes: 10,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      ingredient('canned-black-beans', 1, 'cup'),
      ingredient('canned-corn', 1, 'cup'),
      ingredient('olive-oil', 1, 'tbsp'),
      ingredient('lemon-juice', 1, 'tbsp'),
    ],
    methods: [
      {
        id: 'no-cook',
        name: text('No-cook method', 'Sin cocción'),
        equipment: [
          'bowl',
          'spoon',
          'can-opener',
          'measuring-cup',
          'measuring-spoon',
        ],
        steps: [
          text(
            'Open the cans and carefully drain the liquid using each lid. Measure the drained beans and corn; avoid sharp can edges.',
            'Abre las latas y escurre el líquido con cuidado usando cada tapa. Mide los frijoles y el maíz escurridos; evita los bordes afilados.',
          ),
          text(
            'Put the beans and corn in a bowl. Add the measured olive oil and lemon juice.',
            'Pon los frijoles y el maíz en un tazón. Añade el aceite de oliva y el jugo de limón medidos.',
          ),
          text(
            'Stir gently until coated and serve promptly. Follow the storage guidance for opened cans and leftovers.',
            'Mezcla suavemente y sirve pronto. Sigue las indicaciones de conservación para las latas abiertas y las sobras.',
          ),
        ],
      },
    ],
  },
  {
    id: 'banana-oats',
    name: text('Warm banana oats', 'Avena caliente con banana'),
    description: text(
      'Rolled oats cooked in water, finished with mashed banana.',
      'Avena en hojuelas cocida en agua con banana machacada.',
    ),
    servings: 1,
    minutes: 10,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      ingredient('rolled-oats', 0.5, 'cup'),
      ingredient('water', 1, 'cup'),
      ingredient('banana', 1, 'each'),
    ],
    methods: [
      {
        id: 'stove',
        name: text('Stovetop method', 'En la estufa'),
        equipment: [
          'stove',
          'pot',
          'spoon',
          'fork',
          'measuring-cup',
          'oven-mitts',
        ],
        steps: [
          text(
            'Measure the water into a pot and bring it to a boil. Stir in the old-fashioned rolled oats and reduce to a gentle simmer.',
            'Mide el agua en una olla y llévala a hervor. Incorpora la avena tradicional y baja el fuego para mantener un hervor suave.',
          ),
          text(
            'Cook for about 5 minutes, stirring often, until the oats are tender and thickened. Follow the oat package if its instructions differ; add a little drinking water if needed to prevent sticking.',
            'Cocina unos 5 minutos, removiendo con frecuencia, hasta que la avena esté tierna y espese. Sigue el envase si sus instrucciones difieren; agrega un poco de agua potable si hace falta para que no se pegue.',
          ),
          text(
            'Turn off the heat. Peel and mash the banana with a fork, stir it into the oats, and let cool to a comfortable eating temperature. Use oven mitts for the hot pot.',
            'Apaga el fuego. Pela y machaca la banana con un tenedor, incorpórala y deja enfriar a una temperatura cómoda. Usa guantes para tocar la olla caliente.',
          ),
        ],
      },
      {
        id: 'microwave',
        name: text('Microwave method', 'En el microondas'),
        equipment: [
          'microwave',
          'microwave-bowl',
          'spoon',
          'fork',
          'measuring-cup',
          'oven-mitts',
        ],
        steps: [
          text(
            'For each serving, mix ½ cup old-fashioned rolled oats with 1 cup water in a microwave-safe bowl with at least 4 cups of capacity. Cook one serving at a time to avoid overflow.',
            'Por cada porción, mezcla ½ taza de avena tradicional con 1 taza de agua en un tazón apto para microondas de al menos 4 tazas de capacidad. Cocina una porción a la vez para evitar desbordamientos.',
          ),
          text(
            'Microwave on high for 2 minutes, stir carefully, then use 30-second intervals until tender and thickened, usually 2½–3 minutes total. Follow the package instructions for your oats and microwave; stop if the bowl threatens to overflow.',
            'Calienta a potencia alta 2 minutos, remueve con cuidado y continúa en intervalos de 30 segundos hasta que esté tierna y espese, normalmente 2½–3 minutos en total. Sigue el envase según la avena y tu microondas; detén la cocción si va a desbordarse.',
          ),
          text(
            'Use oven mitts to remove the hot bowl and let stand for 2 minutes. Peel and mash one banana per serving with a fork, stir into the oats, and cool before eating. Repeat for additional servings.',
            'Retira el tazón con guantes y deja reposar 2 minutos. Pela y machaca una banana por porción con un tenedor, incorpórala y deja enfriar antes de comer. Repite para las demás porciones.',
          ),
        ],
      },
    ],
  },
  {
    id: 'yogurt-banana',
    name: text('Banana yogurt bowl', 'Tazón de yogur y banana'),
    description: text(
      'Plain dairy yogurt with mashed banana for a small meal or snack.',
      'Yogur natural de leche con banana machacada para una comida pequeña o merienda.',
    ),
    servings: 1,
    minutes: 5,
    dietary: ['vegetarian'],
    storage: ['refrigerator'],
    ingredients: [
      ingredient('plain-yogurt', 1, 'cup'),
      ingredient('banana', 1, 'each'),
    ],
    methods: [
      {
        id: 'no-cook',
        name: text('No-cook method', 'Sin cocción'),
        equipment: ['bowl', 'spoon', 'fork', 'measuring-cup'],
        steps: [
          text(
            'Keep yogurt refrigerated at 40°F / 4°C or below until preparing the bowl. Check its label and use-by instructions.',
            'Mantén el yogur refrigerado a 40°F / 4°C o menos hasta preparar el tazón. Revisa la etiqueta y las instrucciones de consumo.',
          ),
          text(
            'Peel the banana and mash it in a clean bowl with a fork. Measure in the yogurt and stir.',
            'Pela la banana y machácala en un tazón limpio con un tenedor. Mide el yogur, añádelo y mezcla.',
          ),
          text(
            'Serve immediately and refrigerate leftovers promptly. This recipe requires a refrigerator.',
            'Sirve de inmediato y refrigera las sobras pronto. Esta receta requiere refrigerador.',
          ),
        ],
      },
    ],
  },

  {
    id: 'tuna-chickpea-bowl',
    name: {
      en: 'Tuna and chickpea bowl',
      es: 'Tazón de atún y garbanzos',
    },
    description: {
      en: 'A filling no-cook lunch using ready-to-eat canned ingredients.',
      es: 'Un almuerzo sin cocción con ingredientes enlatados listos para comer.',
    },
    servings: 1,
    minutes: 10,
    dietary: [],
    storage: [],
    ingredients: [
      {
        id: 'canned-tuna',
        quantity: 0.5,
        unit: 'cup',
      },
      {
        id: 'canned-chickpeas',
        quantity: 0.5,
        unit: 'cup',
      },
      {
        id: 'lemon-juice',
        quantity: 1,
        unit: 'tbsp',
      },
      {
        id: 'olive-oil',
        quantity: 0.5,
        unit: 'tbsp',
      },
    ],
    methods: [
      {
        id: 'no-cook',
        name: {
          en: 'No-cook method',
          es: 'Sin cocción',
        },
        equipment: [
          'bowl',
          'fork',
          'spoon',
          'can-opener',
          'strainer',
          'measuring-cup',
          'measuring-spoon',
        ],
        steps: [
          {
            en: 'Open the undamaged cans and drain the tuna and chickpeas through a clean strainer. Measure the drained amounts.',
            es: 'Abre las latas sin daños y escurre el atún y los garbanzos con un colador limpio. Mide las cantidades escurridas.',
          },
          {
            en: 'Flake the tuna with a fork in a bowl. Stir in the chickpeas, lemon juice and oil.',
            es: 'Desmenuza el atún con un tenedor en un tazón. Incorpora los garbanzos, el jugo de limón y el aceite.',
          },
          {
            en: 'Serve promptly. Refrigerate unused opened ingredients and leftovers according to the storage guidance, or discard them within its time limits.',
            es: 'Sirve pronto. Refrigera los ingredientes abiertos sin usar y las sobras según las indicaciones de conservación, o deséchalos dentro de esos plazos.',
          },
        ],
      },
    ],
  },
  {
    id: 'peanut-banana-wrap',
    name: {
      en: 'Peanut butter and banana wrap',
      es: 'Tortilla con crema de cacahuate y banana',
    },
    description: {
      en: 'A portable no-cook breakfast with three ingredients.',
      es: 'Un desayuno fácil de llevar, sin cocción y con tres ingredientes.',
    },
    servings: 1,
    minutes: 5,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      {
        id: 'wheat-tortilla',
        quantity: 1,
        unit: 'each',
      },
      {
        id: 'peanut-butter',
        quantity: 2,
        unit: 'tbsp',
      },
      {
        id: 'banana',
        quantity: 1,
        unit: 'each',
      },
    ],
    methods: [
      {
        id: 'no-cook',
        name: {
          en: 'No-cook method',
          es: 'Sin cocción',
        },
        equipment: ['bowl', 'fork', 'spoon', 'measuring-spoon'],
        steps: [
          {
            en: 'Check the tortilla label: use one labeled ready to eat without heating. Place it on a clean food-safe surface.',
            es: 'Revisa la etiqueta: usa una tortilla lista para comer sin calentar. Colócala sobre una superficie limpia apta para alimentos.',
          },
          {
            en: 'Peel the banana and mash it in the bowl with a fork. Spread the measured peanut butter over the tortilla using the spoon.',
            es: 'Pela la banana y machácala en el tazón con un tenedor. Extiende la crema de cacahuate medida sobre la tortilla con la cuchara.',
          },
          {
            en: 'Add the banana, fold in the sides and roll up. Eat promptly. Contains peanuts and wheat; check all product labels.',
            es: 'Añade la banana, dobla los lados y enrolla. Come pronto. Contiene cacahuate y trigo; revisa todas las etiquetas.',
          },
        ],
      },
    ],
  },
  {
    id: 'bean-sweet-potato',
    name: {
      en: 'Black bean sweet potato',
      es: 'Camote con frijoles negros',
    },
    description: {
      en: 'A microwave meal with a whole sweet potato and a bean-and-corn topping.',
      es: 'Una comida al microondas con camote entero y una cobertura de frijoles y maíz.',
    },
    servings: 1,
    minutes: 18,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      {
        id: 'sweet-potato',
        quantity: 1,
        unit: 'each',
      },
      {
        id: 'canned-black-beans',
        quantity: 0.5,
        unit: 'cup',
      },
      {
        id: 'canned-corn',
        quantity: 0.25,
        unit: 'cup',
      },
    ],
    methods: [
      {
        id: 'microwave',
        name: {
          en: 'Microwave method',
          es: 'En el microondas',
        },
        equipment: [
          'microwave',
          'microwave-bowl',
          'microwave-cover',
          'fork',
          'spoon',
          'can-opener',
          'strainer',
          'measuring-cup',
          'oven-mitts',
        ],
        steps: [
          {
            en: 'Cook one serving at a time. Scrub a medium sweet potato under running water and prick it several times with a fork. Place in a microwave-safe bowl; do not wrap in foil.',
            es: 'Cocina una porción a la vez. Lava un camote mediano bajo agua corriente y pínchalo varias veces con un tenedor. Ponlo en un tazón apto para microondas; no lo envuelvas en aluminio.',
          },
          {
            en: 'Microwave on high for 5 minutes. Using oven mitts, turn it carefully; continue in 1-minute intervals until a fork enters the center easily, usually 7–10 minutes total. Let stand 2 minutes. Times vary with size and microwave power.',
            es: 'Calienta a potencia alta 5 minutos. Con guantes, gíralo con cuidado; continúa en intervalos de 1 minuto hasta que un tenedor entre fácilmente al centro, normalmente 7–10 minutos en total. Deja reposar 2 minutos. El tiempo depende del tamaño y la potencia.',
          },
          {
            en: 'Drain and measure the beans and corn. Carefully split the softened potato using a fork, add the topping and cover loosely with a vented microwave-safe cover. Heat in 30-second intervals until the topping is steaming hot.',
            es: 'Escurre y mide los frijoles y el maíz. Abre el camote blando con cuidado usando un tenedor, añade la cobertura y tapa sin sellar con una tapa ventilada apta para microondas. Calienta en intervalos de 30 segundos hasta que la cobertura esté humeante.',
          },
          {
            en: 'Use mitts to remove the bowl, uncover away from your face and cool before eating. Repeat for extra servings.',
            es: 'Retira el tazón con guantes, destapa lejos de la cara y deja enfriar antes de comer. Repite para las demás porciones.',
          },
        ],
      },
    ],
  },
  {
    id: 'rice-bean-bowl',
    name: {
      en: 'Rice, bean and tomato bowl',
      es: 'Tazón de arroz, frijoles y tomate',
    },
    description: {
      en: 'A pantry-based microwave meal using fully cooked packaged rice, not dry rice.',
      es: 'Una comida al microondas con arroz cocido envasado, no arroz seco.',
    },
    servings: 1,
    minutes: 10,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      {
        id: 'ready-rice',
        quantity: 1,
        unit: 'cup',
      },
      {
        id: 'canned-black-beans',
        quantity: 0.5,
        unit: 'cup',
      },
      {
        id: 'canned-tomatoes',
        quantity: 0.5,
        unit: 'cup',
      },
    ],
    methods: [
      {
        id: 'microwave',
        name: {
          en: 'Microwave method',
          es: 'En el microondas',
        },
        equipment: [
          'microwave',
          'microwave-bowl',
          'microwave-cover',
          'spoon',
          'can-opener',
          'strainer',
          'measuring-cup',
          'oven-mitts',
        ],
        steps: [
          {
            en: 'Use shelf-stable fully cooked plain rice; do not substitute dry rice or unrefrigerated leftover rice. Cook one serving at a time. Drain and measure the beans.',
            es: 'Usa arroz blanco completamente cocido en envase estable; no lo sustituyas por arroz seco ni sobras sin refrigerar. Cocina una porción a la vez. Escurre y mide los frijoles.',
          },
          {
            en: 'Measure the rice, beans and tomatoes with their juice into a large microwave-safe bowl. Follow the rice package instructions for reheating in a bowl and any required added water.',
            es: 'Mide el arroz, los frijoles y los tomates con su jugo en un tazón grande apto para microondas. Sigue las instrucciones del envase para recalentar en un tazón y añadir agua si se requiere.',
          },
          {
            en: 'Cover with a vented microwave-safe cover. Heat according to the rice package, stir thoroughly, then use 30-second intervals until steaming hot throughout. Let stand 2 minutes; use oven mitts and open the cover away from your face.',
            es: 'Cubre con una tapa ventilada apta para microondas. Calienta según el envase del arroz, remueve bien y continúa en intervalos de 30 segundos hasta que esté humeante por completo. Deja reposar 2 minutos; usa guantes y destapa lejos de la cara.',
          },
          {
            en: 'Cool to an eating temperature and serve promptly. Repeat for extra servings; refrigerate leftovers promptly under the storage guidance.',
            es: 'Deja enfriar a una temperatura cómoda y sirve pronto. Repite para las demás porciones; refrigera pronto las sobras según las indicaciones.',
          },
        ],
      },
    ],
  },
  {
    id: 'tomato-chickpea-pasta',
    name: {
      en: 'Tomato and chickpea pasta',
      es: 'Pasta con tomate y garbanzos',
    },
    description: {
      en: 'A two-serving stovetop dinner with a simple tomato sauce.',
      es: 'Una cena para dos en la estufa con una salsa sencilla de tomate.',
    },
    servings: 2,
    minutes: 25,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      {
        id: 'dry-pasta',
        quantity: 1,
        unit: 'cup',
      },
      {
        id: 'canned-chickpeas',
        quantity: 1,
        unit: 'cup',
      },
      {
        id: 'canned-tomatoes',
        quantity: 1,
        unit: 'cup',
      },
      {
        id: 'olive-oil',
        quantity: 1,
        unit: 'tbsp',
      },
      {
        id: 'water',
        quantity: 4,
        unit: 'cup',
      },
    ],
    methods: [
      {
        id: 'stove',
        name: {
          en: 'Stovetop method',
          es: 'En la estufa',
        },
        equipment: [
          'stove',
          'pot',
          'strainer',
          'spoon',
          'can-opener',
          'measuring-cup',
          'measuring-spoon',
          'oven-mitts',
        ],
        steps: [
          {
            en: 'Drain and measure the chickpeas. Bring the water to a boil in a pot with enough room to prevent overflow. Add the dry pasta and cook according to its package, stirring occasionally, until tender. Add more drinking water if the package requires it.',
            es: 'Escurre y mide los garbanzos. Hierve el agua en una olla con espacio para evitar desbordamientos. Añade la pasta seca y cocina según el envase, removiendo de vez en cuando, hasta que esté tierna. Añade más agua potable si el envase lo requiere.',
          },
          {
            en: 'Turn off the heat. Wearing oven mitts, carefully drain the pasta through a heat-safe strainer in the sink; keep clear of steam. Leave the pasta in the strainer briefly.',
            es: 'Apaga el fuego. Con guantes, escurre con cuidado la pasta en un colador resistente al calor en el fregadero; evita el vapor. Deja la pasta brevemente en el colador.',
          },
          {
            en: 'Return the pot to low heat. Add the oil, tomatoes with juice and chickpeas. Simmer gently for about 5 minutes, stirring, until hot. Return the pasta and stir until heated through.',
            es: 'Vuelve a poner la olla a fuego bajo. Añade el aceite, los tomates con jugo y los garbanzos. Cocina a hervor suave unos 5 minutos, removiendo, hasta que esté caliente. Agrega la pasta y remueve hasta calentarla por completo.',
          },
          {
            en: 'Turn off the heat and divide into two portions per batch. Cool before eating. Repeat batches if your pot cannot safely hold the scaled amount.',
            es: 'Apaga el fuego y divide en dos porciones por tanda. Deja enfriar antes de comer. Repite las tandas si la cantidad ajustada no cabe de forma segura en la olla.',
          },
        ],
      },
    ],
  },
  {
    id: 'red-lentil-tomato-soup',
    name: {
      en: 'Red lentil and tomato soup',
      es: 'Sopa de lentejas rojas y tomate',
    },
    description: {
      en: 'A one-pot dinner using quick-cooking split red lentils and canned tomatoes.',
      es: 'Una cena en una olla con lentejas rojas partidas de cocción rápida y tomates enlatados.',
    },
    servings: 2,
    minutes: 30,
    dietary: ['vegetarian', 'vegan'],
    storage: [],
    ingredients: [
      {
        id: 'dry-red-lentils',
        quantity: 0.5,
        unit: 'cup',
      },
      {
        id: 'canned-tomatoes',
        quantity: 1,
        unit: 'cup',
      },
      {
        id: 'water',
        quantity: 2,
        unit: 'cup',
      },
      {
        id: 'olive-oil',
        quantity: 1,
        unit: 'tbsp',
      },
    ],
    methods: [
      {
        id: 'stove',
        name: {
          en: 'Stovetop method',
          es: 'En la estufa',
        },
        equipment: [
          'stove',
          'pot',
          'strainer',
          'spoon',
          'can-opener',
          'measuring-cup',
          'measuring-spoon',
          'oven-mitts',
        ],
        steps: [
          {
            en: 'Measure and sort the dry split red lentils, removing debris. Rinse in a fine-mesh strainer. Do not substitute dried beans; they require different preparation.',
            es: 'Mide y revisa las lentejas rojas partidas secas, retirando residuos. Enjuaga en un colador de malla fina. No las sustituyas por frijoles secos; requieren otra preparación.',
          },
          {
            en: 'Put the lentils, water, tomatoes with juice and oil into a pot. Bring to a boil, then reduce to a gentle simmer. Use a pot with room for bubbling.',
            es: 'Pon las lentejas, el agua, los tomates con jugo y el aceite en una olla. Lleva a hervor y baja el fuego para mantener un hervor suave. Usa una olla con espacio para el burbujeo.',
          },
          {
            en: 'Simmer uncovered, stirring regularly, for about 15–25 minutes until the lentils are completely soft. Follow the lentil package if it calls for longer cooking. Add drinking water a little at a time if the soup gets too thick.',
            es: 'Cocina destapado a hervor suave, removiendo con frecuencia, unos 15–25 minutos hasta que las lentejas estén completamente blandas. Sigue el envase si requiere más cocción. Añade agua potable poco a poco si la sopa se espesa demasiado.',
          },
          {
            en: 'Turn off the heat and use mitts for the hot pot. Divide into two portions per batch and cool before eating. Repeat batches if necessary.',
            es: 'Apaga el fuego y usa guantes para la olla caliente. Divide en dos porciones por tanda y deja enfriar antes de comer. Repite las tandas si hace falta.',
          },
        ],
      },
    ],
  },
];
export const recipeProvenance = text(
  'Original recipe text prepared with AI assistance for FreshRoute MD. Ingredient and equipment logic reviewed in code; these recipes have not been kitchen-tested or reviewed by a dietitian. Times are estimates, not nutrition advice.',
  'Texto original preparado con ayuda de IA para FreshRoute MD. La lógica de ingredientes y equipo se revisó en el código; estas recetas no se han probado en cocina ni revisado por un dietista. Los tiempos son estimados, no consejos nutricionales.',
);
