module.exports = (sequelize, Sequelize) => {
  const Pendaftaran = sequelize.define("Pendaftaran", {
    id_lomba: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    id_users: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    signed_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'Pendaftaran',
    timestamps: false
  });

  // Creating a new Pendaftaran
  Pendaftaran.createPendaftaran = async (newPendaftaran) => {
    try {
      const createdPendaftaran = await Pendaftaran.create(newPendaftaran);
      console.log("Created Pendaftaran:", createdPendaftaran);
      return createdPendaftaran;
    } catch (error) {
      console.error("Error creating Pendaftaran:", error);
      throw error;
    }
  };

  // Finding a Pendaftaran by ID
  Pendaftaran.findById = async (lombaId, usersId) => {
    try {
      const Pendaftaran = await Pendaftaran.findOne({
        where: { id_lomba: lombaId, id_users: usersId }
      });
      if (Pendaftaran) {
        console.log("Found Pendaftaran:", Pendaftaran);
        return Pendaftaran;
      } else {
        console.log(`Pendaftaran with Lomba ID ${lombaId} and User ID ${usersId} not found`);
        return null;
      }
    } catch (error) {
      console.error("Error finding Pendaftaran:", error);
      throw error;
    }
  };

  // Deleting a Pendaftaran by IDs
  Pendaftaran.remove = async (lombaId, usersId) => {
    try {
      const deletedRows = await Pendaftaran.destroy({
        where: { id_lomba: lombaId, id_users: usersId }
      });
      if (deletedRows === 0) {
        console.log(`Pendaftaran with Lomba ID ${lombaId} and User ID ${usersId} not found`);
        return null;
      } else {
        console.log("Deleted Pendaftaran:", { id_lomba: lombaId, id_users: usersId });
        return deletedRows;
      }
    } catch (error) {
      console.error("Error deleting Pendaftaran:", error);
      throw error;
    }
  };

  return Pendaftaran;
};
