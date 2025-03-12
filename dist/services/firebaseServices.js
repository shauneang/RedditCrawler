"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsInFirestore = exports.getPostsFromFirestore = exports.savePostToFirestore = void 0;
const database_1 = require("../database");
const redditCollection = database_1.db.collection("top_memes");
/**
 * Save a Reddit post to Firestore using `post_id + fetch_timestamp` as the document ID.
 * If the post already exists for that hour, update it instead of creating a new entry.
 */
const savePostToFirestore = (postData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a unique document ID using post_id + fetch_timestamp
        const docId = `${postData.fetch_timestamp.getTime()}_${postData.post_id}`;
        // Reference the document
        const postRef = redditCollection.doc(docId);
        const postSnapshot = yield postRef.get();
        if (postSnapshot.exists) {
            // If post exists, update its values
            yield postRef.update({
                up_votes: postData.up_votes,
                down_votes: postData.down_votes,
                score: postData.score,
                num_comments: postData.num_comments,
            });
            console.log(`🔄 Updated post: ${postData.title}`);
        }
        else {
            // If post does not exist, create a new entry
            yield postRef.set(postData);
            console.log(`✅ Saved new post: ${postData.title}`);
        }
    }
    catch (error) {
        console.error("❌ Error saving post to Firestore:", error);
    }
});
exports.savePostToFirestore = savePostToFirestore;
const getPostsFromFirestore = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const snapshot = yield redditCollection.orderBy("fetch_timestamp", "desc").limit(limit).get();
        return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    }
    catch (error) {
        console.error("Error fetching posts from Firestore:", error);
        throw new Error("Failed to fetch posts");
    }
});
exports.getPostsFromFirestore = getPostsFromFirestore;
const existsInFirestore = (meme) => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a unique document ID using post_id + fetch_timestamp
    const docId = `${meme.fetch_timestamp.getTime()}_${meme.post_id}`;
    // Reference the document
    const postRef = redditCollection.doc(docId);
    const postSnapshot = yield postRef.get();
    return postSnapshot.exists;
});
exports.existsInFirestore = existsInFirestore;
