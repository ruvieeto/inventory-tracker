// create a bunch of products
const products = [];
for (let i = 1; i < 11; i += 1) {
  const newProduct = {
    name: `Sample Product ${i}`,
    price: i * 10.0,
    currency: 'CAD', // limited to CAD, USD, EUR, GBP
  };
  products.push(newProduct);
}

module.exports = products;
