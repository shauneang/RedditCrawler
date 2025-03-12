import axios from 'axios';

export async function getRedditToken() {
    const auth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`).toString('base64');

    const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        new URLSearchParams({ grant_type: 'client_credentials' }), {
        headers: {
            Authorization: `Basic ${auth}`,
            'User-Agent': 'MyRedditApp/1.0 (by u/YourUsername)',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
    );

    return response.data.access_token;
}