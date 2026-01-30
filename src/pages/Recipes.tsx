import { useState } from 'react';
import { Clock, Users, Heart, Music, Palette, Calendar, BookOpen, Sparkles, Globe, Trophy, ChevronDown } from 'lucide-react';
import { Recipe } from '../types';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHover } from '../utils/animations';
import { SearchBar } from '../components/SearchBar';
import { useDebounce } from '../hooks/useHooks';

// Available Cultures
const cultures = [
  { id: 'zimbabwe', name: 'Zimbabwe 🇿🇼', flag: '🇿🇼' },
  { id: 'south-africa', name: 'South Africa 🇿🇦', flag: '🇿🇦' },
  { id: 'nigeria', name: 'Nigeria 🇳🇬', flag: '🇳🇬' },
  { id: 'kenya', name: 'Kenya 🇰🇪', flag: '🇰🇪' },
  { id: 'ghana', name: 'Ghana 🇬🇭', flag: '🇬🇭' },
  { id: 'ethiopia', name: 'Ethiopia 🇪🇹', flag: '🇪🇹' },
  { id: 'china', name: 'China 🇨🇳', flag: '🇨🇳' },
  { id: 'uk', name: 'United Kingdom 🇬🇧', flag: '🇬🇧' },
  { id: 'france', name: 'France 🇫🇷', flag: '🇫🇷' },
  { id: 'germany', name: 'Germany 🇩🇪', flag: '🇩🇪' },
  { id: 'spain', name: 'Spain 🇪🇸', flag: '🇪🇸' },
  { id: 'italy', name: 'Italy 🇮🇹', flag: '🇮🇹' },
];

// Mock data - Zimbabwe
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Traditional Sadza',
    description: 'The staple food of Zimbabwe made from maize meal',
    ingredients: [
      '2 cups white maize meal (mealie meal)',
      '4 cups water',
      'Pinch of salt',
    ],
    instructions: [
      'Boil 3 cups of water in a pot',
      'Mix 1 cup of maize meal with 1 cup of cold water to make a paste',
      'Pour the paste into the boiling water, stirring continuously',
      'Add remaining maize meal gradually while stirring',
      'Cook on low heat for 10-15 minutes, stirring occasionally',
      'The sadza is ready when it\'s thick and pulls away from the sides',
    ],
    prepTime: 5,
    cookTime: 20,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Sadza&size=400',
    authorId: '1',
    authorName: 'Tendai Mutasa',
    category: 'Main Dish',
    tips: [
      'Use a wooden spoon for stirring',
      'The consistency should be thick and smooth',
      'Serve hot with your favorite relish',
    ],
    whereToFindIngredients: 'Chinese supermarkets: Look for "corn flour" or ask for African food sections. In USA: African markets or online at Amazon.',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Muriwo (Vegetable Relish)',
    description: 'Traditional leaf vegetable dish, commonly eaten with sadza',
    ingredients: [
      '2 bunches of spinach or kale',
      '2 tomatoes, chopped',
      '1 onion, chopped',
      '2 tablespoons peanut butter',
      'Salt to taste',
      '2 tablespoons cooking oil',
    ],
    instructions: [
      'Wash and chop the vegetables',
      'Fry onions in oil until soft',
      'Add tomatoes and cook until soft',
      'Add chopped vegetables and stir',
      'Add a little water and simmer for 10 minutes',
      'Stir in peanut butter',
      'Season with salt and cook for another 5 minutes',
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Muriwo&size=400',
    authorId: '2',
    authorName: 'Rudo Ncube',
    category: 'Relish',
    tips: [
      'Use any leafy greens available',
      'Peanut butter adds authentic flavor',
      'Don\'t overcook the vegetables',
    ],
    whereToFindIngredients: 'Regular supermarkets work. For authentic taste, get natural peanut butter from health food stores.',
    createdAt: new Date(),
  },
];

// South African Recipes
const southAfricanRecipes: Recipe[] = [
  {
    id: 'sa1',
    title: 'Bobotie',
    description: 'Spiced minced meat baked with an egg topping',
    ingredients: [
      '500g ground beef',
      '2 onions, chopped',
      '2 tablespoons curry powder',
      '2 slices white bread',
      '1 cup milk',
      '2 eggs',
      '2 tablespoons chutney',
      'Raisins and almonds',
    ],
    instructions: [
      'Soak bread in milk',
      'Fry onions and add curry powder',
      'Add meat and cook until browned',
      'Squeeze bread and mix into meat with chutney and raisins',
      'Place in baking dish',
      'Beat eggs with remaining milk and pour over meat',
      'Bake at 180°C for 30-40 minutes',
    ],
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    image: 'https://ui-avatars.com/api/?name=Bobotie&size=400&background=007A3D&color=fff',
    authorId: '3',
    authorName: 'Thabo Mthembu',
    category: 'Main Dish',
    tips: ['Serve with yellow rice and sambals', 'Can be made with lamb or chicken too'],
    whereToFindIngredients: 'Available in most supermarkets. Find Mrs Ball\'s chutney in international sections.',
    createdAt: new Date(),
  },
  {
    id: 'sa2',
    title: 'Bunny Chow',
    description: 'Hollowed-out bread filled with curry',
    ingredients: [
      '1 loaf white bread',
      '500g chicken or lamb',
      '2 onions',
      '3 tablespoons curry powder',
      '2 tomatoes',
      '1 potato, cubed',
      'Coconut cream',
    ],
    instructions: [
      'Make curry with meat, onions, curry powder, and tomatoes',
      'Add potatoes and simmer until tender',
      'Stir in coconut cream',
      'Cut bread loaf into quarters',
      'Hollow out each quarter',
      'Fill with hot curry',
    ],
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Bunny+Chow&size=400&background=FFB612&color=000',
    authorId: '3',
    authorName: 'Thabo Mthembu',
    category: 'Street Food',
    tips: ['Originated in Durban', 'Eat with your hands - use the scooped-out bread to eat the curry'],
    whereToFindIngredients: 'Regular grocery stores. Get fresh bread from bakery.',
    createdAt: new Date(),
  },
];

// Nigerian Recipes
const nigerianRecipes: Recipe[] = [
  {
    id: 'ng1',
    title: 'Jollof Rice',
    description: 'West African one-pot rice dish with tomatoes and spices',
    ingredients: [
      '3 cups long-grain rice',
      '400g tomato paste',
      '2 onions',
      '3 bell peppers',
      '2 scotch bonnet peppers',
      'Chicken or vegetable stock',
      'Curry powder, thyme, bay leaves',
    ],
    instructions: [
      'Blend tomatoes, peppers, and onions',
      'Fry the blended mixture until oil rises',
      'Add tomato paste and spices',
      'Add stock and bring to boil',
      'Add washed rice and stir',
      'Cover and cook on low heat until rice is done',
    ],
    prepTime: 20,
    cookTime: 45,
    servings: 8,
    image: 'https://ui-avatars.com/api/?name=Jollof&size=400&background=008751&color=fff',
    authorId: '4',
    authorName: 'Chioma Okonkwo',
    category: 'Main Dish',
    tips: ['The smoky bottom layer (socarrat) is prized!', 'Party jollof is always better'],
    whereToFindIngredients: 'African stores for scotch bonnet. Asian markets for long-grain rice.',
    createdAt: new Date(),
  },
];

// Chinese Recipes
const chineseRecipes: Recipe[] = [
  {
    id: 'cn1',
    title: 'Chinese Dumplings (Jiaozi)',
    description: 'Traditional filled dumplings, especially popular during Chinese New Year',
    ingredients: [
      '300g dumpling wrappers',
      '300g ground pork or chicken',
      '2 cups napa cabbage, finely chopped',
      '2 green onions, chopped',
      '2 tablespoons soy sauce',
      '1 tablespoon sesame oil',
      'Ginger, garlic, minced',
    ],
    instructions: [
      'Mix meat with chopped cabbage, green onions, soy sauce, sesame oil, ginger, and garlic',
      'Place a spoonful of filling in center of each wrapper',
      'Fold and pleat edges to seal',
      'Boil in water for 8-10 minutes until they float',
      'Or pan-fry for crispy bottoms',
      'Serve with soy sauce and vinegar dipping sauce',
    ],
    prepTime: 30,
    cookTime: 10,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Dumplings&size=400&background=DE2910&color=fff',
    authorId: '6',
    authorName: 'Li Wei',
    category: 'Appetizer',
    tips: ['Make extra and freeze for later', 'Pleating takes practice!'],
    whereToFindIngredients: 'Asian supermarkets for wrappers. Regular stores for everything else.',
    createdAt: new Date(),
  },
  {
    id: 'cn2',
    title: 'Fried Rice',
    description: 'Classic Chinese fried rice with vegetables and egg',
    ingredients: [
      '3 cups cooked rice (day-old works best)',
      '2 eggs',
      '1 cup mixed vegetables (peas, carrots, corn)',
      '2 green onions',
      '3 tablespoons soy sauce',
      '2 tablespoons vegetable oil',
      'Garlic, salt, white pepper',
    ],
    instructions: [
      'Scramble eggs in hot wok, set aside',
      'Stir-fry vegetables until tender',
      'Add rice and break up clumps',
      'Add soy sauce and seasonings',
      'Mix in scrambled eggs',
      'Garnish with green onions',
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Fried+Rice&size=400&background=FFDE00&color=000',
    authorId: '6',
    authorName: 'Li Wei',
    category: 'Main Dish',
    tips: ['Use day-old rice for best texture', 'High heat is essential'],
    whereToFindIngredients: 'Regular grocery stores have everything.',
    createdAt: new Date(),
  },
];

// UK Recipes
const ukRecipes: Recipe[] = [
  {
    id: 'uk1',
    title: 'Fish and Chips',
    description: 'Classic British dish with battered fish and thick-cut chips',
    ingredients: [
      '4 cod or haddock fillets',
      '1 cup flour',
      '1 cup beer (or sparkling water)',
      '4 large potatoes',
      'Vegetable oil for frying',
      'Salt, pepper, malt vinegar',
    ],
    instructions: [
      'Cut potatoes into thick chips and soak in water',
      'Make batter with flour and beer',
      'Dry fish and coat in batter',
      'Deep fry chips until golden',
      'Deep fry fish until crispy and golden',
      'Serve with malt vinegar and mushy peas',
    ],
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Fish+Chips&size=400&background=012169&color=fff',
    authorId: '7',
    authorName: 'James Brown',
    category: 'Main Dish',
    tips: ['Use cold beer for crispier batter', 'Double-fry chips for extra crunch'],
    whereToFindIngredients: 'Any supermarket. Fresh fish from fishmonger.',
    createdAt: new Date(),
  },
];

// French Recipes
const frenchRecipes: Recipe[] = [
  {
    id: 'fr1',
    title: 'Ratatouille',
    description: 'Provençal vegetable stew with eggplant, zucchini, and tomatoes',
    ingredients: [
      '1 eggplant',
      '2 zucchini',
      '1 bell pepper',
      '4 tomatoes',
      '1 onion',
      'Garlic, herbs de Provence',
      'Olive oil',
    ],
    instructions: [
      'Chop all vegetables into similar-sized pieces',
      'Sauté onions and garlic in olive oil',
      'Add eggplant and cook until soft',
      'Add peppers and zucchini',
      'Add tomatoes and herbs',
      'Simmer for 30 minutes',
    ],
    prepTime: 20,
    cookTime: 45,
    servings: 6,
    image: 'https://ui-avatars.com/api/?name=Ratatouille&size=400&background=0055A4&color=fff',
    authorId: '8',
    authorName: 'Marie Dubois',
    category: 'Vegetable Dish',
    tips: ['Can be served hot or cold', 'Tastes better the next day'],
    whereToFindIngredients: 'Fresh vegetables from any market.',
    createdAt: new Date(),
  },
];

// Italian Recipes
const italianRecipes: Recipe[] = [
  {
    id: 'it1',
    title: 'Spaghetti Carbonara',
    description: 'Roman pasta dish with eggs, cheese, and guanciale',
    ingredients: [
      '400g spaghetti',
      '200g guanciale or pancetta',
      '4 egg yolks',
      '100g Pecorino Romano cheese',
      'Black pepper',
      'Salt',
    ],
    instructions: [
      'Cook pasta in salted boiling water',
      'Fry guanciale until crispy',
      'Beat egg yolks with grated cheese and pepper',
      'Reserve pasta water, drain pasta',
      'Mix hot pasta with guanciale',
      'Remove from heat, add egg mixture, toss quickly',
      'Add pasta water if needed for creamy consistency',
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Carbonara&size=400&background=009246&color=fff',
    authorId: '9',
    authorName: 'Marco Rossi',
    category: 'Pasta',
    tips: ['No cream in authentic carbonara!', 'Work quickly to avoid scrambling eggs'],
    whereToFindIngredients: 'Italian delis or specialty cheese shops for authentic ingredients.',
    createdAt: new Date(),
  },
];

// Spanish Recipes
const spanishRecipes: Recipe[] = [
  {
    id: 'es1',
    title: 'Paella',
    description: 'Valencian rice dish with saffron, vegetables, and seafood or meat',
    ingredients: [
      '2 cups paella rice',
      '4 cups chicken stock',
      'Saffron threads',
      '300g chicken pieces',
      '200g prawns',
      '1 bell pepper',
      'Peas, tomatoes, garlic',
      'Paprika, olive oil',
    ],
    instructions: [
      'Heat oil in paella pan, brown chicken',
      'Add peppers and garlic',
      'Add rice and coat with oil',
      'Add saffron-infused stock',
      'Don\'t stir! Let rice cook undisturbed',
      'Add seafood in last 10 minutes',
      'Let it rest before serving',
    ],
    prepTime: 20,
    cookTime: 40,
    servings: 6,
    image: 'https://ui-avatars.com/api/?name=Paella&size=400&background=AA151B&color=fff',
    authorId: '10',
    authorName: 'Carmen García',
    category: 'Main Dish',
    tips: ['The crispy bottom (socarrat) is the best part!', 'Use bomba or calasparra rice'],
    whereToFindIngredients: 'Spanish markets for paella rice and saffron. Regular stores for rest.',
    createdAt: new Date(),
  },
];

// German Recipes
const germanRecipes: Recipe[] = [
  {
    id: 'de1',
    title: 'Schnitzel',
    description: 'Breaded and fried veal or pork cutlet',
    ingredients: [
      '4 pork or veal cutlets',
      '1 cup flour',
      '2 eggs, beaten',
      '2 cups breadcrumbs',
      'Butter and oil for frying',
      'Lemon wedges',
      'Salt, pepper',
    ],
    instructions: [
      'Pound cutlets until thin',
      'Season with salt and pepper',
      'Coat in flour, then egg, then breadcrumbs',
      'Fry in butter and oil until golden (3-4 min per side)',
      'Drain on paper towels',
      'Serve with lemon wedges and potato salad',
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Schnitzel&size=400&background=000000&color=DD0000',
    authorId: '11',
    authorName: 'Hans Mueller',
    category: 'Main Dish',
    tips: ['Cutlets should be paper-thin', 'Don\'t overcrowd the pan'],
    whereToFindIngredients: 'Any butcher or supermarket.',
    createdAt: new Date(),
  },
];

// Kenyan Recipes
const kenyanRecipes: Recipe[] = [
  {
    id: 'ke1',
    title: 'Ugali',
    description: 'Kenyan staple made from maize flour',
    ingredients: ['2 cups maize flour (white cornmeal)', '4 cups water', 'Pinch of salt'],
    instructions: [
      'Boil water with salt',
      'Gradually add maize flour while stirring',
      'Keep stirring to avoid lumps',
      'Cook until thick and pulls from sides',
      'Shape into a mound',
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 4,
    image: 'https://ui-avatars.com/api/?name=Ugali&size=400&background=000000&color=fff',
    authorId: '5',
    authorName: 'Wanjiku Kamau',
    category: 'Staple',
    tips: ['Serve with sukuma wiki (collard greens) and nyama choma (grilled meat)'],
    whereToFindIngredients: 'Look for "masa harina" or "corn flour" in Latin American sections.',
    createdAt: new Date(),
  },
];

// Cultural Music by country
const mockMusic = [
  {
    id: '1',
    title: 'Mbira - Traditional Shona Music',
    artist: 'Various Artists',
    description: 'Sacred ancestral music played on the mbira (thumb piano)',
    genre: 'Traditional',
    image: 'https://ui-avatars.com/api/?name=Mbira&background=00843D&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Used in spiritual ceremonies and to communicate with ancestors',
    country: 'zimbabwe',
  },
  {
    id: '2',
    title: 'Jit Music',
    artist: 'The Bhundu Boys',
    description: 'High-energy dance music that originated in the 1980s',
    genre: 'Contemporary',
    image: 'https://ui-avatars.com/api/?name=Jit&background=FFD100&color=000&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Modern Zimbabwean music that blends traditional rhythms with modern instruments',
    country: 'zimbabwe',
  },
  {
    id: '3',
    title: 'Chimurenga',
    artist: 'Thomas Mapfumo',
    description: 'Revolutionary music that played a role in Zimbabwe\'s independence',
    genre: 'Liberation',
    image: 'https://ui-avatars.com/api/?name=Chimurenga&background=EA3721&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Music of struggle and liberation, still celebrated today',
    country: 'zimbabwe',
  },
  {
    id: 'sa1',
    title: 'Amapiano',
    artist: 'Kabza De Small',
    description: 'South African house music genre with jazz and lounge influences',
    genre: 'Contemporary',
    image: 'https://ui-avatars.com/api/?name=Amapiano&background=007A3D&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Modern sound that took Africa and the world by storm',
    country: 'south-africa',
  },
  {
    id: 'ng1',
    title: 'Afrobeats',
    artist: 'Burna Boy',
    description: 'Fusion of West African music with American funk and jazz',
    genre: 'Contemporary',
    image: 'https://ui-avatars.com/api/?name=Afrobeats&background=008751&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Global phenomenon putting African music on the world stage',
    country: 'nigeria',
  },
  {
    id: 'ke1',
    title: 'Benga',
    artist: 'D.O. Misiani',
    description: 'Kenyan popular music with fast-paced guitar rhythms',
    genre: 'Traditional',
    image: 'https://ui-avatars.com/api/?name=Benga&background=000000&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Originated from Luo traditional music in the 1940s',
    country: 'kenya',
  },
  {
    id: 'cn1',
    title: 'Traditional Chinese Music',
    artist: 'Various Artists',
    description: 'Ancient music played on instruments like guzheng and erhu',
    genre: 'Traditional',
    image: 'https://ui-avatars.com/api/?name=Chinese+Music&background=DE2910&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Music dating back thousands of years, central to Chinese culture',
    country: 'china',
  },
  {
    id: 'cn2',
    title: 'Mandopop',
    artist: 'Jay Chou',
    description: 'Mandarin popular music blending Western and Chinese elements',
    genre: 'Pop',
    image: 'https://ui-avatars.com/api/?name=Mandopop&background=FFDE00&color=DE2910&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Modern pop music that dominates Chinese youth culture',
    country: 'china',
  },
  {
    id: 'uk1',
    title: 'British Rock',
    artist: 'The Beatles',
    description: 'Revolutionary rock music from the 1960s',
    genre: 'Rock',
    image: 'https://ui-avatars.com/api/?name=British+Rock&background=012169&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'The British Invasion changed global music forever',
    country: 'uk',
  },
  {
    id: 'fr1',
    title: 'Chanson Française',
    artist: 'Édith Piaf',
    description: 'French lyrical songs, poetic and emotional',
    genre: 'Traditional',
    image: 'https://ui-avatars.com/api/?name=Chanson&background=0055A4&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Embodies French romanticism and storytelling through music',
    country: 'france',
  },
  {
    id: 'it1',
    title: 'Opera',
    artist: 'Luciano Pavarotti',
    description: 'Italian classical vocal music with dramatic performances',
    genre: 'Classical',
    image: 'https://ui-avatars.com/api/?name=Opera&background=009246&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Italy is the birthplace of opera, influencing classical music worldwide',
    country: 'italy',
  },
  {
    id: 'es1',
    title: 'Flamenco',
    artist: 'Paco de Lucía',
    description: 'Passionate Spanish music and dance from Andalusia',
    genre: 'Traditional',
    image: 'https://ui-avatars.com/api/?name=Flamenco&background=AA151B&color=fff&size=400',
    spotifyLink: '#',
    culturalSignificance: 'UNESCO-recognized cultural heritage expressing deep emotions',
    country: 'spain',
  },
  {
    id: 'de1',
    title: 'Classical Music',
    artist: 'Ludwig van Beethoven',
    description: 'Symphonic and orchestral masterpieces',
    genre: 'Classical',
    image: 'https://ui-avatars.com/api/?name=Classical&background=000000&color=DD0000&size=400',
    spotifyLink: '#',
    culturalSignificance: 'Germany\'s profound contribution to Western classical music',
    country: 'germany',
  },
];

// Proverbs & Sayings
const mockProverbs = [
  {
    id: '1',
    shona: 'Chakafukidza dzimba matenga',
    english: 'What covers houses is the roof',
    meaning: 'Everyone has their problems, even if you can\'t see them from outside',
    usage: 'Used to remind people not to judge others or be envious',
    country: 'zimbabwe',
  },
  {
    id: '2',
    shona: 'Chara chimwe hachitswanyi inda',
    english: 'One finger cannot kill a louse',
    meaning: 'Unity is strength, teamwork is essential',
    usage: 'Encourages collaboration and community support',
    country: 'zimbabwe',
  },
  {
    id: '3',
    shona: 'Kukura kwemazuva',
    english: 'Growing of the days',
    meaning: 'Things take time, patience is important',
    usage: 'Reminds people to be patient with progress',
    country: 'zimbabwe',
  },
  {
    id: '4',
    ndebele: 'Isandla siyagezana',
    english: 'Hands wash each other',
    meaning: 'We need to help each other',
    usage: 'Promotes mutual support and reciprocity',
    country: 'zimbabwe',
  },
  {
    id: 'sa1',
    language: 'Zulu',
    original: 'Ubuntu ngumuntu ngabantu',
    english: 'A person is a person through other people',
    meaning: 'Our humanity is tied to the humanity of others',
    usage: 'The philosophy of Ubuntu - interconnectedness',
    country: 'south-africa',
  },
  {
    id: 'ng1',
    language: 'Yoruba',
    original: 'Àgbájọ ọwọ́ ni a fi ń sọ àlà',
    english: 'It is with collective hands that we wash okra',
    meaning: 'Teamwork makes the work easier',
    usage: 'Encourages community effort',
    country: 'nigeria',
  },
  {
    id: 'cn1',
    language: 'Chinese',
    original: '千里之行，始于足下 (Qiān lǐ zhī xíng, shǐ yú zú xià)',
    english: 'A journey of a thousand miles begins with a single step',
    meaning: 'Great achievements start with small actions',
    usage: 'Encourages people to start working towards their goals',
    country: 'china',
  },
  {
    id: 'cn2',
    language: 'Chinese',
    original: '授人以鱼不如授人以渔 (Shòu rén yǐ yú bùrú shòu rén yǐ yú)',
    english: 'Give a man a fish and you feed him for a day; teach him to fish and you feed him for a lifetime',
    meaning: 'Teaching someone a skill is better than doing things for them',
    usage: 'Emphasizes education and self-sufficiency',
    country: 'china',
  },
  {
    id: 'uk1',
    language: 'English',
    original: 'Every cloud has a silver lining',
    english: 'Every cloud has a silver lining',
    meaning: 'Even in bad situations, there\'s something positive',
    usage: 'To encourage optimism during difficult times',
    country: 'uk',
  },
  {
    id: 'fr1',
    language: 'French',
    original: 'Petit à petit, l\'oiseau fait son nid',
    english: 'Little by little, the bird builds its nest',
    meaning: 'Persistence and patience lead to success',
    usage: 'Encourages steady, gradual progress',
    country: 'france',
  },
  {
    id: 'it1',
    language: 'Italian',
    original: 'Chi va piano, va sano e va lontano',
    english: 'He who goes slowly, goes safely and goes far',
    meaning: 'Taking your time leads to better, longer-lasting results',
    usage: 'Encourages patience and careful planning',
    country: 'italy',
  },
  {
    id: 'es1',
    language: 'Spanish',
    original: 'No hay mal que por bien no venga',
    english: 'There\'s no bad from which good doesn\'t come',
    meaning: 'Something good can come from bad situations',
    usage: 'Finding the positive in negative experiences',
    country: 'spain',
  },
  {
    id: 'de1',
    language: 'German',
    original: 'Übung macht den Meister',
    english: 'Practice makes the master',
    meaning: 'Continuous practice leads to expertise',
    usage: 'Encourages dedication and repetition',
    country: 'germany',
  },
];

// Art & Crafts
const mockArt = [
  {
    id: '1',
    title: 'Stone Sculpture',
    artist: 'Traditional Shona Artists',
    description: 'World-renowned sculptures carved from serpentine and springstone',
    image: 'https://ui-avatars.com/api/?name=Stone+Sculpture&background=00843D&color=fff&size=400',
    category: 'Sculpture',
    culturalInfo: 'Shona stone sculpture is considered one of the most important art movements in Africa',
    country: 'zimbabwe',
  },
  {
    id: '2',
    title: 'Basket Weaving',
    artist: 'Tonga Community',
    description: 'Intricate baskets made from natural materials with traditional patterns',
    image: 'https://ui-avatars.com/api/?name=Baskets&background=FFD100&color=000&size=400',
    category: 'Craft',
    culturalInfo: 'Each pattern tells a story and represents different aspects of life',
    country: 'zimbabwe',
  },
  {
    id: '3',
    title: 'Ndebele Beadwork',
    description: 'Colorful beaded jewelry and decorative items',
    image: 'https://ui-avatars.com/api/?name=Beadwork&background=EA3721&color=fff&size=400',
    category: 'Jewelry',
    culturalInfo: 'Colors and patterns indicate social status and life stages',
    country: 'zimbabwe',
  },
  {
    id: 'sa1',
    title: 'Ndebele Wall Art',
    artist: 'Esther Mahlangu',
    description: 'Geometric patterns painted on houses',
    image: 'https://ui-avatars.com/api/?name=Wall+Art&background=007A3D&color=fff&size=400',
    category: 'Painting',
    culturalInfo: 'Bold geometric designs that have influenced modern art worldwide',
    country: 'south-africa',
  },
  {
    id: 'ng1',
    title: 'Bronze Casting',
    artist: 'Benin Artisans',
    description: 'Ancient bronze sculptures from the Benin Kingdom',
    image: 'https://ui-avatars.com/api/?name=Bronze&background=008751&color=fff&size=400',
    category: 'Sculpture',
    culturalInfo: 'Dating back to the 13th century, showcasing advanced metalworking',
    country: 'nigeria',
  },
  {
    id: 'cn1',
    title: 'Chinese Calligraphy',
    artist: 'Wang Xizhi tradition',
    description: 'Ancient art of beautiful writing with brush and ink',
    image: 'https://ui-avatars.com/api/?name=Calligraphy&background=DE2910&color=fff&size=400',
    category: 'Painting',
    culturalInfo: 'One of the highest forms of Chinese art, combining writing and painting',
    country: 'china',
  },
  {
    id: 'cn2',
    title: 'Porcelain & Pottery',
    description: 'Fine china and ceramic art',
    image: 'https://ui-avatars.com/api/?name=Porcelain&background=FFDE00&color=DE2910&size=400',
    category: 'Craft',
    culturalInfo: 'Chinese porcelain is so renowned that "china" became synonymous with fine ceramics',
    country: 'china',
  },
  {
    id: 'uk1',
    title: 'Afternoon Tea Culture',
    description: 'Traditional tea service with fine china and etiquette',
    image: 'https://ui-avatars.com/api/?name=Tea+Culture&background=012169&color=fff&size=400',
    category: 'Cultural Practice',
    culturalInfo: 'Dating from the 1840s, afternoon tea is a quintessentially British tradition',
    country: 'uk',
  },
  {
    id: 'fr1',
    title: 'Impressionist Painting',
    artist: 'Claude Monet',
    description: 'Revolutionary art movement capturing light and movement',
    image: 'https://ui-avatars.com/api/?name=Impressionism&background=0055A4&color=fff&size=400',
    category: 'Painting',
    culturalInfo: 'French Impressionism changed the art world in the late 19th century',
    country: 'france',
  },
  {
    id: 'it1',
    title: 'Renaissance Art',
    artist: 'Michelangelo, Leonardo da Vinci',
    description: 'Masterpieces from the height of the Renaissance',
    image: 'https://ui-avatars.com/api/?name=Renaissance&background=009246&color=fff&size=400',
    category: 'Painting & Sculpture',
    culturalInfo: 'Italy birthed the Renaissance, producing some of history\'s greatest artists',
    country: 'italy',
  },
  {
    id: 'es1',
    title: 'Gaudi Architecture',
    artist: 'Antoni Gaudí',
    description: 'Unique modernist architecture in Barcelona',
    image: 'https://ui-avatars.com/api/?name=Gaudi&background=AA151B&color=fff&size=400',
    category: 'Architecture',
    culturalInfo: 'Gaudí\'s fantastical buildings define Barcelona\'s skyline',
    country: 'spain',
  },
];

// Cultural Events
const mockEvents = [
  {
    id: '1',
    title: 'Zimbabwe Independence Day',
    date: 'April 18',
    description: 'Celebration of independence gained in 1980',
    traditions: ['Flag raising ceremonies', 'Cultural performances', 'National speeches'],
    image: 'https://ui-avatars.com/api/?name=Independence&background=00843D&color=fff&size=400',
    country: 'zimbabwe',
  },
  {
    id: '2',
    title: 'Harare International Festival of Arts (HIFA)',
    date: 'April/May',
    description: 'Week-long celebration of arts and culture',
    traditions: ['Music performances', 'Dance shows', 'Art exhibitions', 'Poetry'],
    image: 'https://ui-avatars.com/api/?name=HIFA&background=FFD100&color=000&size=400',
    country: 'zimbabwe',
  },
  {
    id: '3',
    title: 'Mabuku Festival',
    date: 'August',
    description: 'Literary and book festival celebrating African literature',
    traditions: ['Book readings', 'Author talks', 'Writing workshops'],
    image: 'https://ui-avatars.com/api/?name=Books&background=EA3721&color=fff&size=400',
    country: 'zimbabwe',
  },
  {
    id: 'sa1',
    title: 'Heritage Day',
    date: 'September 24',
    description: 'Celebrating South Africa\'s diverse cultures (Braai Day)',
    traditions: ['Braai (barbecue)', 'Traditional dress', 'Cultural performances'],
    image: 'https://ui-avatars.com/api/?name=Heritage&background=007A3D&color=fff&size=400',
    country: 'south-africa',
  },
  {
    id: 'ng1',
    title: 'Eyo Festival',
    date: 'Various',
    description: 'Lagos masquerade festival',
    traditions: ['Masquerade parades', 'Traditional music', 'Cultural dances'],
    image: 'https://ui-avatars.com/api/?name=Eyo&background=008751&color=fff&size=400',
    country: 'nigeria',
  },
  {
    id: 'cn1',
    title: 'Chinese New Year (Spring Festival)',
    date: 'Late January - February',
    description: 'The most important Chinese celebration marking the lunar new year',
    traditions: ['Red envelopes (hongbao)', 'Dragon dances', 'Firecrackers', 'Family reunion dinner'],
    image: 'https://ui-avatars.com/api/?name=CNY&background=DE2910&color=FFDE00&size=400',
    country: 'china',
  },
  {
    id: 'cn2',
    title: 'Mid-Autumn Festival',
    date: 'September/October',
    description: 'Festival celebrating harvest and family unity',
    traditions: ['Eating mooncakes', 'Lantern displays', 'Moon gazing', 'Family gatherings'],
    image: 'https://ui-avatars.com/api/?name=Mooncake&background=FFDE00&color=DE2910&size=400',
    country: 'china',
  },
  {
    id: 'uk1',
    title: 'Bonfire Night',
    date: 'November 5',
    description: 'Commemorating the failed Gunpowder Plot of 1605',
    traditions: ['Fireworks displays', 'Bonfires', 'Burning Guy Fawkes effigies', 'Toffee apples'],
    image: 'https://ui-avatars.com/api/?name=Bonfire&background=012169&color=fff&size=400',
    country: 'uk',
  },
  {
    id: 'fr1',
    title: 'Bastille Day',
    date: 'July 14',
    description: 'French national day celebrating the storming of the Bastille in 1789',
    traditions: ['Military parade', 'Fireworks', 'Parties', 'Tricolour flags everywhere'],
    image: 'https://ui-avatars.com/api/?name=Bastille&background=EF4135&color=fff&size=400',
    country: 'france',
  },
  {
    id: 'it1',
    title: 'Carnevale',
    date: 'February/March',
    description: 'Pre-Lenten festival with elaborate masks and costumes',
    traditions: ['Masquerade balls', 'Street parties', 'Traditional sweets', 'Water battles'],
    image: 'https://ui-avatars.com/api/?name=Carnevale&background=009246&color=fff&size=400',
    country: 'italy',
  },
  {
    id: 'es1',
    title: 'La Tomatina',
    date: 'Last Wednesday of August',
    description: 'World\'s biggest food fight in Buñol',
    traditions: ['Tomato throwing', 'Street parties', 'Music', 'Paella after the battle'],
    image: 'https://ui-avatars.com/api/?name=Tomatina&background=AA151B&color=fff&size=400',
    country: 'spain',
  },
  {
    id: 'de1',
    title: 'Oktoberfest',
    date: 'Late September - Early October',
    description: 'World\'s largest beer festival in Munich',
    traditions: ['Traditional Bavarian clothing', 'Beer tents', 'Pretzels', 'Folk music'],
    image: 'https://ui-avatars.com/api/?name=Oktoberfest&background=000000&color=DD0000&size=400',
    country: 'germany',
  },
];

// Language Learning
const mockPhrases = [
  { shona: 'Mangwanani', english: 'Good morning', pronunciation: 'mahn-gwah-NAH-nee', country: 'zimbabwe' },
  { shona: 'Masikati', english: 'Good afternoon', pronunciation: 'mah-see-KAH-tee', country: 'zimbabwe' },
  { shona: 'Manheru', english: 'Good evening', pronunciation: 'mahn-HEH-roo', country: 'zimbabwe' },
  { shona: 'Ndeipi?', english: 'How are you?', pronunciation: 'n-DEY-pee', country: 'zimbabwe' },
  { shona: 'Ndiripo', english: 'I am fine', pronunciation: 'n-dee-REE-poh', country: 'zimbabwe' },
  { shona: 'Makorokoto', english: 'Congratulations', pronunciation: 'mah-koh-roh-KOH-toh', country: 'zimbabwe' },
  { ndebele: 'Sawubona', english: 'Hello', pronunciation: 'sah-woo-BOH-nah', country: 'zimbabwe' },
  { ndebele: 'Kunjani?', english: 'How are you?', pronunciation: 'koon-JAH-nee', country: 'zimbabwe' },
  { ndebele: 'Ngikhona', english: 'I am fine', pronunciation: 'ng-gee-KOH-nah', country: 'zimbabwe' },
  { language: 'Zulu', original: 'Sawubona', english: 'Hello (to one person)', pronunciation: 'sah-woo-BOH-nah', country: 'south-africa' },
  { language: 'Zulu', original: 'Unjani?', english: 'How are you?', pronunciation: 'oon-JAH-nee', country: 'south-africa' },
  { language: 'Afrikaans', original: 'Goeie môre', english: 'Good morning', pronunciation: 'KHOO-yuh MOR-uh', country: 'south-africa' },
  { language: 'Yoruba', original: 'Ẹ káàrọ̀', english: 'Good morning', pronunciation: 'eh KAH-roh', country: 'nigeria' },
  { language: 'Yoruba', original: 'Bawo ni?', english: 'How are you?', pronunciation: 'BAH-woh nee', country: 'nigeria' },
  { language: 'Swahili', original: 'Habari', english: 'Hello/How are you?', pronunciation: 'hah-BAH-ree', country: 'kenya' },
  { language: 'Swahili', original: 'Asante', english: 'Thank you', pronunciation: 'ah-SAHN-teh', country: 'kenya' },
  { language: 'Mandarin', original: '你好 (Nǐ hǎo)', english: 'Hello', pronunciation: 'nee how', country: 'china' },
  { language: 'Mandarin', original: '谢谢 (Xièxiè)', english: 'Thank you', pronunciation: 'syeh-syeh', country: 'china' },
  { language: 'Mandarin', original: '早上好 (Zǎoshang hǎo)', english: 'Good morning', pronunciation: 'zow-shung how', country: 'china' },
  { language: 'English', original: 'Cheers', english: 'Thanks / Goodbye', pronunciation: 'cheerz', country: 'uk' },
  { language: 'English', original: 'Lovely', english: 'Very nice', pronunciation: 'LUV-lee', country: 'uk' },
  { language: 'French', original: 'Bonjour', english: 'Hello / Good day', pronunciation: 'bon-ZHOOR', country: 'france' },
  { language: 'French', original: 'Merci beaucoup', english: 'Thank you very much', pronunciation: 'mare-see bow-KOO', country: 'france' },
  { language: 'French', original: 'S\'il vous plaît', english: 'Please', pronunciation: 'seel voo PLEH', country: 'france' },
  { language: 'German', original: 'Guten Tag', english: 'Good day', pronunciation: 'GOO-ten tahk', country: 'germany' },
  { language: 'German', original: 'Danke schön', english: 'Thank you very much', pronunciation: 'DAHN-kuh shern', country: 'germany' },
  { language: 'Spanish', original: '¡Hola!', english: 'Hello!', pronunciation: 'OH-lah', country: 'spain' },
  { language: 'Spanish', original: 'Gracias', english: 'Thank you', pronunciation: 'GRAH-see-ahs', country: 'spain' },
  { language: 'Spanish', original: 'Por favor', english: 'Please', pronunciation: 'por fah-VOR', country: 'spain' },
  { language: 'Italian', original: 'Ciao', english: 'Hello / Goodbye (informal)', pronunciation: 'CHOW', country: 'italy' },
  { language: 'Italian', original: 'Grazie mille', english: 'Thanks a lot', pronunciation: 'GRAHT-see-eh MEE-leh', country: 'italy' },
  { language: 'Italian', original: 'Buongiorno', english: 'Good morning', pronunciation: 'bwon-JOR-no', country: 'italy' },
];

type CultureTab = 'recipes' | 'music' | 'art' | 'events' | 'language' | 'proverbs';

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<CultureTab>('recipes');
  const [selectedCulture, setSelectedCulture] = useState('zimbabwe');
  const [showCultureDropdown, setShowCultureDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get recipes for selected culture
  const getRecipesForCulture = () => {
    switch (selectedCulture) {
      case 'zimbabwe': return mockRecipes;
      case 'south-africa': return southAfricanRecipes;
      case 'nigeria': return nigerianRecipes;
      case 'kenya': return kenyanRecipes;
      case 'china': return chineseRecipes;
      case 'uk': return ukRecipes;
      case 'france': return frenchRecipes;
      case 'italy': return italianRecipes;
      case 'spain': return spanishRecipes;
      case 'germany': return germanRecipes;
      default: return mockRecipes;
    }
  };

  // Filter data by selected culture
  const filteredMusic = mockMusic.filter(m => m.country === selectedCulture);
  const filteredArt = mockArt.filter(a => a.country === selectedCulture);
  const filteredEvents = mockEvents.filter(e => e.country === selectedCulture);
  const filteredProverbs = mockProverbs.filter(p => p.country === selectedCulture);
  const filteredPhrases = mockPhrases.filter(p => p.country === selectedCulture);
  const currentRecipes = getRecipesForCulture();

  // Apply search filter to recipes
  const searchFilteredRecipes = currentRecipes.filter(recipe => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.description.toLowerCase().includes(searchLower) ||
      recipe.category.toLowerCase().includes(searchLower) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower))
    );
  });

  const selectedCultureData = cultures.find(c => c.id === selectedCulture);

  const tabs: { id: CultureTab; label: string; icon: any }[] = [
    { id: 'recipes', label: 'Recipes', icon: Clock },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'art', label: 'Art & Crafts', icon: Palette },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'language', label: 'Language', icon: BookOpen },
    { id: 'proverbs', label: 'Proverbs', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Global Culture Hub 🌍
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Explore and celebrate cultures from around the world
          </p>
        </div>

        {/* Culture Selector */}
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setShowCultureDropdown(!showCultureDropdown)}
              className="flex items-center justify-between w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-gray-900 dark:text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="flex items-center gap-2 sm:gap-3">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-base sm:text-lg truncate">{selectedCultureData?.name || 'Select Culture'}</span>
              </span>
              <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 ${showCultureDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCultureDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40" 
                  onClick={() => setShowCultureDropdown(false)}
                />
                
                {/* Dropdown */}
                <div className="absolute left-0 right-0 z-50 mt-2 sm:mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden max-h-[70vh] overflow-y-auto">
                  {/* Africa Section */}
                  <div className="sticky top-0 z-10 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600">
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">🌍 Africa</span>
                  </div>
                  {cultures.filter(c => ['zimbabwe', 'south-africa', 'nigeria', 'kenya', 'ghana', 'ethiopia'].includes(c.id)).map((culture) => (
                    <button
                      key={culture.id}
                      onClick={() => {
                        setSelectedCulture(culture.id);
                        setShowCultureDropdown(false);
                      }}
                      className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left flex items-center gap-2 sm:gap-3 transition-all ${
                        selectedCulture === culture.id 
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold shadow-inner' 
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-650'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">{culture.flag}</span>
                      <span className="flex-1 font-medium text-sm sm:text-base truncate">{culture.name.replace(culture.flag, '').trim()}</span>
                      {selectedCulture === culture.id && <span className="text-lg sm:text-xl flex-shrink-0">✓</span>}
                    </button>
                  ))}

                  {/* Asia Section */}
                  <div className="sticky top-0 z-10 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-yellow-400 dark:from-red-600 dark:to-yellow-500 mt-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">🌏 Asia</span>
                  </div>
                  {cultures.filter(c => ['china'].includes(c.id)).map((culture) => (
                    <button
                      key={culture.id}
                      onClick={() => {
                        setSelectedCulture(culture.id);
                        setShowCultureDropdown(false);
                      }}
                      className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left flex items-center gap-2 sm:gap-3 transition-all ${
                        selectedCulture === culture.id 
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold shadow-inner' 
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-650'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">{culture.flag}</span>
                      <span className="flex-1 font-medium text-sm sm:text-base truncate">{culture.name.replace(culture.flag, '').trim()}</span>
                      {selectedCulture === culture.id && <span className="text-lg sm:text-xl flex-shrink-0">✓</span>}
                    </button>
                  ))}

                  {/* Europe Section */}
                  <div className="sticky top-0 z-10 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 mt-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">🇪🇺 Europe</span>
                  </div>
                  {cultures.filter(c => ['uk', 'france', 'germany', 'spain', 'italy'].includes(c.id)).map((culture) => (
                    <button
                      key={culture.id}
                      onClick={() => {
                        setSelectedCulture(culture.id);
                        setShowCultureDropdown(false);
                      }}
                      className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left flex items-center gap-2 sm:gap-3 transition-all ${
                        selectedCulture === culture.id 
                          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-bold shadow-inner' 
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-650'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl flex-shrink-0">{culture.flag}</span>
                      <span className="flex-1 font-medium text-sm sm:text-base truncate">{culture.name.replace(culture.flag, '').trim()}</span>
                      {selectedCulture === culture.id && <span className="text-lg sm:text-xl flex-shrink-0">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* No content message */}
          {!['zimbabwe', 'south-africa', 'nigeria', 'kenya', 'china', 'uk', 'france', 'italy', 'spain', 'germany'].includes(selectedCulture) && (
            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Note:</strong> More content coming soon! Students from {selectedCultureData?.name} can contribute their cultural content.
              </p>
            </div>
          )}
        </div>

        {/* Culture Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-primary)] text-gray-900 dark:text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <>
            {/* Search Bar for Recipes */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search recipes by name, ingredient, or category..."
                className="w-full"
              />
            </div>

            {searchFilteredRecipes.length > 0 ? (
              <>
                {searchQuery && (
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Found {searchFilteredRecipes.length} recipe{searchFilteredRecipes.length !== 1 ? 's' : ''}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {searchFilteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="card cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
              />
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
                {recipe.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                {recipe.description}
              </p>

              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.prepTime + recipe.cookTime}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings}
                  </div>
                </div>
                <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer" />
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                By {recipe.authorName}
              </div>
            </div>
          ))}
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery 
                    ? `No recipes found matching "${searchQuery}"`
                    : `No recipes available yet for ${selectedCultureData?.name}`}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Clear search
                  </button>
                )}
                <button className="btn-primary mt-4">
                  Be the First to Share a Recipe!
                </button>
              </div>
            )}
          </>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <>
            {filteredMusic.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredMusic.map((music) => (
              <div key={music.id} className="card">
                <img
                  src={music.image}
                  alt={music.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-5 w-5 text-[var(--color-primary)]" />
                  <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] px-2 py-1 rounded">
                    {music.genre}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {music.title}
                </h3>
                {music.artist && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {music.artist}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {music.description}
                </p>
                <div className="bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/30 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <strong className="text-gray-900 dark:text-white">Cultural Significance:</strong> {music.culturalSignificance}
                  </p>
                </div>
                <button className="btn-primary w-full">
                  🎵 Listen Now
                </button>
              </div>
            ))}
          </div>
            ) : (
              <div className="card text-center py-12">
                <Music className="h-16 w-16 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No music available yet for {selectedCultureData?.name}
                </p>
              </div>
            )}
          </>
        )}

        {/* Art & Crafts Tab */}
        {activeTab === 'art' && (
          <>
            {filteredArt.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredArt.map((art) => (
              <div key={art.id} className="card">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-5 w-5 text-[var(--color-primary)]" />
                  <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] px-2 py-1 rounded">
                    {art.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {art.title}
                </h3>
                {art.artist && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {art.artist}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {art.description}
                </p>
                <div className="bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    💡 {art.culturalInfo}
                  </p>
                </div>
              </div>
            ))}
          </div>
            ) : (
              <div className="card text-center py-12">
                <Palette className="h-16 w-16 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No art & crafts available yet for {selectedCultureData?.name}
                </p>
              </div>
            )}
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {filteredEvents.map((event) => (
              <div key={event.id} className="card">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
                  <span className="text-sm font-semibold text-[var(--color-primary)]">
                    {event.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {event.description}
                </p>
                <div className="bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Traditions & Activities:
                  </h4>
                  <ul className="space-y-1">
                    {event.traditions.map((tradition, idx) => (
                      <li key={idx} className="text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <span className="text-[var(--color-primary)]">✓</span>
                        {tradition}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
            ) : (
              <div className="card text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No cultural events available yet for {selectedCultureData?.name}
                </p>
              </div>
            )}
          </>
        )}

        {/* Language Learning Tab */}
        {activeTab === 'language' && (
          <>
            {filteredPhrases.length > 0 ? (
              <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-[var(--color-primary)]" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  Learn Local Languages
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start with these common phrases from {selectedCultureData?.name}!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-[var(--color-primary-50)] to-white dark:from-[var(--color-primary-900)]/40 dark:to-gray-800 p-4 rounded-lg border-l-4 border-[var(--color-primary)] shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {phrase.shona || phrase.ndebele || phrase.original}
                      </h3>
                      <span className="text-xs bg-[var(--color-primary)] text-gray-900 dark:text-white px-2 py-1 rounded font-semibold">
                        {phrase.shona ? 'Shona' : phrase.ndebele ? 'Ndebele' : phrase.language}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-1 font-medium">
                      {phrase.english}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      ({phrase.pronunciation})
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-gray-900 dark:text-white">
              <h3 className="text-xl font-bold mb-3">🎯 Practice Daily!</h3>
              <p className="mb-4">
                Try using one new phrase each day when talking to fellow students.
              </p>
              <button className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                Start Language Quiz
              </button>
            </div>
          </div>
            ) : (
              <div className="card text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No language phrases available yet for {selectedCultureData?.name}
                </p>
              </div>
            )}
          </>
        )}

        {/* Proverbs Tab */}
        {activeTab === 'proverbs' && (
          <>
            {filteredProverbs.length > 0 ? (
              <div className="space-y-6">
            <div className="card bg-gradient-to-br from-[var(--color-primary-50)] to-white dark:from-gray-800/50 dark:to-gray-900">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-[var(--color-primary)]" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Wisdom from Our Ancestors
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Traditional proverbs that guide values and teach life lessons
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {filteredProverbs.map((proverb) => (
                <div
                  key={proverb.id}
                  className="card bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[var(--color-primary)] text-gray-900 dark:text-white p-3 rounded-full flex-shrink-0">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-xs bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/40 text-[var(--color-primary)] dark:text-[var(--color-primary-300)] px-2 py-1 rounded font-semibold">
                        {proverb.shona ? 'Shona' : proverb.ndebele ? 'Ndebele' : proverb.language}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {proverb.shona || proverb.ndebele || proverb.original}
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-3 italic font-medium">{" "}
                      "{proverb.english}"
                    </p>
                    <div className="bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/30 p-4 rounded-lg mb-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Meaning:
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        {proverb.meaning}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <BookOpen className="h-4 w-4" />
                      <span><strong className="text-gray-900 dark:text-white">When to use:</strong> {proverb.usage}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

            <div className="card bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-gray-900 dark:text-white">
              <h3 className="text-xl font-bold mb-3">💬 Share Your Proverbs</h3>
              <p className="mb-4">
                Know a proverb that's not listed? Share it with the community!
              </p>
              <button className="bg-white text-[var(--color-primary)] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                Submit a Proverb
              </button>
            </div>
          </div>
            ) : (
              <div className="card text-center py-12">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No proverbs available yet for {selectedCultureData?.name}
                </p>
              </div>
            )}
          </>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg mb-4 sm:mb-6"
              />

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                {selectedRecipe.title}
              </h2>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                {selectedRecipe.description}
              </p>

              <div className="flex gap-4 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-800 dark:text-white">Prep Time</div>
                  <div className="text-gray-600 dark:text-gray-400">{selectedRecipe.prepTime} min</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 dark:text-white">Cook Time</div>
                  <div className="text-gray-600 dark:text-gray-400">{selectedRecipe.cookTime} min</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800 dark:text-white">Servings</div>
                  <div className="text-gray-600 dark:text-gray-400">{selectedRecipe.servings}</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Ingredients
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="pl-2">{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  Tips
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {selectedRecipe.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              {selectedRecipe.whereToFindIngredients && (
                <div className="bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)] p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                    🌍 Where to Find Ingredients
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedRecipe.whereToFindIngredients}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedRecipe(null)}
                className="mt-6 w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
