import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const port = 3000;
const API_KEY = process.env.ESV_API_KEY;
const API_URL = 'https://api.esv.org/v3/passage/search/';

app.get('/', async (req, res) => {
  res.status(200).send({
      message: 'Hello from ESV-smile!',
  })
});

app.get('/api/esv/:passage', (req, res) => {
  const passage = req.params.passage;
  const params = new URLSearchParams({
    'q': passage
  }).toString();
  const options = {
    headers: {
      'Authorization': `Token ${API_KEY}`
    }
  };

  fetch(`${API_URL}?${params}`, options)
    .then(response => response.json())
    .then(data=> {
      const passages = data.results;
      if (passages != null) {
        const text = passages;
        res.send(text);
      } else {
        const text = 'Error: Passage not found';
        res.send(text);
      }
      // const text = passages[0]?.trim() || ;
      
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal server error');
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});