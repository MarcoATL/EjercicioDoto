const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
const MELI_API_URL = 'https://api.mercadolibre.com/sites/MLM/search?q=celular&limit=50&sort=price_asc';

async function fetchItems(offset) {
    const response = await axios.get(`${MELI_API_URL}&offset=${offset}`);
    return response.data.results;
}

app.get('/top-1000-lowest-price', async (req, res) => {
  try {
    let allItems = [];

    for (let offset = 0; offset < 1000; offset += 50) {
        const items = await fetchItems(offset);
        allItems = allItems.concat(items);
    }

    console.log(`Total items fetched: ${allItems.length}`);

    const formattedItems = allItems.map(item => {
        console.log('Seller Address:', item.seller_address);
        console.log('Shipping:', item.shipping);
        const sellerId = item.seller.id;
        const sellerName = item.seller.nickname;
        const condition = item.condition;
        const sellerLocation = item.seller_address?.city?.name || 'Unknown';
        const brand = item.attributes.find(attr => attr.id === 'BRAND')?.value_name || 'N/A';
        const shipping = item.shipping.free_shipping;
        const logisticsType = item.shipping?.logistic_type || 'Unknown';
        const price = `${item.price} MXN`;

        return {
            seller_id: sellerId,
            seller_name: sellerName,
            brand: brand,
            free_shipping: shipping,
            logistics_type: logisticsType,
            seller_location: sellerLocation,
            condition: condition,
            price_range: price,
        };
    });

    res.json({
        total_results: formattedItems.length,
        items: formattedItems,
    });

  } catch (error) {
    console.error('Error fetching data from Mercado Libre API:', error.message);
    res.status(500).send(`Error fetching data: ${error.message}`);
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
