import sequelize from "./config/database.js"; // Ruta a tu configuración de Sequelize
import { User, Branch, Role } from "./models/index.js"; // Importa tus modelos

const syncDB = async () => {
  try {
    console.log("Connecting to the database...");

    // Prueba la conexión con la base de datos
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sincroniza los modelos con las tablas
    await sequelize.sync({ alter: true }); // Usa { force: true } solo para recrear tablas desde cero
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    // Cierra la conexión
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

syncDB();
