import axios from "axios";
import { MEME_CATEGORIES_LIST } from "../type/memeCategories";

export const classifyWithCLIP = async (imageUrl: string): Promise<string> => {

    const response = await axios.post(
        "https://api.replicate.com/v1/predictions",
        {
            version: "openai/clip-vit-base-patch32",
            input: { image: imageUrl, text: MEME_CATEGORIES_LIST }
        },
        {
            headers: { Authorization: `Token YOUR_REPLICATE_API_KEY` }
        }
    );

    console.log("🔥 Meme Category:", response.data.output);
    return response.data.output;
};