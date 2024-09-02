const axios = require('axios');

const MELI_API_URL = 'https://api.mercadolibre.com/sites/MLM/search?q=celular&limit=1';

axios.get(MELI_API_URL)
  .then(response => {
    const results = response.data.results;

    if (results && results.length > 0) {
      const item = results[0];
      console.log('Estructura del primer item:');
      console.log(JSON.stringify(item, null, 2));
    } else {
      console.log('No se encontraron resultados.');
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  });
