export interface PortionOption {
  size: string;
  sizeFr: string;
  sizeAr: string;
  discount: number; // percentage discount
  persons: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  basePrice: number; // Price for 1 person in MAD
  category: string;
  categoryAr: string;
  imageUrl: string;
  rating: number;
  preparationTime: string;
  preparationTimeAr: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  allergensAr?: string[];
  portionOptions: PortionOption[];
}

export interface MenuCategory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  items: MenuItem[];
}

// Standard portion options for all dishes
export const PORTION_OPTIONS: PortionOption[] = [
  {
    size: "1 pers.",
    sizeFr: "1 personne",
    sizeAr: "شخص واحد",
    discount: 0,
    persons: 1
  },
  {
    size: "2 pers.",
    sizeFr: "2 personnes (-5%)",
    sizeAr: "شخصين (-5%)",
    discount: 5,
    persons: 2
  },
  {
    size: "4 pers.",
    sizeFr: "4 personnes (-10%)",
    sizeAr: "4 أشخاص (-10%)",
    discount: 10,
    persons: 4
  },
  {
    size: "6 pers.",
    sizeFr: "6 personnes (-12%)",
    sizeAr: "6 أشخاص (-12%)",
    discount: 12,
    persons: 6
  },
  {
    size: "10 pers.",
    sizeFr: "10 personnes (-15%)",
    sizeAr: "10 أشخاص (-15%)",
    discount: 15,
    persons: 10
  },
  {
    size: "12 pers.",
    sizeFr: "12 personnes (-20%)",
    sizeAr: "12 شخص (-20%)",
    discount: 20,
    persons: 12
  }
];

// Function to calculate price based on portion and discount
export const calculatePortionPrice = (basePrice: number, portion: PortionOption): number => {
  const totalBasePrice = basePrice * portion.persons;
  const discountAmount = (totalBasePrice * portion.discount) / 100;
  return Math.round(totalBasePrice - discountAmount);
};

// Comprehensive Moroccan Menu Data
export const MENU_DATA: MenuCategory[] = [
  {
    id: "bastilla",
    name: "Bastilla",
    nameAr: "البسطيلة",
    description: "Feuilletés croustillants aux garnitures traditionnelles",
    descriptionAr: "معجنات مقرمشة بالحشوات التقليدية",
    icon: "🥟",
    items: [
      {
        id: "bastilla-poulet",
        name: "Bastilla au Poulet et Amandes",
        nameAr: "بسطيلة الدجاج واللوز",
        description: "Pâte fine croustillante fourrée au poulet épicé, amandes grillées, œufs et cannelle",
        descriptionAr: "عجين رقيق مقرمش محشو بالدجاج المتبل واللوز المحمص والبيض والقرفة",
        basePrice: 75,
        category: "Bastilla",
        categoryAr: "ا��بسطيلة",
        imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80",
        rating: 4.8,
        preparationTime: "45 min",
        preparationTimeAr: "45 دقيقة",
        allergens: ["Gluten", "Œufs", "Fruits à coque"],
        allergensAr: ["الغلوتين", "البيض", "المكسرات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "bastilla-poisson",
        name: "Bastilla aux Fruits de Mer",
        nameAr: "بسطيلة المأكولات البحرية",
        description: "Délicieuse bastilla fourrée aux crevettes, poisson et vermicelles parfumés aux herbes",
        descriptionAr: "بسطيلة لذيذة محشوة بالجمبري والسمك والشعيرية المعطرة بالأعشاب",
        basePrice: 95,
        category: "Bastilla",
        categoryAr: "البسطيلة",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80",
        rating: 4.7,
        preparationTime: "50 min",
        preparationTimeAr: "50 دقيقة",
        allergens: ["Gluten", "Poisson", "Crustacés"],
        allergensAr: ["الغلوتين", "السمك", "القشريات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "bastilla-lait",
        name: "Bastilla au Lait d'Amande",
        nameAr: "بسطيلة حليب اللوز",
        description: "Version sucrée traditionnelle à base de lait d'amande, cannelle et sucre glace",
        descriptionAr: "نسخة حلوة تقليدية من حليب اللوز والقرفة والسكر البودرة",
        basePrice: 55,
        category: "Bastilla",
        categoryAr: "البسطيلة",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
        rating: 4.5,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten", "Fruits à coque"],
        allergensAr: ["الغلوتين", "المكسرات"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "briwat",
    name: "Briwat",
    nameAr: "البريوات",
    description: "Petits triangles croustillants aux saveurs variées",
    descriptionAr: "مثلثات صغيرة مقرمشة بنكهات متنوعة",
    icon: "🔺",
    items: [
      {
        id: "briwat-viande",
        name: "Briwat à la Viande Hachée",
        nameAr: "بريوات اللحم المفروم",
        description: "Triangles de pâte brick fourrés à la viande hachée épicée aux herbes fraîches",
        descriptionAr: "مثلثات عجين البريك محشوة باللحم المفروم المتبل بالأعشاب الطازجة",
        basePrice: 45,
        category: "Briwat",
        categoryAr: "البريوات",
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
        rating: 4.6,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "briwat-fromage",
        name: "Briwat au Fromage et Herbes",
        nameAr: "بريوات الجبن والأعشاب",
        description: "Délicats triangles au fromage frais, persil, coriandre et menthe",
        descriptionAr: "مثلثات رقيقة بالجبن الطازج والبقدونس والكزبرة والنعناع",
        basePrice: 35,
        category: "Briwat",
        categoryAr: "البريوات",
        imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
        rating: 4.4,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten", "Lait"],
        allergensAr: ["الغلوتين", "الحليب"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "briwat-crevettes",
        name: "Briwat aux Crevettes",
        nameAr: "بريوات الجمبري",
        description: "Briwat aux crevettes sautées à l'ail, gingembre et coriandre fraîche",
        descriptionAr: "بريوات بالجمبري المقلي مع الثوم والزنجبيل والكزبرة الطازجة",
        basePrice: 65,
        category: "Briwat",
        categoryAr: "البريوات",
        imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&q=80",
        rating: 4.9,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        allergens: ["Gluten", "Crustacés"],
        allergensAr: ["الغلوتين", "القشريات"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "tajine",
    name: "Tajine",
    nameAr: "الطاجين",
    description: "Plats mijotés dans la terre cuite traditionnelle",
    descriptionAr: "أطباق مطبوخة في إناء الفخار التقليدي",
    icon: "🍲",
    items: [
      {
        id: "tajine-poulet-olives",
        name: "Tajine de Poulet aux Olives et Citrons Confits",
        nameAr: "طاجين الدجاج بالزيتون والليمون المحفوظ",
        description: "Poulet tendre aux olives vertes, citrons confits, gingembre et safran",
        descriptionAr: "دجاج طري بالزيتون الأخضر والليمون المحفوظ والزنجبيل والزعفران",
        basePrice: 85,
        category: "Tajine",
        categoryAr: "الطاجين",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
        rating: 4.9,
        preparationTime: "60 min",
        preparationTimeAr: "60 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "tajine-agneau-pruneaux",
        name: "Tajine d'Agneau aux Pruneaux et Abricots",
        nameAr: "طاجين اللحم بالبرقوق والمشمش",
        description: "Agneau fondant mijoté avec pruneaux, abricots secs, amandes et cannelle",
        descriptionAr: "لحم خروف طري مطبوخ مع البرقوق والمشمش المجفف واللوز والقرفة",
        basePrice: 95,
        category: "Tajine",
        categoryAr: "الطاجين",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
        rating: 4.8,
        preparationTime: "75 min",
        preparationTimeAr: "75 دقيقة",
        allergens: ["Fruits à coque"],
        allergensAr: ["المكسرات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "tajine-legumes",
        name: "Tajine de Légumes de Saison",
        nameAr: "طاجين الخضروات الموسمية",
        description: "Légumes frais de saison mijotés aux épices traditionnelles marocaines",
        descriptionAr: "خضروات طازجة موسمية مطبوخة بالتوابل المغربية التقليدية",
        basePrice: 65,
        category: "Tajine",
        categoryAr: "الطاجين",
        imageUrl: "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=800&q=80",
        rating: 4.6,
        preparationTime: "45 min",
        preparationTimeAr: "45 دقيقة",
        isVegetarian: true,
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "tajine-kefta",
        name: "Tajine de Kefta aux Œufs",
        nameAr: "طاجين الكفتة بالبيض",
        description: "Boulettes de viande épicées dans une sauce tomate aux œufs battus",
        descriptionAr: "كرات اللحم المتبلة في صلصة ال��ماطم مع البيض المخفوق",
        basePrice: 75,
        category: "Tajine",
        categoryAr: "الطاجين",
        imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
        rating: 4.7,
        preparationTime: "50 min",
        preparationTimeAr: "50 دقيقة",
        isSpicy: true,
        allergens: ["Œufs"],
        allergensAr: ["البيض"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "couscous",
    name: "Couscous",
    nameAr: "الكسكس",
    description: "Semoule vapeur accompagnée de légumes et viandes",
    descriptionAr: "سميد مطهو بالبخار مع الخضروات واللحوم",
    icon: "🥘",
    items: [
      {
        id: "couscous-royal",
        name: "Couscous Royal aux Sept Légumes",
        nameAr: "كسكس ملكي بسبعة خضروات",
        description: "Couscous traditionnel avec agneau, poulet et sept légumes de saison",
        descriptionAr: "كسكس تقليدي مع لحم الخروف والدجاج وسبعة خضروات موسمية",
        basePrice: 105,
        category: "Couscous",
        categoryAr: "الكسكس",
        imageUrl: "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800&q=80",
        rating: 4.9,
        preparationTime: "90 min",
        preparationTimeAr: "90 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "couscous-poulet",
        name: "Couscous au Poulet et Légumes",
        nameAr: "كسكس الدجاج والخضروات",
        description: "Couscous familial au poulet tendre avec courgettes, carottes et navets",
        descriptionAr: "كسكس عائلي بالدجاج الطري مع الكوسا والجزر واللف��",
        basePrice: 85,
        category: "Couscous",
        categoryAr: "الكسكس",
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
        rating: 4.7,
        preparationTime: "75 min",
        preparationTimeAr: "75 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "couscous-legumes",
        name: "Couscous Végétarien aux Légumes du Jardin",
        nameAr: "كسكس نباتي بخضروات الحديقة",
        description: "Couscous aux légumes frais, pois chiches et bouillon parfumé aux herbes",
        descriptionAr: "كسكس بالخضروات الطازجة والحمص ومرق معطر بالأعشاب",
        basePrice: 75,
        category: "Couscous",
        categoryAr: "الكسكس",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&q=80",
        rating: 4.5,
        preparationTime: "60 min",
        preparationTimeAr: "60 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "salades",
    name: "Salades Marocaines",
    nameAr: "سلطات مغربية",
    description: "Entrées fraîches et parfumées aux saveurs du Maroc",
    descriptionAr: "مقبلات طازجة بنكهات مغربية",
    icon: "🥗",
    items: [
      {
        id: "salade-marocaine",
        name: "Salade Marocaine",
        nameAr: "سلطة مغربية",
        description: "Tomates, oignons, concombres, persil et huile d'olive",
        descriptionAr: "طماطم وبصل وخيار وبقدونس وزيت الزيتون",
        basePrice: 35,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
        rating: 4.6,
        preparationTime: "15 min",
        preparationTimeAr: "15 دقيقة",
        isVegetarian: true,
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "zaalouk",
        name: "Zaalouk (Aubergines)",
        nameAr: "زعلوك (الباذنجان)",
        description: "Salade tiède d'aubergines grillées à la tomate et ail",
        descriptionAr: "سلطة دافئة من الباذنجان المشوي مع الطماطم والثوم",
        basePrice: 30,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1604908554007-25a41639e171?w=800&q=80",
        rating: 4.7,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        isVegetarian: true,
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "taktouka",
        name: "Taktouka (Poivrons & Tomates)",
        nameAr: "طاكطوكة (فلفل وطماطم)",
        description: "Poivrons grillés, tomates, ail et paprika fumé",
        descriptionAr: "فلفل مشوي وطماطم وثوم وفلفل أحمر مدخن",
        basePrice: 32,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1543339308-43f2b78a4fe1?w=800&q=80",
        rating: 4.5,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        isVegetarian: true,
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "carottes-cumin",
        name: "Carottes au Cumin",
        nameAr: "جزر بالكمون",
        description: "Carottes fondantes au cumin, citron et coriandre",
        descriptionAr: "جزر مطبوخ بالكمون والليمون والكزبرة",
        basePrice: 28,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
        rating: 4.4,
        preparationTime: "18 min",
        preparationTimeAr: "18 دقيقة",
        isVegetarian: true,
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "salade-betterave",
        name: "Salade de Betterave",
        nameAr: "سلطة الشمندر",
        description: "Betteraves cuites, vinaigrette légère et graines de sésame",
        descriptionAr: "شمندر مطبوخ مع صلصة خفيفة وبذور السمسم",
        basePrice: 30,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
        rating: 4.5,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        isVegetarian: true,
        allergens: ["Sésame"],
        allergensAr: ["سمسم"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "salade-carotte-orange",
        name: "Salade Carottes & Orange",
        nameAr: "سلطة الجزر والبرتقال",
        description: "Carottes râpées, orange, fleur d'oranger et cannelle",
        descriptionAr: "جزر مبشور وبرتقال وماء الزهر وقرفة",
        basePrice: 28,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1467453678174-768ec283a940?w=800&q=80",
        rating: 4.4,
        preparationTime: "15 min",
        preparationTimeAr: "15 دقيقة",
        isVegetarian: true,
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "salade-royale",
        name: "Salade Royale",
        nameAr: "سلطة رويال",
        description: "Assortiment gourmand: tomates, poivrons, œufs, thon, olives",
        descriptionAr: "تشكيلة غنية: طماطم وفلفل وبيض وتونة وزيتون",
        basePrice: 45,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800&q=80",
        rating: 4.7,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        allergens: ["Œufs", "Poisson"],
        allergensAr: ["بيض", "سمك"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "salade-nicoise",
        name: "Salade Niçoise (Thon & Œufs)",
        nameAr: "سلطة نيسواز (تونة وبيض)",
        description: "Thon, œufs, haricots verts, pommes de terre, olives",
        descriptionAr: "تونة وبيض وفاصولياء خضراء وبطاطس وزيتون",
        basePrice: 48,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
        rating: 4.6,
        preparationTime: "22 min",
        preparationTimeAr: "22 دقيقة",
        allergens: ["Œufs", "Poisson"],
        allergensAr: ["بيض", "سمك"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "salade-cesar",
        name: "Salade César (Poulet Grillé)",
        nameAr: "سلطة سيزار (دجاج مشوي)",
        description: "Poulet grillé, croûtons, parmesan et sauce césar maison",
        descriptionAr: "دجاج مشوي وكراتون وجبن بارميزان وصلصة سيزار",
        basePrice: 52,
        category: "Salades",
        categoryAr: "سلطات",
        imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80",
        rating: 4.7,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        allergens: ["Gluten", "Lait"],
        allergensAr: ["غلوتين", "حليب"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "snacks",
    name: "Snacks & Boulangerie",
    nameAr: "سناك ومخبوزات",
    description: "Msmen, batbout, quiches et nems à la marocaine",
    descriptionAr: "مسمن وبطبوط وكيش ونيمس على الطريقة المغربية",
    icon: "🥪",
    items: [
      {
        id: "msmen-khlich-portion",
        name: "Msmen au Khli'",
        nameAr: "مسمن بالخلِّيع",
        description: "Crêpe feuilletée marocaine garnie de khli' maison",
        descriptionAr: "مسمن مغربي محشو بالخليع المنزلي",
        basePrice: 40,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1541782814456-8e532e1f7da7?w=800&q=80",
        rating: 4.8,
        preparationTime: "15 min",
        preparationTimeAr: "15 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["غلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "msmen-khlich-unite",
        name: "Msmen au Khli' — Unité",
        nameAr: "مسمن بالخلِّيع — وحدة",
        description: "Msmen individuel garni de khli'",
        descriptionAr: "مسمن فردي محشو بالخليع",
        basePrice: 12,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        rating: 4.6,
        preparationTime: "10 min",
        preparationTimeAr: "10 دقائق",
        allergens: ["Gluten"],
        allergensAr: ["غلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "nems-viande",
        name: "Nems Marocains — Viande",
        nameAr: "نيمس مغربي — لحم",
        description: "Rouleaux croustillants farcis à la viande épicée",
        descriptionAr: "لفائف مقرمشة محشوة باللحم المتبل",
        basePrice: 45,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1581281418669-7b15521e1d9a?w=800&q=80",
        rating: 4.5,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["غلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "nems-legumes",
        name: "Nems Marocains — Légumes",
        nameAr: "نيمس مغربي — خضار",
        description: "Rouleaux croustillants aux légumes croquants",
        descriptionAr: "لفائف مقرمشة بالخضار المقرمشة",
        basePrice: 40,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
        rating: 4.4,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["غلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "quiche-3-fromages",
        name: "Quiche — 3 Fromages",
        nameAr: "كيش — ثلاثة أجبان",
        description: "Quiche gourmande aux trois fromages",
        descriptionAr: "كيش غني بثلاثة أنواع من الجبن",
        basePrice: 55,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1603037180458-9f7b86ef8cd5?w=800&q=80",
        rating: 4.7,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        allergens: ["Gluten", "Œufs", "Lait"],
        allergensAr: ["غلوتين", "بيض", "حليب"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "quiche-thon",
        name: "Quiche — Thon",
        nameAr: "كيش — تونة",
        description: "Quiche au thon et oignons caramélisés",
        descriptionAr: "كيش بالتونة والبصل المكرمل",
        basePrice: 50,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1562007908-54f3b62f3c5a?w=800&q=80",
        rating: 4.6,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        allergens: ["Gluten", "Œufs", "Lait", "Poisson"],
        allergensAr: ["غلوتين", "بيض", "حليب", "سمك"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "batbout-legumes",
        name: "Batbout Farci — Légumes",
        nameAr: "بطبوط محشي — خضار",
        description: "Pain batbout garni de légumes grillés et sauce maison",
        descriptionAr: "خبز بطبوط محشو بالخضار المشوية وصلصة منزلية",
        basePrice: 35,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        rating: 4.5,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["غلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "batbout-grand-viande-oignons",
        name: "Batbout Farci — Grand (Viande hachée & Oignons)",
        nameAr: "بطبوط محشي — كبير (لحم مفروم وبصل)",
        description: "Grand batbout garni de viande hachée et oignons",
        descriptionAr: "بطبوط كبير محشو باللحم المفروم والبصل",
        basePrice: 60,
        category: "Snacks",
        categoryAr: "سناك",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
        rating: 4.7,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["غلوتين"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "plateaux",
    name: "Plateaux & Apéritifs",
    nameAr: "أطباق تقديم ومقبلات",
    description: "Assortiments à partager",
    descriptionAr: "تشكيلات للمشاركة",
    icon: "🍱",
    items: [
      {
        id: "grand-aperitif-mix",
        name: "Grand Apéritif — Mix salé + fruits + sauces",
        nameAr: "طبق مقبلات كبير — مزيج مالح + فواكه + صلصات",
        description: "Sélection salée, fruits frais et sauces maison",
        descriptionAr: "تشكيلة مالحة مع فواكه طازجة وصلصات منزلية",
        basePrice: 180,
        category: "Plateaux",
        categoryAr: "أطباق تقديم",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-64b0b18b4a48?w=800&q=80",
        rating: 4.8,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "mquillat",
    name: "M'quillat",
    nameAr: "مقليات المقلاة",
    description: "Poêlées marocaines aux œufs et garnitures",
    descriptionAr: "مقالي مغربية بالبيض وإضافات متنوعة",
    icon: "🍳",
    items: [
      {
        id: "mquillat-fruits-mer",
        name: "M'quilat — Fruits de mer",
        nameAr: "مقيلة — مأكولات بحرية",
        description: "Poêlée aux crevettes, calamars et épices",
        descriptionAr: "مقلاة بالروبيان والكلمار والتوابل",
        basePrice: 95,
        category: "M'quillat",
        categoryAr: "مقليات",
        imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
        rating: 4.7,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        allergens: ["Crustacés", "Mollusques"],
        allergensAr: ["قشريات", "رخويات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "mquillat-champignon-poulet",
        name: "M'quilat — Champignon & Poulet",
        nameAr: "مقيلة — فطر ودجاج",
        description: "Poulet, champignons et œufs aux herbes",
        descriptionAr: "دجاج وفطر وبيض مع الأعشاب",
        basePrice: 85,
        category: "M'quillat",
        categoryAr: "مقليات",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
        rating: 4.6,
        preparationTime: "22 min",
        preparationTimeAr: "22 دقيقة",
        allergens: ["Œufs"],
        allergensAr: ["بيض"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "mquillat-viande-mokh",
        name: "M'quilat — Viande hachée & Mokh",
        nameAr: "مقيلة — لحم مفروم ومخ",
        description: "Bœuf haché, cervelle et œufs aux épices",
        descriptionAr: "لحم بقري مفروم ومخ وبيض مع التوابل",
        basePrice: 100,
        category: "M'quillat",
        categoryAr: "مقليات",
        imageUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=80",
        rating: 4.6,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        allergens: ["Œufs"],
        allergensAr: ["بيض"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "mquillat-4-fromages",
        name: "M'quilat — Œufs 4 fromages",
        nameAr: "مقيلة — بيض بأربعة أجبان",
        description: "Œufs, mélange de quatre fromages fondants",
        descriptionAr: "بيض مع خليط أربعة أجبان مذابة",
        basePrice: 80,
        category: "M'quillat",
        categoryAr: "مقليات",
        imageUrl: "https://images.unsplash.com/photo-1543352634-8730b6f30b6b?w=800&q=80",
        rating: 4.7,
        preparationTime: "18 min",
        preparationTimeAr: "18 دقيقة",
        allergens: ["Œufs", "Lait"],
        allergensAr: ["بيض", "حليب"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "mquillat-royale",
        name: "M'quilat — Royale (Mix)",
        nameAr: "مقيلة — رويال (تشكيلة)",
        description: "Assortiment royal: légumes, viande et fromages",
        descriptionAr: "تشكيلة فاخرة: خضار ولحوم وأجبان",
        basePrice: 110,
        category: "M'quillat",
        categoryAr: "مقليات",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-64b0b18b4a48?w=800&q=80",
        rating: 4.8,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        allergens: ["Œufs", "Lait"],
        allergensAr: ["بيض", "حليب"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "riz",
    name: "Plats au Riz",
    nameAr: "أطباق الأرز",
    description: "Spécialités de riz à la marocaine",
    descriptionAr: "أطباق رز على الطريقة المغربية",
    icon: "🍚",
    items: [
      {
        id: "riz-poulet-classique",
        name: "Riz au Poulet — Classique",
        nameAr: "أرز بالدجاج — كلاسيكي",
        description: "Riz parfumé au poulet, petits pois et carottes",
        descriptionAr: "أرز معطر بالدجاج والبازلاء والجزر",
        basePrice: 80,
        category: "Riz",
        categoryAr: "أرز",
        imageUrl: "https://images.unsplash.com/photo-1604908176997-431c6a3a5f2d?w=800&q=80",
        rating: 4.6,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "grillades",
    name: "Grillades",
    nameAr: "مشويات",
    description: "Brochettes et viandes grillées aux épices marocaines",
    descriptionAr: "أسياخ ولحوم مشوية بتوابل مغربية",
    icon: "🔥",
    items: [
      {
        id: "brochettes-poulet",
        name: "Brochettes de Poulet Marinées",
        nameAr: "أسياخ دجاج متبلة",
        description: "Poulet mariné au citron, ail, paprika et curcuma",
        descriptionAr: "دجاج متبل بالليمون والثوم والفلفل الأحمر والكركم",
        basePrice: 70,
        category: "Grillades",
        categoryAr: "مشويات",
        imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
        rating: 4.7,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "brochettes-kefta",
        name: "Brochettes de Kefta",
        nameAr: "أسياخ كفتة",
        description: "Boulettes de bœuf haché, cumin, coriandre et oignon",
        descriptionAr: "كرات لحم بقري مفروم مع الكمون والكزبرة والبصل",
        basePrice: 80,
        category: "Grillades",
        categoryAr: "مشويات",
        imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
        rating: 4.8,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "cotelettes-agneau",
        name: "Côtelettes d'Agneau Grillées",
        nameAr: "ضلوع لحم الخروف مشوية",
        description: "Agneau tendre grillé aux herbes et au citron",
        descriptionAr: "لحم خروف طري مشوي بالأعشاب والليمون",
        basePrice: 110,
        category: "Grillades",
        categoryAr: "مشويات",
        imageUrl: "https://images.unsplash.com/photo-1558036117-15d82a90b9b9?w=800&q=80",
        rating: 4.9,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "mixed-grill",
        name: "Plateau Mixed Grill",
        nameAr: "تشكيلة مشاوي",
        description: "Assortiment poulet, kefta, merguez et légumes grillés",
        descriptionAr: "تشكيلة دجاج وكفتة ومرقاز وخضار مشوية",
        basePrice: 120,
        category: "Grillades",
        categoryAr: "مشويات",
        imageUrl: "https://images.unsplash.com/photo-1481931715705-36f5f79f1a3a?w=800&q=80",
        rating: 4.7,
        preparationTime: "40 min",
        preparationTimeAr: "40 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "merguez",
        name: "Merguez Maison",
        nameAr: "نقانق مرقاز",
        description: "Saucisses épicées grillées, harissa et cumin",
        descriptionAr: "نقانق حارة مشوية مع الهريسة والكمون",
        basePrice: 85,
        category: "Grillades",
        categoryAr: "مشويات",
        imageUrl: "https://images.unsplash.com/photo-1604908812141-bb3b20f5a5da?w=800&q=80",
        rating: 4.5,
        preparationTime: "20 min",
        preparationTimeAr: "20 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "poissons",
    name: "Poissons & Mer",
    nameAr: "أسماك وبحريات",
    description: "Spécialités de la mer façon marocaine",
    descriptionAr: "تخصصات بحرية على الطريقة المغربية",
    icon: "🐟",
    items: [
      {
        id: "sardines-chermoula",
        name: "Sardines à la Chermoula",
        nameAr: "سردين بالشرمولة",
        description: "Sardines marinées à la chermoula puis grillées",
        descriptionAr: "سردين مت��ل بالشرمولة ثم مشوي",
        basePrice: 70,
        category: "Poissons",
        categoryAr: "أسماك",
        imageUrl: "https://images.unsplash.com/photo-1604908553100-59c59e86cdc6?w=800&q=80",
        rating: 4.8,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        allergens: ["Poisson"],
        allergensAr: ["سمك"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "sardines-farcies",
        name: "Sardines Farcies",
        nameAr: "سردين محشي",
        description: "Filets de sardines farcis à la chermoula et frits",
        descriptionAr: "شرائح سردين محشوة بالشرمولة ومقلية",
        basePrice: 80,
        category: "Poissons",
        categoryAr: "أسماك",
        imageUrl: "https://images.unsplash.com/photo-1548943487-a2e4e43b4856?w=800&q=80",
        rating: 4.7,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        allergens: ["Poisson"],
        allergensAr: ["سمك"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "dorade-four",
        name: "Dorade au Four à la Chermoula",
        nameAr: "دorada في الفرن بالشرمولة",
        description: "Dorade entière au four, pommes de terre et poivrons",
        descriptionAr: "دورادا كاملة في الفرن مع البطاطس والفلفل",
        basePrice: 120,
        category: "Poissons",
        categoryAr: "أسماك",
        imageUrl: "https://images.unsplash.com/photo-1555088467-063e351c9e82?w=800&q=80",
        rating: 4.9,
        preparationTime: "55 min",
        preparationTimeAr: "55 دقيقة",
        allergens: ["Poisson"],
        allergensAr: ["سمك"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "calamar-grille",
        name: "Calamar Grillé",
        nameAr: "كلمار مشوي",
        description: "Anneaux de calamar grillés, citron et ail",
        descriptionAr: "شرائح كلمار مشوية مع الليمون والثوم",
        basePrice: 110,
        category: "Poissons",
        categoryAr: "أسماك",
        imageUrl: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=80",
        rating: 4.6,
        preparationTime: "25 min",
        preparationTimeAr: "25 دقيقة",
        allergens: ["Mollusques"],
        allergensAr: ["رخويات"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "soupes",
    name: "Soupes",
    nameAr: "شوربات",
    description: "Soupes traditionnelles réconfortantes",
    descriptionAr: "شوربات تقليدية مغذية",
    icon: "🥣",
    items: [
      {
        id: "harira",
        name: "Harira",
        nameAr: "حريرة",
        description: "Soupe marocaine aux tomates, pois chiches et vermicelles",
        descriptionAr: "حساء مغربي بال��ماطم والحمص والشعيرية",
        basePrice: 30,
        category: "Soupes",
        categoryAr: "شوربات",
        imageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80",
        rating: 4.9,
        preparationTime: "40 min",
        preparationTimeAr: "40 دقيقة",
        allergens: ["Gluten", "Œufs"],
        allergensAr: ["الغلوتين", "البيض"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "bissara",
        name: "Bissara de Fèves",
        nameAr: "بيصارة",
        description: "Velouté de fèves sèches à l'huile d'olive, cumin et paprika",
        descriptionAr: "حساء الفول بزيت الزيتون والكمون والفلفل الأحمر",
        basePrice: 28,
        category: "Soupes",
        categoryAr: "شوربات",
        imageUrl: "https://images.unsplash.com/photo-1617195737498-8f85f66f5644?w=800&q=80",
        rating: 4.7,
        preparationTime: "35 min",
        preparationTimeAr: "35 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "hssoua-orge",
        name: "Hssoua d'Orge",
        nameAr: "حساء الشعير",
        description: "Soupe d'orge traditionnelle au lait et beurre smen",
        descriptionAr: "شوربة شعير تقليدية بالحليب و السمن",
        basePrice: 26,
        category: "Soupes",
        categoryAr: "شوربات",
        imageUrl: "https://images.unsplash.com/photo-1533777324565-a040eb52fac1?w=800&q=80",
        rating: 4.5,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        allergens: ["Lait"],
        allergensAr: ["حليب"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "specialites",
    name: "Spécialités Marocaines",
    nameAr: "تخصصات مغربية",
    description: "Plats emblématiques et festifs",
    descriptionAr: "أطباق مغربية أصيلة للاحتفالات",
    icon: "⭐",
    items: [
      {
        id: "rfissa",
        name: "Rfissa au Poulet",
        nameAr: "رفيسة بالدجاج",
        description: "Trid émietté au bouillon de poulet, lentilles et fenugrec",
        descriptionAr: "مسمن مقطع بمرق الدجاج والعدس والحلبة",
        basePrice: 110,
        category: "Spécialités",
        categoryAr: "تخصصات",
        imageUrl: "https://images.unsplash.com/photo-1603133873124-5a5f6f2a0b1a?w=800&q=80",
        rating: 4.9,
        preparationTime: "90 min",
        preparationTimeAr: "90 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "tanjia-marrakchia",
        name: "Tanjia Marrakchia",
        nameAr: "طنجية مراكشية",
        description: "Viande mijotée longuement aux épices et citron confit",
        descriptionAr: "لحم مطبوخ ببطء مع التوابل والليمون المحفوظ",
        basePrice: 120,
        category: "Spécialités",
        categoryAr: "تخصصات",
        imageUrl: "https://images.unsplash.com/photo-1505575967455-40e256f73376?w=800&q=80",
        rating: 4.8,
        preparationTime: "120 min",
        preparationTimeAr: "120 دقيقة",
        allergens: [],
        allergensAr: [],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "seffa-medfouna",
        name: "Seffa Medfouna",
        nameAr: "سفة مدفونة",
        description: "Vermicelles vapeur sucrés-salés avec poulet et amandes",
        descriptionAr: "شعرية مطهوة بالبخار حلوة مالحة مع الدجاج واللوز",
        basePrice: 95,
        category: "Spécialités",
        categoryAr: "تخصصات",
        imageUrl: "https://images.unsplash.com/photo-1565901055706-7b7c77137f5b?w=800&q=80",
        rating: 4.7,
        preparationTime: "80 min",
        preparationTimeAr: "80 دقيقة",
        allergens: ["Gluten", "Fruits à coque"],
        allergensAr: ["الغلوتين", "المكسرات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "mrouzia-agneau",
        name: "Mrouzia d'Agneau",
        nameAr: "مرقازيا بلحم الخروف",
        description: "Ragoût sucré-salé d'agneau, raisins secs et amandes",
        descriptionAr: "طاجين حلو مالح بلحم الخروف والزبيب واللوز",
        basePrice: 125,
        category: "Spécialités",
        categoryAr: "تخصصات",
        imageUrl: "https://images.unsplash.com/photo-1582967788606-14141e0a28a6?w=800&q=80",
        rating: 4.8,
        preparationTime: "100 min",
        preparationTimeAr: "100 دقيقة",
        allergens: ["Fruits à coque"],
        allergensAr: ["المكسرات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "bastilla-pigeon",
        name: "Bastilla au Pigeon",
        nameAr: "بسطيلة الحمام",
        description: "Bastilla traditionnelle au pigeon, amandes et cannelle",
        descriptionAr: "بسطيلة تقليدية بالحمام واللوز والقرفة",
        basePrice: 130,
        category: "Spécialités",
        categoryAr: "تخصصات",
        imageUrl: "https://images.unsplash.com/photo-1556767576-b655c19f1e8c?w=800&q=80",
        rating: 4.9,
        preparationTime: "95 min",
        preparationTimeAr: "95 دقيقة",
        allergens: ["Gluten", "Fruits à coque", "Œufs"],
        allergensAr: ["الغلوتين", "المكسرات", "البيض"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "berkoukes",
        name: "Berkoukes (Graines d'Orge)",
        nameAr: "بركوكش",
        description: "Graines d'orge en sauce tomate, légumes et viande",
        descriptionAr: "حبات الشعير بصلصة الطماطم والخضار واللحم",
        basePrice: 90,
        category: "Spécialités",
        categoryAr: "تخصصات",
        imageUrl: "https://images.unsplash.com/photo-1589927986089-35812388d1a9?w=800&q=80",
        rating: 4.6,
        preparationTime: "85 min",
        preparationTimeAr: "85 دقيقة",
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    nameAr: "الحلويات",
    description: "Pâtisseries et douceurs marocaines traditionnelles",
    descriptionAr: "معجنات وحلويات مغربية تقليدية",
    icon: "🍯",
    items: [
      {
        id: "chebakia",
        name: "Chebakia au Miel et Sésame",
        nameAr: "الشباكية بالعسل والسمسم",
        description: "Pâtisserie traditionnelle en forme de fleur, frite et enrobée de miel",
        descriptionAr: "حلوى تقليدية على شكل زهرة، مقلية ومغطاة بالعسل",
        basePrice: 25,
        category: "Desserts",
        categoryAr: "الحلويات",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
        rating: 4.8,
        preparationTime: "45 min",
        preparationTimeAr: "45 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten", "Sésame"],
        allergensAr: ["الغلوتين", "السمسم"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "cornes-gazelle",
        name: "Cornes de Gazelle aux Amandes",
        nameAr: "قرون الغزال باللوز",
        description: "Délicats croissants fourrés à la pâte d'amande parfumée à l'eau de fleur d'oranger",
        descriptionAr: "هلال رقيق محشو بعجينة اللوز المعطرة بماء الزهر",
        basePrice: 35,
        category: "Desserts",
        categoryAr: "الحلويات",
        imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80",
        rating: 4.9,
        preparationTime: "60 min",
        preparationTimeAr: "60 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten", "Fruits à coque"],
        allergensAr: ["الغلوتين", "المكسرات"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "makroudh",
        name: "Makroudh aux Dattes",
        nameAr: "المقروض بالتمر",
        description: "Gâteau de semoule fourré aux dattes, parfumé à l'eau de rose",
        descriptionAr: "كعك السميد محشو بالتمر ��معطر بماء الورد",
        basePrice: 30,
        category: "Desserts",
        categoryAr: "الحلويات",
        imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
        rating: 4.6,
        preparationTime: "50 min",
        preparationTimeAr: "50 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten"],
        allergensAr: ["الغلوتين"],
        portionOptions: PORTION_OPTIONS
      },
      {
        id: "sellou",
        name: "Sellou aux Amandes et Sésame",
        nameAr: "السلو باللوز والسمسم",
        description: "Mélange énergétique d'amandes grillées, sésame, farine grillée et miel",
        descriptionAr: "خليط مقوي من اللوز المحمص والسمسم والدقيق المحمص والعسل",
        basePrice: 40,
        category: "Desserts",
        categoryAr: "الحلويات",
        imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&q=80",
        rating: 4.7,
        preparationTime: "30 min",
        preparationTimeAr: "30 دقيقة",
        isVegetarian: true,
        allergens: ["Gluten", "Fruits à coque", "Sésame"],
        allergensAr: ["الغلوتين", "المكسرات", "ا��سمسم"],
        portionOptions: PORTION_OPTIONS
      }
    ]
  }
];

// Helper functions for filtering and searching
export const getAllMenuItems = (): MenuItem[] => {
  return MENU_DATA.flatMap(category => category.items);
};

export const getMenuItemsByCategory = (categoryId: string): MenuItem[] => {
  const category = MENU_DATA.find(cat => cat.id === categoryId);
  return category ? category.items : [];
};

export const searchMenuItems = (query: string): MenuItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllMenuItems().filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.nameAr.includes(query) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.descriptionAr.includes(query) ||
    item.category.toLowerCase().includes(lowercaseQuery) ||
    item.categoryAr.includes(query)
  );
};

export const filterMenuItemsByPrice = (minPrice: number, maxPrice: number): MenuItem[] => {
  return getAllMenuItems().filter(item => {
    const singlePortionPrice = calculatePortionPrice(item.basePrice, PORTION_OPTIONS[0]);
    return singlePortionPrice >= minPrice && singlePortionPrice <= maxPrice;
  });
};

export const getMenuCategories = (): MenuCategory[] => {
  return MENU_DATA;
};
