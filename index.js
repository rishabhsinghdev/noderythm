
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const search = require('yt-search'); // Add this line

// Rest of your code...
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname))); // Assumes index.html in "public" folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html')); // Directly sends index.html
});

app.listen(3000, () => console.log('Server listening on port 3000'));


const rapidApiKey = '6f370459a0mshe5afcd3f5b0dab5p16b2a4jsn1d89511e7170';
const telegramBotToken = '6937493164:AAHDUq85dMKZrZoL25Bb-_9PpSF-rbY9f9I';

const bot = new TelegramBot(telegramBotToken, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.toLowerCase() === '/start') {
    // Send a welcome message
    bot.sendMessage(chatId, '*Welcome to the NodeRythm* \n Send either the song title or lyrics. \n Wants a demo click /demo' , { parse_mode: 'Markdown' });
    return;
  }
  if (msg.text.toLowerCase() === '/demo') {
    // Send a welcome message
  bot.sendPhoto(chatId,'https://i.postimg.cc/HsDnYk04/IMG-20231221-194444.jpg' );
    return;
  }
  const searchQuery = msg.text;

  try {
    const videoId = await getVideoId(searchQuery);

    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);

    const fileSizeInMB = (response.data.filesize / (1024 * 1024)).toFixed(2);
    const durationMinutes = Math.floor(response.data.duration / 60);
    const durationSeconds = (response.data.duration % 60).toFixed(2);

      const replyMessage = `Title: ${response.data.title}\nFilesize: ${fileSizeInMB} MB\nDuration: ${durationMinutes} minutes ${durationSeconds} seconds\nDownload: ${response.data.link}`;

    bot.sendMessage(chatId, replyMessage);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error processing your request. Please try again.');
  }
});

// Function to search YouTube and get video ID
async function getVideoId(searchQuery) {
  return new Promise((resolve, reject) => {
    search(searchQuery, function (err, r) {
      if (err) {
        reject(err);
      } else {
        const videoId = r.videos[0].videoId;
        resolve(videoId);
      }
    });
  });
}
