import sequelize from "../config/database.js";
import User from "./User.js";
import Branch from "./Branch.js";
import Role from "./Role.js";
import Appointment from "./Appointment.js";

// Relación de Usuario con Role
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

// Relación de Usuario con Branch
Branch.hasMany(User, { foreignKey: "branchId" });
User.belongsTo(Branch, { foreignKey: "branchId" });

// Relación de Appointment con User y Branch
User.hasMany(Appointment, { foreignKey: "userId" });
Appointment.belongsTo(User, { foreignKey: "userId" });

Branch.hasMany(Appointment, { foreignKey: "branchId" });
Appointment.belongsTo(Branch, { foreignKey: "branchId" });


const syncDB = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

syncDB();

export { User, Branch, Role, Appointment};
