module.exports = (sequelize, Sequelize) => {
  const Lomba = sequelize.define("Lomba", {
    id_lomba: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    id_users: {
      type: Sequelize.CHAR(36),
      allowNull: false
    },
    nama_lomba: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    tanggal_akhir: {
      type: Sequelize.DATE,
      allowNull: false
    },
    penyelenggara_lomba: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    link_pendaftaran_lomba: {
      type: Sequelize.STRING(2083),
      allowNull: false
    },
    link_narahubung: {
      type: Sequelize.STRING(2083),
      allowNull: false
    },
    id_kategori: {
      type: Sequelize.CHAR(36),
      allowNull: false
    },
    survei: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    tingkat_perlombaan: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    biaya_pendaftaran: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    image_lomba: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: Sequelize.TINYINT,
      defaultValue: 1
    }
  }, {
    tableName: 'Lomba',
    timestamps: false
  });

  // Finding a Lomba by ID
  Lomba.findById = async (lombaId) => {
    try {
      const lomba = await Lomba.findOne(lombaId);
      if (lomba) {
        console.log("Found Lomba:", lomba);
        return lomba;
      } else {
        console.log(`Lomba with ID ${lombaId} not found`);
        return null;
      }
    } catch (error) {
      console.error("Error finding Lomba:", error);
      throw error;
    }
  };

  // Finding all Lomba
  Lomba.getAll = async () => {
    try {
      const lombaList = await Lomba.findAll();
      console.log("Lomba:", lombaList);
      return lombaList;
    } catch (error) {
      console.error("Error finding all Lomba:", error);
      throw error;
    }
  };

  // Updating a Lomba by ID
  Lomba.updateById = async (id, updatedLomba) => {
    try {
      const [affectedRows] = await Lomba.update(updatedLomba, {
        where: { id_lomba: id }
      });
      if (affectedRows === 0) {
        console.log(`Lomba with ID ${id} not found`);
        return null;
      } else {
        console.log("Updated Lomba:", { id, ...updatedLomba });
        return { id, ...updatedLomba };
      }
    } catch (error) {
      console.error("Error updating Lomba:", error);
      throw error;
    }
  };

  return Lomba;
};
