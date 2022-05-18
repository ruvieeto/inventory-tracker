function applyExtraSetup(sequelize) {
  const { product, inventory, location, adjustment } = sequelize.models;

  product.hasMany(inventory, { foreignKey: { name: 'product_id', allowNull: false }, onDelete: 'CASCADE' });
  inventory.belongsTo(product, { foreignKey: { name: 'product_id', allowNull: false }, onDelete: 'CASCADE' });
  location.hasMany(inventory, { foreignKey: { name: 'location_id', allowNull: false }, onDelete: 'CASCADE' });
  inventory.belongsTo(location, { foreignKey: { name: 'location_id', allowNull: false }, onDelete: 'CASCADE' });
  inventory.hasMany(adjustment, { foreignKey: { name: 'inventory_id', allowNull: false }, onDelete: 'CASCADE' });
  adjustment.belongsTo(inventory, { foreignKey: { name: 'inventory_id', allowNull: false }, onDelete: 'CASCADE' });
}

module.exports = { applyExtraSetup };
