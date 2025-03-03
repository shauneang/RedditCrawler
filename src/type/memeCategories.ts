/**
 * Enum for Meme Categories
 */
export enum MemeCategory {
    PopCulture = "Pop Culture Meme",
    Gaming = "Gaming Meme",
    Political = "Political Meme",
    Wholesome = "Wholesome Meme",
    DarkHumor = "Dark Humor Meme",
    Animal = "Animal Meme",
    Relatable = "Relatable Meme"
}

export const MEME_CATEGORIES_LIST: string[] = Object.values(MemeCategory);