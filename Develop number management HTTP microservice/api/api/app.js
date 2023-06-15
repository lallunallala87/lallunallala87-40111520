const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  const validUrls = Array.isArray(urls) ? urls : [urls];

  try {
    const responses = await Promise.allSettled(validUrls.map(fetchNumbers));

    const numbers = responses
      .filter(response => response.status === 'fulfilled')
      .map(response => response.value)
      .reduce((merged, numbers) => merged.concat(numbers), [])
      .filter((number, index, array) => array.indexOf(number) === index)
      .sort((a, b) => a - b);

    res.json({ numbers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function fetchNumbers(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers;
  } catch (error) {
    return [];
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
