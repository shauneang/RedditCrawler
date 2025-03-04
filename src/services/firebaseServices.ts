import { db } from "../database";
import { MemeDataType } from "../type/redditTypes";

const redditCollection = db.collection("top_memes");

/**
 * Save a Reddit post to Firestore using `post_id + fetch_timestamp` as the document ID.
 * If the post already exists for that hour, update it instead of creating a new entry.
 */
export const savePostToFirestore = async (postData: MemeDataType) => {
    try {
        // Generate a unique document ID using post_id + fetch_timestamp
        const docId = `${postData.fetch_timestamp.getTime()}_${postData.post_id}`;

        // Reference the document
        const postRef = redditCollection.doc(docId);
        const postSnapshot = await postRef.get();

        if (postSnapshot.exists) {
            // If post exists, update its values
            await postRef.update({
                up_votes: postData.up_votes,
                down_votes: postData.down_votes,
                score: postData.score,
                num_comments: postData.num_comments,
            });
            console.log(`🔄 Updated post: ${postData.title}`);
        } else {
            // If post does not exist, create a new entry
            await postRef.set(postData);
            console.log(`✅ Saved new post: ${postData.title}`);
        }
    } catch (error) {
        console.error("❌ Error saving post to Firestore:", error);
    }
};

export const getPostsFromFirestore = async (limit: number): Promise<any[]> => {
    try {
        const snapshot = await redditCollection.orderBy("fetch_timestamp", "desc").limit(limit).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching posts from Firestore:", error);
        throw new Error("Failed to fetch posts");
    }
};

export const existsInFirestore = async (meme: MemeDataType): Promise<Boolean> => {
    // Generate a unique document ID using post_id + fetch_timestamp
    const docId = `${meme.fetch_timestamp.getTime()}_${meme.post_id}`;

    // Reference the document
    const postRef = redditCollection.doc(docId);
    const postSnapshot = await postRef.get();

    return postSnapshot.exists;
}