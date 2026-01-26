import { useState } from 'react';
import { Clock, Users, Heart } from 'lucide-react';
import { Recipe } from '../types';

// Mock data
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

export default function Recipes() {
  const [recipes] = useState(mockRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Recipes & Culture 🍲
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Share traditional Zimbabwean recipes and find ingredients abroad
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recipes.map((recipe) => (
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
