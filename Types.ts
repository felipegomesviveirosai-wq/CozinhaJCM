
export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  ingredients: string[];
  instructions: string[];
}

export enum SearchMode {
  BY_INGREDIENTS = 'ingredients',
  BY_NAME = 'name',
}
