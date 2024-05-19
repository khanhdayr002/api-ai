//Hey Thanks For Supporting Me Feel Free To fork - Sensui/Jean

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const Jimp = require('jimp');
const fs = require('fs');
const app = express();
const port = 3000;
const loremIpsum = require('lorem-ipsum').loremIpsum;
const { v4: uuidv4 } = require('uuid');
const Tesseract = require('tesseract.js');
const nodemailer = require('nodemailer');
const sharp = require('sharp');
const crypto = require('crypto');
const validUrl = require('valid-url');
const wordDefinition = require('word-definition');
const cheerio = require('cheerio');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const rp = require('request-promise');
const metadata = require('html-metadata');
const { promisify } = require('util');
const path = require('path');
const ytSearch = require('yt-search');
const PastebinAPI = require('pastebin-js');
const randomEmoji = require('random-emoji');
const tldr = require('tldr');
//const fetch = require('node-fetch');
const FormData = require('form-data');
const { PDFDocument, rgb } = require('pdf-lib');
const qrCode = require('qrcode');
const qrCodeReader = require('qrcode-reader');
const unscramble = require('unscramble');
const { generateCreditCard } = require('credit-card-info-generator');
const paraphrase = require('@jaycd598/paraphrase');
const xv = require('xvideos-scraper');
const uuid = require('uuid');
const UserAgent = require('fake-useragent');
const { createCanvas, loadImage } = require('canvas');
const cors = require('cors');




function deleteAllQRCodeImages() {
  const qrCodesDirectory = './qrcodes';

  fs.readdir(qrCodesDirectory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlinkSync(`${qrCodesDirectory}/${file}`);
    }
  });
}

async function readQRCode(imageURL) {
  try {
    const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const image = await Jimp.read(buffer);

    const qr = new qrCodeReader();
    const qrCodeContent = await new Promise((resolve, reject) => {
      qr.callback = (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.result);
        }
      };
      qr.decode(image.bitmap);
    });

    return qrCodeContent;
  } catch (error) {
    throw new Error('Failed to read the QR code.');
  }
      }

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('load'));
app.use(express.json()) 
//tell express to use the above api routes 

// Redirect /ApiDocumentationPage to home.html
app.get('/ApiDocumentationPage', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get('/ChatBot', (req, res) => {
  res.sendFile(__dirname + "/public/chatbot.html");
});



app.get('/api/fun/dogpic', async (req, res) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    const { message: picture } = response.data;

    res.json({ picture });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get a random dog fact
app.get('/api/fun/dogfact', async (req, res) => {
  try {
    const response = await axios.get('https://dogapi.dog/api/v1/facts');
    res.json( response.data );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/fun/catpic', async (req, res) => {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search');
    const [{ url: picture }] = response.data;

    res.json({ picture });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get a random cat fact
app.get('/api/fun/catfact', async (req, res) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    const { fact } = response.data;

    res.json({ fact });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.get('/api/tools/ai', (req, res) => {
  const question = req.query.question.toLowerCase(); // Convert question to lowercase

  if (!question) {
    return res.status(400).json({ error: 'Missing question parameter' });
  }

  let answer = '';

  // Check for specific queries and provide custom responses
  if (question.includes('who are you?')) {
    answer = "I'm a ChatBot Created By Sensui. Nice to meet you!";
  } else if (question.includes('who created you?')) {
    answer = "I was created by Sensui.";
  }
  else if (question.includes('who created you')) {
    answer = "I was created by Sensui.";
  }
  else if (question.includes('who are you')) {
    answer = "I'm a ChatBot Created By Sensui. Nice to meet you!";
  }

  // If a custom response was provided, send it
  if (answer !== '') {
    const data = {
      answer: answer
    };

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  }

  // Use your existing API to get AI response for other queries
  const apiUrl = `https://api.kenliejugarap.com/gptgo/?text=${encodeURIComponent(question)}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((json) => {
      answer = json.response;

      // Return the AI-generated answer
      const data = {
        answer: answer
      };

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error('Error fetching AI response:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});






let sessionId, cookies;
const mainCookie = 'Zgg1g9wr6mY1tX-1PMZZHfDW__0sBNk65BT8FqNFldT6ZIA0SS8lmbroxYoHzE5X9M742g.'; // Replace with your own cookie

class BardAI {
  constructor() {
    this.cookie = mainCookie;
    if (!this.cookie) throw new Error("Session Cookies are missing, Unable to login to an account!");
  }

  async login() {
    cookies = this.cookie;
    let headerParams = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Cookie": `__Secure-1PSID=${this.cookie};`
    };
    let instance = axios.create({
      withCredentials: true,
      baseURL: "https://bard.google.com/",
      headers: headerParams
    });

    try {
      let r = await instance.get();
      sessionId = r.data.match(/SNlM0e":"(.*?)"/g)[0].substr(8).replace(/\"/g, '');
    } catch (e) {
      throw new Error('Unable to login to your account. Please try using new cookies and try again.');
    }
  }
}

let imageFormat = (text, images) => {
  if (!images) return { message: text, imageUrls: [] };
  let formattedText = text.replace(/\[Image of.*?\]/g, '').trim();
  images.forEach(imageData => {
    imageData.tag = imageData.tag.replace(/\[Image of.*?\]/g, "").trim();
  });
  return { message: formattedText, imageUrls: images.map((image) => image.url) };
};

let startBard = async (message) => {
  if (!sessionId) throw new Error('Please initialize login first to use bardai.');
  let postParamsStructure = [
    [message],
    null,
    [],
  ];
  let postData = {
    "f.req": JSON.stringify([null, JSON.stringify(postParamsStructure)]),
    at: sessionId
  };
  let headerParams = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Cookie": `__Secure-1PSID=${cookies};`
  };

  try {
    let r = await axios({
      method: 'POST',
      url: 'https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20230711.08_p0&_reqID=0&rt=c',
      headers: headerParams,
      withCredentials: true,
      data: postData
    });
    let bardAIRes = JSON.parse(r.data.split("\n")[3])[0][2];
    if (!bardAIRes) throw new Error(`Bard AI encountered an error ${r.data}.`);
    let bardData = JSON.parse(bardAIRes);
    let bardAI = JSON.parse(bardAIRes)[4][0];
    let result = bardAI[1][0];
    let images = bardAI[4]?.map(e => {
      return {
        url: e[3][0][0],
        tag: e[2],
        source: {
          name: e[1][1],
          original: e[0][0][0],
          website: e[1][0][0],
          favicon: e[1][3]
        }
      };
    });
    return imageFormat(result, images);
  } catch (error) {
    throw new Error(`Bard AI encountered an error ${error.message}.`);
  }
};

app.get('/api/tools/bard', async (req, res) => {
  const { question } = req.query;
  try {
    const bard = new BardAI();
    await bard.login();
    
    let answer = '';

    // Custom responses for specific queries
    if (question.includes('who are you?')) {
      answer = "I'm a ChatBot Created By Sensui. Nice to meet you!";
    } else if (question.includes('who created you?')) {
      answer = "I was created by Sensui.";
    } else if (question.includes('who created you')) {
      answer = "I was created by Sensui.";
    } else if (question.includes('who are you')) {
      answer = "I'm a ChatBot Created By Sensui. Nice to meet you!";
    }

    if (answer !== '') {
      res.json({ message: answer, imageUrls: [] });
      return;
    }

    const response = await startBard(question);
    const { message, imageUrls } = response;
    res.json({ message, imageUrls });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

        


                                


async function getRandomJoke() {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    const jokeData = response.data;

    // Check if the API response contains a joke
    if (jokeData.type === 'single') {
      return {
        joke: jokeData.joke
      };
    } else if (jokeData.type === 'twopart') {
      return {
        setup: jokeData.setup,
        punchline: jokeData.delivery
      };
    } else {
      throw new Error('Invalid joke type');
    }
  } catch (error) {
    throw new Error('Failed to fetch joke');
  }
}

app.get('/api/fun/joke', async (req, res) => {
  try {
    const randomJoke = await getRandomJoke();
    res.json(randomJoke);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});


        app.get('/api/tools/weather/:city', async (req, res) => {
  const city = encodeURI(req.params.city); // Encode the city parameter

  try {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=2e496852627641b0a37123040212608&q=${city}&aqi=yes`);

    const weatherData = response.data;
    const { location, current } = weatherData;

    const weatherInfo = {
      city: location.name,
      region: location.region,
      country: location.country,
      latitude: location.lat,
      longitude: location.lon,
      timezone: location.tz_id,
      localtime: location.localtime,
      temperature: {
        celsius: current.temp_c,
        fahrenheit: current.temp_f
      },
      condition: {
        text: current.condition.text,
        icon: current.condition.icon,
        code: current.condition.code
      },
      wind: {
        speed_mph: current.wind_mph,
        speed_kph: current.wind_kph,
        degree: current.wind_degree,
        direction: current.wind_dir
      },
      pressure: {
        mb: current.pressure_mb,
        in: current.pressure_in
      },
      precipitation: {
        mm: current.precip_mm,
        inches: current.precip_in
      },
      humidity: current.humidity,
      cloudiness: current.cloud,
      feels_like: {
        celsius: current.feelslike_c,
        fahrenheit: current.feelslike_f
      },
      visibility: {
        km: current.vis_km,
        miles: current.vis_miles
      },
      uv_index: current.uv,
      gust: {
        mph: current.gust_mph,
        kph: current.gust_kph
      },
      air_quality: {
        co: current.air_quality.co,
        no2: current.air_quality.no2,
        o3: current.air_quality.o3,
        so2: current.air_quality.so2,
        pm2_5: current.air_quality.pm2_5,
        pm10: current.air_quality.pm10,
        us_epa_index: current.air_quality['us-epa-index'],
        gb_defra_index: current.air_quality['gb-defra-index']
      }
    };

    res.json(weatherInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});


// Route to fetch news headlines
app.get('/api/tools/news', async (req, res) => {
  try {
    // Make a GET request to the News API endpoint
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'ph', // Specify the country (e.g., 'us' for United States)
        apiKey: "4576eadf27fb44cea82a2e33af91aa1c"
      }
    });

    // Extract the headlines from the API response
    const headlines = response.data.articles.map(article => ({
      title: article.title,
      source: article.source.name
    }));

    res.json(headlines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch news headlines' });
  }
});

app.get('/api/tools/ce', async (req, res) => {
  try {
    const baseCurrency = req.query.base || 'USD'; // Default base currency is USD
    const targetCurrency = req.query.target || 'EUR'; // Default target currency is EUR
    const amount = parseFloat(req.query.amount) || 1; // Default amount is 1

    // Make a GET request to the Currency Exchange Rates API
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);

    // Extract the exchange rate for the target currency
    const exchangeRate = response.data.rates[targetCurrency];

    if (exchangeRate) {
      const convertedAmount = amount * exchangeRate;

      res.json({
        base: baseCurrency,
        target: targetCurrency,
        rate: exchangeRate,
        amount: amount,
        convertedAmount: convertedAmount
      });
    } else {
      res.status(400).json({ error: 'Invalid currency code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch currency exchange rates' });
  }
});


app.get('/api/tools/foodpic', async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      res.status(400).json({ error: 'Missing query parameter' });
      return;
    }

    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=d5df63f4194443b99c7c7fc933765f50&ingredients=${encodeURIComponent(query)}&number=1`;

    const response = await axios.get(url);

    const recipe = response.data[0];

    if (!recipe) {
      res.status(404).json({ error: 'No Food Picture found' });
      return;
    }

    res.json({
      title: recipe.title,
      image: recipe.image,
      sourceUrl: recipe.sourceUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

app.get('/api/tools/random-info', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const userResult = response.data.results[0];
    const user = {
      name: `${userResult.name.first} ${userResult.name.last}`,
      gender: userResult.gender,
      age: userResult.dob.age,
      email: userResult.email,
      phone: userResult.phone,
      cell: userResult.cell,
      address: {
        street: `${userResult.location.street.number} ${userResult.location.street.name}`,
        city: userResult.location.city,
        state: userResult.location.state,
        country: userResult.location.country,
        postcode: userResult.location.postcode,
      },
      nationality: userResult.nat,
      username: userResult.login.username,
      registered: userResult.registered.date,
      dob: userResult.dob.date,
      id: userResult.id.value,
      timezone: userResult.location.timezone.description,
      login: {
        uuid: userResult.login.uuid,
        username: userResult.login.username,
        password: userResult.login.password,
        salt: userResult.login.salt,
        md5: userResult.login.md5,
        sha1: userResult.login.sha1,
        sha256: userResult.login.sha256,
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});



// Endpoint for text to Morse code conversion
app.get('/api/tools/text-morsecode', (req, res) => {
  const text = req.query.text;
  const morseCode = convertTextToMorseCode(text);
  res.json({ morseCode });
});

// Endpoint for Morse code to text conversion
app.get('/api/tools/morsecode-text', (req, res) => {
  const morseCode = req.query.morsecode;
  const text = convertMorseCodeToText(morseCode);
  res.json({ text });
});

// Text to Morse code conversion function
function convertTextToMorseCode(text) {
  const MORSE_CODE_DICT = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '0': '-----',
  };

  const morseCode = text
    .split('')
    .map(char => {
      const upperChar = char.toUpperCase();
      return MORSE_CODE_DICT[upperChar] || '';
    })
    .join(' ');

  return morseCode;
}

// Morse code to text conversion function
function convertMorseCodeToText(morseCode) {
  const MORSE_CODE_DICT = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H',
    '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P',
    '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z',
    '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
    '---..': '8', '----.': '9', '-----': '0',
  };

  const text = morseCode
    .split(' ')
    .map(code => {
      return MORSE_CODE_DICT[code] || '';
    })
    .join('');

  return text;
}

app.get('/api/tools/country-guide', async (req, res) => {
  const countryName = req.query.name;

  try {
    const country = await getCountryByName(countryName);

    if (country) {
      res.json(country);
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get country by name
async function getCountryByName(name) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
    const countryData = response.data[0];

    if (countryData) {
      const country = {
        name: countryData.name.common,
        capital: countryData.capital?.[0] || 'N/A',
        population: countryData.population || 'N/A',
        language: Object.values(countryData.languages || {}).join(', ') || 'N/A',
      };

      return country;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch country data');
  }
}

    

app.get('/api/fun/quote', async (req, res) => {
  try {
    // Fetch a random quote from an external API
    const response = await axios.get('https://dummyjson.com/quotes/random');
    const quote = response.data.quote;
    const author = response.data.author;

    // Send the quote, author, and writtenOn as the API response
    res.json({
      quote,
      author
    });
  } catch (error) {
    // Handle error if the external API request fails
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

      app.get('/api/tools/ip', (req, res) => {
  const ip = req.ip;
  
  // You can customize the response JSON as needed


  // Auto-close the response by sending an empty response
  res.json({ ip });
});


app.get('/api/tools/lorem-ipsum', (req, res) => {
  const length = req.query.length;

  if (!length) {
    return res.status(400).json({ error: 'Please provide a length parameter.' });
  }

  const wordCount = getLoremIpsumWordCount();
  
  if (!Number.isInteger(Number(length)) || length <= 0) {
    return res.status(400).json({ error: 'Invalid length parameter.' });
  }
  
  const loremIpsumText = generateLoremIpsumText(length, wordCount);
  res.json({ loremIpsum: loremIpsumText });
});

function generateLoremIpsumText(length, wordCount) {
  const paragraphs = Math.ceil(length / wordCount);
  const options = {
    count: paragraphs,
    units: 'paragraphs',
  };

  return loremIpsum(options);
}

function getLoremIpsumWordCount() {
  const singleParagraph = loremIpsum({
    count: 1,
    units: 'paragraphs',
  });

  const wordCount = singleParagraph.split(' ').length;

  return wordCount;
}




          
app.get('/api/tools/ocr', async (req, res) => {
  const imageUrl = req.query.imageUrl;

  try {
    const result = await Tesseract.recognize(imageUrl, 'eng');
    const text = result.data.text;

    res.json({ text });
  } catch (error) {
    console.error('Error during OCR:', error);
    res.status(500).json({ error: 'OCR process failed' });
  }
});

app.get('/api/fun/beshie', (req, res) => {
  const { jeje } = req.query;
  
  if (!jeje) {
    return res.status(400).json({ error: 'Missing parameter' });
  }
  
  const result = jeje.replace(/ /g, ' 🤸 ');
  
  return res.json({ result });
});

app.get('/api/tools/send-email', (req, res) => {
  const { to, subject, text } = req.query;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Replace the placeholders with your Gmail credentials
  const gmailEmail = 'codersensui@gmail.com';
  const gmailPassword = 'otgcckupkprrcyyg';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });

  const mailOptions = {
    from: gmailEmail,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while sending the email' });
    }

    console.log('Email sent:', info.response);
    return res.json({ message: 'Email sent successfully' });
  });
});

app.get('/api/tools/translate', async (req, res) => {
  const { msg, to } = req.query;
  const translationUrl = `https://api.crypto-twilight.com/translate/?msg=${encodeURIComponent(msg)}&to=${encodeURIComponent(to)}`;

  try {
    const response = await axios.get(translationUrl);
    const translationContent = response.data;

    res.json({ translation: translationContent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/fun/facts', async (req, res) => {
  try {
    const response = await axios.get('https://useless-facts.sameerkumar.website/api');
    const fact = response.data.data;

    res.json({ fact });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/fun/advice', async (req, res) => {
  try {
    const response = await axios.get('https://api.adviceslip.com/advice');
    const { advice } = response.data.slip;
    res.json({ advice });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch advice' });
  }
});




app.get('/api/fun/texoji', (req, res) => {
  const { emoji, text } = req.query;

  if (!emoji || !text) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const textresult = text.replace(/\s/g, ` ${emoji} `);

  res.json({ textresult });
});

app.get('/api/fun/age', async (req, res) => {
  const name = req.query.name;
  try {
    const response = await axios.get(`https://api.agify.io/?name=${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Agify API' });
  }
});

// Endpoint for The Bored API
app.get('/api/fun/bored', async (req, res) => {
  try {
    const response = await axios.get('https://www.boredapi.com/api/activity');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from The Bored API' });
  }
});

app.get('/api/tools/lorem-picsum', async (req, res) => {
  try {
    const response = await axios.get('https://picsum.photos/200/300');
    const imageUrl = response.request.res.responseUrl;

    const data = {
      imageUrl,
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

app.get('/api/tools/image-compression', async (req, res) => {
  const imageUrl = req.query.url;
  const options = {
    width: 800,
    height: 600,
    quality: 50,
    progressive: true,
    chromaSubsampling: '4:2:0',
    trellisQuantisation: true,
    quantisationTable: 2
  };

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const compressedImage = await sharp(response.data)
      .resize(options.width, options.height)
      .jpeg({
        quality: options.quality,
        progressive: options.progressive,
        chromaSubsampling: options.chromaSubsampling,
        trellisQuantisation: options.trellisQuantisation,
        quantisationTable: options.quantisationTable
      })
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(compressedImage);
  } catch (error) {
    res.status(500).json({ error: 'Image compression failed' });
  }
});

app.get('/api/tools/passgen', (req, res) => {
  const length = parseInt(req.query.length) || 10;
  const includeNumbers = req.query.includeNumbers === 'true';
  const includeSymbols = req.query.includeSymbols === 'true';

  const password = generatePassword(length, includeNumbers, includeSymbols);
  res.json({ password });
});

// Function to generate a random password
function generatePassword(length, includeNumbers, includeSymbols) {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) characters += '0123456789';
  if (includeSymbols) characters += '!@#$%^&*()-=_+';

  const password = [];
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charactersLength);
    password.push(characters.charAt(randomIndex));
  }

  return password.join('');
}
        
app.get('/api/tools/dictionary', async (req, res) => {
  try {
    const { word } = req.query;

    // Fetch dictionary data for the specified word
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const { phonetics, meanings } = response.data[0];
    const phonetic = phonetics[0].text;
    const definition = meanings[0].definitions[0].definition;
    const example = meanings[0].definitions[0].example;

    // Generate a random image related to the word using Unsplash API
    const image = `https://source.unsplash.com/random/?${word}`;

    res.json({ word, phonetic, definition, example, image });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred Maybe There Is No Definition Found On Your Word Query' });
  }
});

app.get('/api/tools/ytsearch', async (req, res) => {
  const { title } = req.query;
  
  try {
    const result = await ytSearch(title);
    const videos = result.videos.slice(0, 1);
    const videoData = videos.map((video) => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
    }));
    
    res.json({ videos: videoData});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


                          

app.get('/api/tools/ytdlmp4', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'lowest' });

    if (!videoFormat) {
      return res.status(400).json({ error: 'No video format available for the provided URL' });
    }

    res.redirect(videoFormat.url);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
  




app.get('/api/fun/autobanfb', (req, res) => {
    let image = "https://i.ibb.co/QbxjBwb/20230712-031618.jpg"
    res.json({ image });
});


app.get('/api/tools/ss', async (req, res) => {
  const { url } = req.query;
axios.get("https://image.thum.io/get/"+url+"", {
  responseType: 'arraybuffer'
 })
 .then((ress) => {
  const imageBuffer = Buffer.from(ress.data, 'binary');
  res.set('Content-Type', 'image/jpeg');
  res.send(imageBuffer);
 })
 .catch((err) => {
  console.error(error);
  res.status(500).json({
   error: 'Failed to fetch ss'
  });
 });
});



app.get('/api/tools/binary-text', (req, res) => {
  const { binary } = req.query;
  if (!binary) {
    return res.status(400).json({ error: 'Missing required parameter: binary' });
  }
  const text = binaryToText(binary);
  res.json({ text });
});

// Endpoint to convert text to binary
app.get('/api/tools/text-binary', (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: 'Missing required parameter: text' });
  }
  const binary = textToBinary(text);
  res.json({ binary });
});

// Helper function to convert binary to text
function binaryToText(binary) {
  const binaryArray = binary.split(' ');
  const textArray = binaryArray.map((binaryChar) => String.fromCharCode(parseInt(binaryChar, 2)));
  return textArray.join('');
}

// Helper function to convert text to binary
function textToBinary(text) {
  return text.split('').map((char) => char.charCodeAt(0).toString(2)).join(' ');
             }

app.get('/api/tools/nekobin', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://nekobin.com/api/documents', {
      content: code
    });

    const documentId = response.data.result.key;
    const nekobinURL = `https://nekobin.com/${documentId}`;
    res.json({ success: true, url: nekobinURL });
  } catch (error) {
    res.json({ success: false, message: 'Failed to create Nekobin.' });
  }
});

const pastes = {};

app.get('/api/tools/paste', (req, res) => {
  const content = req.query.text;

  if (content) {
    const pasteId = uuidv4();
    const pasteUrl = `https://sensui-useless-apis.codersensui.repl.co/api/tools/pastes/${pasteId}`;

    pastes[pasteId] = content;

    res.json({ success: true, url: pasteUrl });
  } else {
    res.status(400).json({ success: false, message: 'No text provided' });
  }
});

app.get('/api/tools/pastes/:pasteId', (req, res) => {
  const pasteId = req.params.pasteId;
  const content = pastes[pasteId];

  if (content) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } else {
    res.status(404).json({ success: false, message: 'Paste not found or Server Has Been Restarted And The Paste Has Been Deleted' });
  }
});

const pastebin = new PastebinAPI({
  api_dev_key: 'aeGtA7rxefvTnR3AKmYwG-jxMo598whT'
});

app.get('/api/tools/pastebin', async (req, res) => {
  const content = req.query.text;

  try {
    const response = await pastebin.createPaste(content, 'Untitled', null, 0);

    // Extract the paste ID from the response
    const pasteId = response.split('/').pop();
    const rawUrl = `https://pastebin.com/raw/${pasteId}`;

    res.json({ success: true, url: rawUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating paste' });
  }
});


app.get('/api/tools/grammar', async (req, res) => {
  const text = req.query.text;

  try {
    const response = await axios.post('https://languagetool.org/api/v2/check', null, {
      params: {
        language: 'en-US',
        text: text
      }
    });

    const corrections = response.data.matches.map(match => ({
      message: match.message,
      replacements: match.replacements,
      offset: match.offset,
      length: match.length
    }));

    const correctedText = applyCorrections(text, corrections);

    res.json({ success: true, corrections, correctedText });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking grammar' });
  }
});

function applyCorrections(text, corrections) {
  let correctedText = text;
  let offset = 0;

  for (const correction of corrections) {
    const { offset: correctionOffset, length, replacements } = correction;
    const start = correctionOffset + offset;
    const end = start + length;
    const replacement = replacements.length > 0 ? replacements[0].value : '';

    correctedText = correctedText.substring(0, start) + replacement + correctedText.substring(end);
    offset += replacement.length - length;
  }

  return correctedText;
}


              
app.get('/api/tools/lyrics', (req, res) => {
  const { artist } = req.query;
  const { song } = req.query;
  if (!song) {
    return res.status(400).json({ error: 'Missing required parameter: song' });
  }
  if (song && !artist){
    axios.get(`https://lyrist.vercel.app/api/${song}/`).then(ly => {
    res.json({ lyrics: ly.data.lyrics, title: ly.data.title, artist: ly.data.artist, image: ly.data.image }); 
  });
  }
  else {
    
axios.get(`https://lyrist.vercel.app/api/${song}/${artist}`).then(ly => {
    res.json({ lyrics: ly.data.lyrics, title: ly.data.title, artist: ly.data.artist, image: ly.data.image }); 
  });
  }
});

app.get('/api/fun/emoji', (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const emojiTranslation = text
    .split(' ')
    .map(() => {
      const emoji = randomEmoji.random({ count: 3 })[0].character;
      return emoji;
    })
    .join(' ');

  res.json({ my_reaction_rn: emojiTranslation });
});


app.get('/api/fun/wouldyourather', async (req, res) => {
  try {
    const response = await fetch('https://would-you-rather-api.abaanshanid.repl.co/');
    const data = await response.json();
    const question = data.data;

    res.json({ question });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/tools/biblerandom', async (req, res) => {
  try {
    // Fetch a random Bible verse
    const bibleResponse = await axios.get('https://labs.bible.org/api/?passage=random&type=json');
    const verse = bibleResponse.data[0];

    // Generate a random image related to the Bible using Unsplash API
    const imageUrl = "https://source.unsplash.com/random/?bible%20book%20of%20"+bibleResponse.data[0].bookname+"";

    res.json({ verse, imageUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/tools/bibledaily', async (req, res) => {
  try {
    // Fetch the daily Bible verse
    const bibleResponse = await axios.get('https://labs.bible.org/api/?passage=votd&type=json');
    const verse = bibleResponse.data[0];

    // Generate a random image related to the Bible using Unsplash API
    const imageUrl = "https://source.unsplash.com/random/?bible%20book%20of%20"+bibleResponse.data[0].bookname+"";

    res.json({ verse, imageUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.get('/api/fun/dare', async (req, res) => {
  try {
    const response = await axios.get('https://api.truthordarebot.xyz/v1/dare');

    // Extract the question and translations from the API response
    const { question, translations } = response.data;
    const { tl: tagalogTranslation } = translations;

    res.json({ question, tagalogTranslation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



app.get('/api/fun/truth', async (req, res) => {
  try {
    const response = await axios.get('https://api.truthordarebot.xyz/v1/truth');

    // Extract the question and translations from the API response
    const { question, translations } = response.data;
    const { tl: tagalogTranslation } = translations;

    res.json({ question, tagalogTranslation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/fun/paranoia', async (req, res) => {
  try {
    const response = await axios.get('https://api.truthordarebot.xyz/api/paranoia');

    // Extract the question and translations from the API response
    const { question, translations } = response.data;
    const { tl: tagalogTranslation } = translations;

    res.json({ question, tagalogTranslation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.get('/api/fun/neverhaveiever', async (req, res) => {
  try {
    const response = await axios.get('https://api.truthordarebot.xyz/api/nhie');

    // Extract the question and translations from the API response
    const { question, translations } = response.data;
    const { tl: tagalogTranslation } = translations;

    res.json({ question, tagalogTranslation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
      });
  
const wordapiKey = 'lalfirgfh1rsl6mfpxn3p3ox7vzl11go14qa90a39x3f1hdmf'; // Replace with your Wordnik API key

// Fetch definition, phonetics, examples, and audio for a word
app.get('/api/tools/dictionaryV2', async (req, res) => {
  try {
    const { word } = req.query;

    // Fetch word details from the Wordnik API
    const [definitionsResponse, phoneticsResponse, examplesResponse, audioResponse] = await Promise.all([
      axios.get(`https://api.wordnik.com/v4/word.json/${word}/definitions`, { params: { api_key: wordapiKey } }).catch(() => null),
      axios.get(`https://api.wordnik.com/v4/word.json/${word}/pronunciations`, { params: { api_key: wordapiKey } }).catch(() => null),
      axios.get(`https://api.wordnik.com/v4/word.json/${word}/examples`, { params: { api_key: wordapiKey } }).catch(() => null),
      axios.get(`https://api.wordnik.com/v4/word.json/${word}/audio`, { params: { api_key: wordapiKey, limit: 1 } }).catch(() => null)
    ]);

    // Extract definition text from the response or set it as an empty array if not found
    const definitions = definitionsResponse?.data ? definitionsResponse.data.map((definition) => definition.text) : [];

    // Extract phonetic notation from the response or set it as an empty array if not found
    const phonetics = phoneticsResponse?.data ? phoneticsResponse.data.map((phonetic) => phonetic.raw) : [];

    // Extract example sentences from the response or set it as an empty array if not found
    const examples = examplesResponse?.data ? examplesResponse.data.examples.map((example) => example.text) : [];

    // Extract audio URL from the response or set it as null if not found
    const audioUrl = audioResponse?.data && audioResponse.data.length > 0 ? audioResponse.data[0].fileUrl : null;

    // Create the JSON response object
    const jsonResponse = {
      word,
      definitions,
      phonetics,
      examples,
      audioUrl
    };

    res.json(jsonResponse);
  } catch (error) {
    console.error('Error fetching word details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
app.get('/api/tools/lorem-picsumV2', async (req, res) => {
  try {
    const response = await axios.get('https://random.imagecdn.app/v1/image', {
      params: {
        width: 500,
        height: 500,
        category: 'Vinyl',
        format: 'json'
      }
    });

    const imageUrl = response.data.url;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching random wallpaper:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


function replaceAlphabets(text) {
  const alphabets = {
    'a': '4',
    'b': '8',
    'c': '<',
    'd': '|)',
    'e': '3',
    'f': '|=',
    'g': '9',
    'h': '|-|',
    'i': '|',
    'j': '_|',
    'k': '|{',
    'l': '|_',
    'm': '|\/|',
    'n': '|\|',
    'o': '0',
    'p': '|2',
    'q': '0,',
    'r': '|2',
    's': '$',
    't': '7',
    'u': '|_|',
    'v': '\/',
    'w': '|/\|',
    'x': '><',
    'y': '¥',
    'z': '2',
    'A': '4',
    'B': '8',
    'C': '<',
    'D': '|)',
    'E': '3',
    'F': '|=',
    'G': '9',
    'H': '|-|',
    'I': '|',
    'J': '_|',
    'K': '|{',
    'L': '|_',
    'M': '|\/|',
    'N': '|\|',
    'O': '0',
    'P': '|2',
    'Q': '0,',
    'R': '|2',
    'S': '$',
    'T': '7',
    'U': '|_|',
    'V': '\/',
    'W': '|/\|',
    'X': '><',
    'Y': '¥',
    'Z': '2',
    'ñ': 'η',
    'Ñ': 'η',
  };

  let result = '';
  for (const char of text) {
    result += char in alphabets ? alphabets[char] : char;
  }
  return result;
}

function getRandomJejemonEmoji(previousEmoji) {
  const emojis = ['🤣', '😂', '😝', '😅', '🤪', '😜', '🤩', '😎', '😏', '🤔', '😬', '😁', '😊', '🤗', '😄', '🤭', '🙃', '😉', '😆', '🥰', '🤫', '🥳', '😀', '😃', '😺', '🤐', '🤨', '😻', '🤯', '😇', '🥺', '😍', '🙄', '😸', '🤤', '🧐', '😘', '😽', '🤑', '🤡', '😚', '😿', '😹', '🤓', '😛', '😼', '😸', '🥴', '😺'];

  let randomEmoji;
  do {
    randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  } while (randomEmoji === previousEmoji);

  return randomEmoji;
}

function addJejemonEmojis(text) {
  const words = text.trim().split(' ');
  let beshifiedWords = '';

  for (let i = 0; i < words.length; i++) {
    if (i > 0) {
      if (Math.random() < 0.5) {
        beshifiedWords += getRandomJejemonEmoji() + ' ';
      } else {
        beshifiedWords += getRandomJejemonEmoji() + ' ' + getRandomJejemonEmoji() + ' ';
      }
    }
    beshifiedWords += words[i];
    if (i < words.length - 1) {
      beshifiedWords += ' ';
    }
  }

  return beshifiedWords;
}

app.get('/api/fun/jejetext', (req, res) => {
  const text = req.query.convert || '';
  const beshifiedText = addJejemonEmojis(replaceAlphabets(text));
  res.json({ result: beshifiedText });
});
        
app.get('/api/tools/generateQR', async (req, res) => {
  const text = req.query.text || '';
  if (!text) {
    return res.status(400).json({ error: 'Text cannot be empty' });
  }

  try {
    const qrCodeFilePath = `./qrcodes/${Date.now()}.jpg`;
    await qrCode.toFile(qrCodeFilePath, text);
    res.json({ qrUrl: `https://sensui-useless-apis.codersensui.repl.co/api/tools/qrcodes/${qrCodeFilePath.split('/').pop()}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/api/tools/qrcodes/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(filename, { root: './qrcodes' });
});

app.get('/api/tools/readQR', async (req, res) => {
  const { photoLink } = req.query;

  try {
    const qrCodeContent = await readQRCode(photoLink);
    res.json({ qrContent: qrCodeContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tools/tiktokdl', async (req, res) => {
  const { url } = req.query;
  const apiUrl = `https://api.heckerman06.repl.co/api/download/tiktok?url=${encodeURIComponent(url)}&apikey=danielxd`;

  try {
    const response = await axios.get(apiUrl);
    const { result } = response.data;
    const { author, video } = result;
    const { nickname, unique_id: username, avatar: pfp } = author;
    const { no_watermark_hd: noWatermarkHd } = video;

    res.json({ nickname, username, pfp, noWatermarkHd });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.get('/api/fun/todo', async (req, res) => {
  try {
    const response = await fetch('https://dummyjson.com/todos/random');
    const todoData = await response.json();
    const todo = todoData.todo;
    res.json({ todo });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/api/tools/recipe', async (req, res) => {
  const food = req.query.food;

  try {
    // Fetch data from the provided API
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`);
    const meals = response.data.meals;

    // Extract relevant information from the response
    if (meals && meals.length > 0) {
      const meal = meals[0];
      const result = {
        foodname: meal.strMeal,
        foodcategory: meal.strCategory,
        foodinstructions: meal.strInstructions,
        foodingredients: [],
        foodpic: meal.strMealThumb,
      };

      // Collect ingredients
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
          result.foodingredients.push(`${measure} ${ingredient}`);
        }
      }

      res.json(result);
    } else {
      res.status(404).json({ error: 'No matching meal found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching meal information.' });
  }
});

const baseCache = path.join(__dirname, 'cache');


const imgTimestamp = {};

app.use('/polli', express.static(baseCache));

app.get('/api/tools/genpic', async (req, res) => {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required. ex generate?prompt=cat in table ' });
    }

    const baseUrl = `https://image.pollinations.ai/prompt/${prompt}`;
    const response = await axios.get(baseUrl, {
      responseType: 'arraybuffer',
    });
    const imgFilename = `${uuidv4()}.jpg`;
    const imgPath = path.join(baseCache, imgFilename);
    fs.writeFileSync(imgPath, response.data);
    imgTimestamp[imgFilename] = Date.now();
    const imageURL = `${req.protocol}://${req.get('host')}/polli/${imgFilename}`;

    // Clear timeout if the image is generated again within the time limit
    if (imgTimestamp[imgFilename] && imgTimestamp[imgFilename].timeout) {
      clearTimeout(imgTimestamp[imgFilename].timeout);
    }

    // Set timeout for image deletion after 5 minutes
    imgTimestamp[imgFilename] = {
      timestamp: Date.now(),
      timeout: setTimeout(() => {
        if (imgTimestamp[imgFilename]) {
          fs.unlink(imgPath, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Deleted: ${imgFilename}`);
            }
          });
          delete imgTimestamp[imgFilename];
        }
      }, 5 * 60 * 1000),
    };

    res.json({
      url: imageURL,
      message: 'Image will be deleted after 5 minutes!',
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'An error occurred.' });
  }
});
          
app.get('/api/tools/blackai', (req, res) => {
  const question = req.query.question;
  if (!question) {
      return res.status(400).json({ error: 'Question Is Required, Use question=' });
  }
      let answer = '';

    // Custom responses for specific queries
    if (question.includes('who are you?')) {
      answer = "I'm a ChatBot Created By Sensui. Nice to meet you!";
    } else if (question.includes('who created you?')) {
      answer = "I was created by Sensui.";
    } else if (question.includes('who created you')) {
      answer = "I was created by Sensui.";
    } else if (question.includes('who are you')) {
      answer = "I'm a ChatBot Created By Sensui. Nice to meet you!";
    }

    if (answer !== '') {
      res.json({ message: answer });
      return;
    }
  const url = 'https://useblackbox.io/chat-request-v4';
  const data = {
    textInput: question,
    allMessages: [{user: question}],
    stream: '',
    clickedContinue: false,
  };
  axios.post(url, data)
    .then(response => {
      const message = response.data.response[0][0];
      res.json({ message });
    })
    .catch(error => {
      res.status(500).json({ error: 'An error occurred.' });
    });
});

        app.get('/api/tools/unscramble', (req, res) => {
  const scrambledWord = req.query.word;

  if (!scrambledWord) {
    return res.status(400).json({ error: 'Missing word parameter' });
  }

  const Words = unscramble(scrambledWord);

  if (Words.length === 0) {
    res.status(404).json({ error: 'No unscrambled words found' });
  } else {
    res.json({ Words });
  }
}); 

app.get('/api/tools/ccgen', (req, res) => {
  const cardType = req.query.type;
  const quantity = parseInt(req.query.quantity) || 1;

  if (!cardType) {
    return res.status(400).json({ error: 'Missing card type parameter, Use ?type= Available Cards : Visa, Mastercard, American Express, Discover Card | Use &quantity=amount To Generate Based On The Quantity Amount' });
  }

  const supportedCardTypes = ['Visa', 'Mastercard', 'American Express', 'Discover Card'];

  if (!supportedCardTypes.includes(cardType)) {
    return res.status(400).json({ error: 'Invalid card type, Available Cards : Visa, Mastercard, American Express, Discover Card | Use &quantity=amount To Generate Based On The Quantity Amount' });
  }

  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be greater than or equal to 1' });
  }

  const CardDetails = Array.from({ length: quantity }, () => generateCreditCard(cardType));

  res.json({ CardDetails,
            message: 'Available Cards : Visa, Mastercard, American Express, Discover Card | Use &quantity=amount To Generate Based On The Quantity Amount' });
});

app.get('/api/tools/paraphrase', (req, res) => {
  const textToParaphrase = req.query.text;

  if (!textToParaphrase) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  try {
    const paraphrasedText = paraphrase(textToParaphrase);
    res.json({ Paraphrased: paraphrasedText });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while paraphrasing' });
  }
});

app.get('/api/tools/telegraphtupd', async (req, res) => {
  const textToUpload = req.query.text;

  try {
    // Create a form data object and append the text content
    const formData = new FormData();
    formData.append('file', textToUpload, 'text.txt');

    // Upload the text to Telegraph
    const telegraphResponse = await axios.post('https://telegra.ph/upload', formData, {
      headers: formData.getHeaders()
    });

    // Extract the text URL from the response
    const textUrl = telegraphResponse.data[0].src;

    res.json({ success: true, url: `https://telegra.ph${textUrl}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading text' });
  }
});

app.get('/api/tools/telegraphvupd', async (req, res) => {
  const videoUrl = req.query.vidurl;

  try {
    // Fetch the video data
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });

    // Create a form data object and append the video file
    const formData = new FormData();
    formData.append('file', videoResponse.data, 'video.mp4');

    // Upload the video to Telegraph
    const telegraphResponse = await axios.post('https://telegra.ph/upload', formData, {
      headers: formData.getHeaders()
    });

    // Extract the video URL from the response
    const videoUrl = telegraphResponse.data[0].src;

    res.json({ success: true, url: `https://telegra.ph${videoUrl}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading video' });
  }
});

app.get('/api/tools/telegraphpupd', async (req, res) => {
  const picUrl = req.query.picurl;

  try {
    // Fetch the image data
    const imageResponse = await axios.get(picUrl, { responseType: 'arraybuffer' });

    // Create a form data object and append the image file
    const formData = new FormData();
    formData.append('file', imageResponse.data, 'image.jpg');

    // Upload the image to Telegraph
    const telegraphResponse = await axios.post('https://telegra.ph/upload', formData, {
      headers: formData.getHeaders()
    });

    // Extract the photo URL from the response
    const photoUrl = telegraphResponse.data[0].src;

    res.json({ success: true, url: "https://telegra.ph"+photoUrl+"" });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading photo' });
  }
});

app.get('/api/tools/xhub', async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Missing search parameter' });
  }

  try {
    let searchResults = await xv.searchVideo({
      search: searchQuery,
      sort: 'relevance',
      filterDuration: '10min_more',
      filterQuality: 'sd',
      pagination: 1
    });

    if (searchResults.length === 0) {
      return res.json({ message: 'No search results found' });
    }

    let videoData = await xv.getVideoData({
      videoUrl: searchResults[0].video
    });

    const lowQualityContent = videoData.Low_Quality;

    res.json({ searchResults });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.get('/api/fun/nglspam', async (req, res) => {
  const { username, message, quantity } = req.query;

  if (!username || !message || !quantity) {
    return res.status(400).json({ error: 'Username, message, and quantity are required' });
  }

  const insta = username;
  const url = 'https://ngl.link/api/submit';
  const ques = message;
  const loopQuantity = parseInt(quantity, 10);

  if (isNaN(loopQuantity) || loopQuantity <= 0) {
    return res.status(400).json({ error: 'Invalid quantity value' });
  }

  try {
    const results = [];

    for (let i = 0; i < loopQuantity; i++) {
      const deviceid = require('uuid').v1();
      const payload = `username=${insta}&question=${ques}&deviceId=${deviceid}&gameSlug=&refferer=`;

      const headers = {
        'Referer': `https://ngl.link/${insta}`,
        'authority': 'ngl.link',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua': '"Brave";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
        'x-requested-with': 'XMLHttpRequest',
        // Add any other headers here
      };

      const send = await axios.get(url, { params: payload, headers });

      if (send.status === 200) {
        results.push('sent');
      } else {
        results.push('error');
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const user_agent = new UserAgent();
const shd = ['DDIM', 'K_EULER', 'PNDM', 'KLMS'];

const models = [
  {
    name: 'openjourney',
    version: '9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb',
    id: 'prompthero/openjourney',
  },
  {
    name: 'midjourney-diffusion',
    id: 'tstramer/midjourney-diffusion',
    version: '436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b',
  },
  {
    name: 'stable-diffusion',
    id: 'stability-ai/stable-diffusion',
    version: 'db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
  },
];

app.get('/api/tools/genimg', async (req, res) => {
  try {
    const {
      prompt,
      prompt_navigate,
      model = 'md', // Default to midjourney-diffusion
      potrait = false,
      scheduler = 0,
      sleep_timer = 2,
    } = req.query;

    let selectedModel;
    switch (model) {
      case 'oj':
        selectedModel = 'openjourney';
        break;
      case 'md':
        selectedModel = 'midjourney-diffusion';
        break;
      case 'sd':
        selectedModel = 'stable-diffusion';
        break;
      default:
        selectedModel = 'midjourney-diffusion'; // Default to midjourney-diffusion
    }

    const modelInfo = models.find((m) => m.name === selectedModel);
    if (!modelInfo) {
      return res.status(400).json({
        error: `No model found with the selected name ${selectedModel}`,
      });
    }

    const { version, id: mid } = modelInfo;

    const width = potrait ? 768 : 512;
    const height = potrait ? 1024 : 512;

    const url = `https://replicate.com/api/models/${mid}/versions/${version}/predictions`;
    const headers = {
      Origin: 'https://replicate.com',
      Referer: `https://replicate.com/${mid}`,
      'User-Agent': user_agent.random,
    };
    const data = {
      inputs: {
        width,
        height,
        prompt,
        scheduler: shd[scheduler],
        num_outputs: 1,
        guidance_scale: 7.5,
        prompt_strength: 0.8,
        num_inference_steps: 50,
        negative_prompt: prompt_navigate || '',
      },
    };

    const response1 = await axios.post(url, data, { headers });
    const uuid = response1.data.uuid;

    if (!uuid) {
      return res.status(400).json({
        error: response1.data,
      });
    }

    while (true) {
      const statusUrl = `https://replicate.com/api/models/${mid}/versions/${version}/predictions/${uuid}`;
      const response2 = await axios.get(statusUrl);
      const prediction = response2.data.prediction;
      const status = prediction.status;

      if (!status) {
        return res.status(400).json({
          error: response2.data,
          code: response2.status,
        });
      }

      if (status === 'succeeded') {
        return res.json({
          result: prediction.output,
        });
      }

      if (status === 'canceled' || status === 'failed') {
        return res.status(500).json({
          error: `Image generation process: ${status}`,
          code: response2.status,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, sleep_timer * 1000));
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.get('/api/fun/note', async (req, res) => {
  const text = req.query.put || 'Default Text';
  const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLTK4CitCBGbP6056jBlLiBx3D_I1q5NHLeQ&usqp=CAU';

  const image = await loadImage(imageUrl);
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  
  // Set font and color
  context.font = '15px Arial';
  context.fillStyle = 'black'; // Change text color to black
  
  // Calculate text position
  const textX = 50;
  const textY = image.height - 557; // Position a little lower
  
  // Draw the text on the image
  context.fillText(text, textX, textY);

  // Send the modified image as a response
  res.contentType('image/png');
  canvas.createPNGStream().pipe(res);
});

app.get('/api/tools/weatherV2', async (req, res) => {
    const location = req.query.loc; 
  
    try {
        
        const weatherResponse = await axios.get(`https://sensui-useless-apis.codersensui.repl.co/api/tools/weather/${location}`);
        const weatherData = weatherResponse.data;
        
        const conditionText = weatherData.condition.text.toLowerCase();
        
        
        const unsplashImageResponse = await axios.get(`https://source.unsplash.com/random/?${conditionText}`);
        const imageUrl = unsplashImageResponse.request.res.responseUrl;
        
        
        const image = await Jimp.read(imageUrl);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); 
        image.print(font, 10, 10, `Location: ${weatherData.city}, ${weatherData.region}, ${weatherData.country}`);
        image.print(font, 10, 50, `Weather Condition: ${weatherData.condition.text}`);
        image.print(font, 10, 90, `Temperature: ${weatherData.temperature.celsius}°C`);
        image.print(font, 10, 130, `Humidity: ${weatherData.humidity}%`);
        image.print(font, 10, 170, `Wind Speed: ${weatherData.wind.speed_kph} km/h`);
        image.print(font, 10, 210, `Pressure: ${weatherData.pressure.mb} mb`);
        image.print(font, 10, 250, `Precipitation: ${weatherData.precipitation.mm} mm`);
        
        const cleanedLocation = location.replace(/\s/g, '_'); 
        const imageFileName = `${cleanedLocation}_weather.jpg`; 
        const imagePath = path.join(__dirname, 'qrcodes', imageFileName);
        
        
        await image.writeAsync(imagePath);
        
        const imageLink = `https://sensui-useless-apis.codersensui.repl.co/api/tools/qrcodes/${imageFileName}`;
        
        
        res.json({ image: imageLink });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data or generating image.');
    }
});

app.get('/api/tools/img', async (req, res) => {
  try {
    const prompt = req.query.prompt || 'dog';
    const imageUrl = `https://source.unsplash.com/random/?${prompt}`;

    const response = await axios.get(imageUrl, {
      responseType: 'stream',
    });

    const imagePath = path.join(__dirname, 'qrcodes', 'image.jpg');
    const outputStream = fs.createWriteStream(imagePath);
    response.data.pipe(outputStream);

    outputStream.on('finish', () => {
      console.log('Image saved successfully!');
      res.redirect('/api/tools/img/show');
    });
  } catch (error) {
    console.error('Error fetching and saving image:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to show the saved image
app.get('/api/tools/img/show', (req, res) => {
  const imagePath = path.join(__dirname, 'qrcodes', 'image.jpg');
  res.sendFile(imagePath);
});

app.use((req, res, next) => {
    res.status(404).json({
        ok: false,
        message: "Invalid path requested not found, Api Documentation Page Here - https://sensui-useless-apis.codersensui.repl.co/ApiDocumentationPage"
    });
});


deleteAllQRCodeImages();


const figlet = require('figlet');
const kuler = require('kuler');

// Generate ASCII art
figlet('SENSUI', (err, data) => {
  if (err) {
    console.log('Something went wrong...');
    return;
  }
  //console.log(data); 
  console.log(kuler(data, '#008000'));

  // Successful message in red color
  const successMessage = ("Api is Working Smoothly!");
  console.log(kuler(successMessage, '#0000FF'));
  const space = ("• ━━━━━━━━━━━━━━━━━━━━━━━━ •");
  
console.log(kuler(space, '#FFFF00'));
  
  // Get the count of loaded npm packages in red color
  const loadedModulesCount = Object.keys(require.cache).length;
  const loadedModulesMessage = (`Loaded ${loadedModulesCount} Modules.`);
  console.log(kuler(loadedModulesMessage, '#FF0000'));
});
figlet('NICE', (err, data) => {
  if (err) {
    console.log('Something went wrong...');
    return;
  }
  //console.log(data); 
  console.log(kuler(data, '#008000'));
});

app.listen(port, () => {"Suiiiiiiii"});