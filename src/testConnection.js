import sequelize from "./config/database.js";

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
  } finally {
    await sequelize.close();
  }
};

testConnection();
