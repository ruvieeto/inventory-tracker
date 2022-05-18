// create a bunch of random locations
const locations = [];
for (let i = 1; i < 11; i += 1) {
  const newLocation = {
    name: `Shopify Warehouse ${i}`,
    address_line_1: '150 Elgin Street',
    address_line_2: `Floor ${i}`,
    locality: 'Ottawa',
    region: 'ON',
    postcode: 'K2P 1L4',
    country: 'CA', // limited to CA, FR, GB, US
  };
  locations.push(newLocation);
}

module.exports = locations;
