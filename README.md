# Meme Analytics Bot - Reddit Meme Data Analysis & Reporting

A brief description of what this project does and who it's for

## 📖 About This Project

Meme Analytics Bot is a **Reddit meme analysis tool** that scrapes and analyzes the **top trending memes** from r/memes. It leverages **Reddit API**, **Firebase Firestore**, **Natural Language Processing (NLP)**, and **Google Vision AI** to extract insights from memes.

🚀 **Core Features:**

- **Scrapes top memes from the past 24 hours** 📊
- **Performs text and image analysis using AI** 🧠
- **Extracts and ranks keywords from meme text** 🔑
- **Generates sentiment analysis & popularity trends** 📈
- **Creates PDF reports with charts and tables** 📄
- **Telegram bot for instant report delivery** 🤖

📌 **Technologies Used:**
✅ **Backend:** Node.js, Express, Firebase Firestore
✅ **Scraping:** Reddit API
✅ **Analysis:** Google Vision AI, NLP.js, Compromise NLP
✅ **Visualization:** Chart.js, chartjs-node-canvas, pdfmake
✅ **Bot Integration:** Telegram API

## Installation

Follow these steps to set up and run the Meme Analytics Bot.

#### 🔧 Prerequisites

Ensure you have the following installed:

- Node.js (LTS Recommended)
- npm or yarn
- Firebase Admin Service Account (For Firestore)
- Google Cloud Service Account Credentials file (For Vision API)
- Telegram Bot Token (For Telegram Bot Integration)

#### 🔥 Set Up Firebase Firestore

    1.	Create a Firebase Project at Firebase Console.
    2.	Enable Firestore Database.
    3.	Download the Firebase Admin SDK JSON and save it as ./config/firebase-admin.json.
    4.	Deploy Firestore Rules (Optional):

#### 🔍 Enable Google Cloud Vision API

    1.	Go to Google Cloud Console.
    2.	Enable “Vision AI API” for your project.
    3.	Download Service Account JSON and save it as ./config/memevision-key.json.

#### 🤖 Create Telegram Bot

    1.	Go to Bot Father on Telegram.
    2.	Create new bot.
    3.	Save TELEGRAM_BOT_TOKEN.

### 1. Clone the Repository

```
git clone https://github.com/yourusername/meme-analytics-bot.git
cd meme-analytics-bot
```

### 📦 2. Install Dependencies

```
npm install
```

or with yarn:

```
yarn install
```

### ⚙️ 3. Set Up Environment Variables

Create a .env file in the root directory and add:

#### Firebase Credentials (Path to Firebase Admin SDK JSON)

```
FIREBASE_CREDENTIALS=./config/firebase-admin.json
```

#### Telegram Bot Token

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

#### Google Cloud Vision API Credentials

```
GOOGLE_APPLICATION_CREDENTIALS=./config/memevision-key.json
```

### 🚀 6. Start the Server

#### Run the application:

```
npm start
```

or in development mode:

```
npm run dev
```

### 📊 7. Fetch Meme Data

Scrape memes and store them in Firestore:

```
curl -X POST http://localhost:5000/memes/fetch
```

### ✅ 8. Generate a Meme Report

Request a report via Telegram:

```
/get_report
```

🎉 Done!

Your Meme Analytics Bot is now running successfully! 🚀🔥

## Documentation

### 📖 Overview

The Meme Analytics Bot is a full-stack system designed to:

- Scrape top trending memes from Reddit.
- Perform image and text analysis using AI.
- Store meme data in Firebase Firestore.
- Generate PDF reports with data insights.
- Allow Telegram bot interactions for retrieving reports.

### 🚀 System Components

The system is composed of several key components:
| Components | Description |
| :-------- | :------- |
| Reddit Scraper | Fetches top memes from the Reddit API and stores them in Firestore. |
| Data Processing Layer | Uses AI and NLP to analyze memes (image recognition, sentiment, keyword extraction). |
| Firestore Database | Stores meme data, user requests, and analysis results. |
| Express.js API | Handles API endpoints for fetching and processing meme data. |
| PDF Generation Service | Creates visual reports with graphs and meme statistics. |
| Telegram Bot | Allows users to request reports and fetch data using commands like /getreport and /getdata. |

![Architecture Diagram](./public/Architecture%20Diagram.png)

### 🛠️ Technologies Used

| Technology                     | Description                           |
| :----------------------------- | :------------------------------------ |
| Node.js + Express.js           | Backend API and routing               |
| Firebase Firestore             | NoSQL database for meme storage       |
| Reddit API                     | Fetching trending memes               |
| Google Vision AI               | Image recognition and OCR             |
| Compromise NLP                 | Text analysis and keyword extraction  |
| Sentiment                      | Sentiment analysis                    |
| Chart.js + ChartJS Node Canvas | Data visualization                    |
| pdfmake                        | PDF generation for meme reports       |
| Telegram Bot API               | Enables user interaction via Telegram |

### 📥 Data Flow

#### 1. Meme Scraping Process

- A cron job or API request triggers Reddit API to fetch the latest top memes.
- Meme data is stored in Firestore with timestamps.
- The AI module extracts text from memes using OCR.

#### 2. Meme Analysis

- NLP processes extracted text for sentiment & keyword analysis.
- AI categorizes memes into predefined types (e.g., Dank, Political, Gaming).
- Data is stored and updated in Firestore.

#### 3. Report Generation & API Processing

- Users request meme reports via Telegram (/getreport).
- Backend queries Firestore, processes meme data, and generates a PDF report.
- The report is sent via Telegram and automatically deleted after sending.

#### 4. Telegram Bot Interaction

- Users can request live meme data (/getdata).
- The bot packages meme data into a JSON file and sends it to the user.
- All interactions are logged.

### 📌 Database Schema (Firestore)

The top_memes collection stores meme data:

```json
{
    "post_id": "t3_abc123",
    "title": "Me when it's Monday again...",
    "subreddit": "memes",
    "author": "u/funnyuser",
    "url": "https://i.redd.it/samplememe.jpg",
    "up_votes": 12000,
    "down_votes": 500,
    "upvote_ratio": 0.96,
    "num_comments": 800,
    "fetch_timestamp": "2025-03-04T15:30:00Z",
    "post_timestamp": "2025-03-04T14:30:00Z",
    "meme_analysis": {
        "sentiment": 2,
        "keywords": [
            { "word": "Monday", "count": 3 },
            { "word": "work", "count": 2 }
        ],
        "detected_objects": [
            "Animated cartoon",
            "Fiction",
            "Science"
        ],
        "ocr_text": "YOU DOWNLOAD FIREFOX WHAT IS MY PURPOSE?"
```

## API Reference

#### Scrape Reddit API for Top Memes

```http
  POST /memes/fetch
```

Fetches the top trending memes from Firebase Firestore, based on upvotes in the last 24 hours.

---

#### Get latest memes

```http
  GET /memes
```

Fetches the latest request for top 20 memes from Firebase Firestore, based on upvotes in the last 24 hours.

---

#### Get top memes by hour

```http
  GET /memes/{hour}
```

Fetches the top trending memes from Firebase Firestore that were retrieved at a specific hour in the past 24 hours.

| Parameter | Type      | Description                                                |
| :-------- | :-------- | :--------------------------------------------------------- |
| `hour`    | `integer` | **Required** The hour (0-23) for which memes are requested |

---

## Telegram Bot

This documentation provides details about the Telegram bot commands that interact with the Meme Analytics Bot.

### 🤖 Bot Overview

The Telegram bot allows users to:

- 📊 Retrieve a detailed meme report
- 📂 Get the latest top memes data
- 📬 Receive files directly in chat

## Bot Commands:

### 1. /getreport - Get Meme Analysis Report

#### 📌 Command

```
/getreport
```

#### 📋 Description

- Generates a detailed PDF report with:
- Top meme statistics (upvotes, comments, vote ratio)
- Top ranking creators
- Timestamp analysis (popularity trends by hour)
- Sentiment & keyword analysis
- Graphs and visual insights
- Retrieves data from Firestore:
- First tries to get memes from the latest hourly timestamp.
- If no memes exist, fetches the current top 20 memes.

### 2. /getdata - Get Top 20 Memes Data

#### 📌 Command

```
/getdata
```

#### 📋 Description

- Fetches the top 20 trending memes from Reddit.
- Packages the data into a JSON file for download.
