import sequelize from "./config/database.js"; // Tu configuración de Sequelize
import Role from "./models/Role.js";
import Branch from "./models/Branch.js";

const seedDatabase = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Connection successful!");

    // Inserta roles predeterminados
    const roles = ["admin", "secretary", "student"];
    for (const role of roles) {
      await Role.findOrCreate({ where: { name: role } });
    }
    console.log("Roles seeded successfully!");

    // Inserta sucursales predeterminadas
    const branches = ["GomezPalacio", "Independencia", "Saltillo400", "Durango"];
    for (const branch of branches) {
      await Branch.findOrCreate({ where: { name: branch } });
    }
    console.log("Branches seeded successfully!");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
