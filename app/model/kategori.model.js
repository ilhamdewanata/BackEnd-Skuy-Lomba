module.exports = (sequelize, Sequelize) => {
    const Kategori = sequelize.define("Kategori", {
      id_kategori: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
      },
      nama_kategori: {
        type: Sequelize.STRING(50)
      },
      deskripsi: {
        type: Sequelize.TEXT
      }
    }, {
      tableName: 'Kategori',
      timestamps: false
    });
    return Kategori;
  };
  