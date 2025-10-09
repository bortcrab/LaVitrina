const { sequelize } = require('./models'); // Asegúrate de que Categoria esté disponible

async function realizarTransacciones() {
  try {
    // Sincronizar los modelos con la base de datos
    await sequelize.sync();

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada.');
  }
}

realizarTransacciones();
