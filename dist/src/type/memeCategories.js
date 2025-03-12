"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEME_CATEGORIES_LIST = exports.MemeCategory = void 0;
/**
 * Enum for Meme Categories
 */
var MemeCategory;
(function (MemeCategory) {
    MemeCategory["PopCulture"] = "Pop Culture Meme";
    MemeCategory["Gaming"] = "Gaming Meme";
    MemeCategory["Political"] = "Political Meme";
    MemeCategory["Wholesome"] = "Wholesome Meme";
    MemeCategory["DarkHumor"] = "Dark Humor Meme";
    MemeCategory["Animal"] = "Animal Meme";
    MemeCategory["Relatable"] = "Relatable Meme";
})(MemeCategory || (exports.MemeCategory = MemeCategory = {}));
exports.MEME_CATEGORIES_LIST = Object.values(MemeCategory);
