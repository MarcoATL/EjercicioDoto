const axios = require('axios');

axios.get('http://localhost:3000/top-1000-lowest-price')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
