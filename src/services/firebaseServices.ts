import { db } from "../database";

const redditCollection = db.collection("reddit_posts");

export const savePostToFirestore = async (postData: any) => {
    try {
        const postExists = await redditCollection.where("post_id", "==", postData.post_id).get();

        if (postExists.empty) {
            await redditCollection.add(postData);
            console.log(`✅ Saved post: ${postData.title}`);
        } else {
            console.log(`⚠️ Post already exists: ${postData.title}`);
        }
    } catch (error) {
        console.error("Error saving post to Firestore:", error);
    }
};

export const getPostsFromFirestore = async (limit: number): Promise<any[]> => {
    try {
        const snapshot = await redditCollection.orderBy("timestamp", "desc").limit(limit).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching posts from Firestore:", error);
        throw new Error("Failed to fetch posts");
    }
};