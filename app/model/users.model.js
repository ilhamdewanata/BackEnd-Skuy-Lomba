module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id_users: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(255)
    },
    username: {
      type: Sequelize.STRING(50)
    },
    password: {
      type: Sequelize.STRING(255)
    },
    nama_lengkap: {
      type: Sequelize.STRING(100)
    },
    jenis_kelamin: {
      type: Sequelize.CHAR(1)
    },
    nomor_telepon: {
      type: Sequelize.STRING(15)
    },
    alamat: {
      type: Sequelize.STRING(2083)
    },
    tanggal_lahir: {
      type: Sequelize.STRING(80)
    },
    id_role: {
      type: Sequelize.INTEGER
    }
  }, {
    tableName: 'Users',
    timestamps: false
  });

  // Creating a new User
  User.createUser = async (newUser) => {
    try {
      const createdUser = await User.create(newUser);
      console.log("Created User:", createdUser);
      return createdUser;
    } catch (error) {
      console.error("Error creating User:", error);
      throw error;
    }
  };

  // Finding a User by ID
  User.findById = async (userId) => {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        console.log("Found User:", user);
        return user;
      } else {
        console.log(`User with ID ${userId} not found`);
        return null;
      }
    } catch (error) {
      console.error("Error finding User:", error);
      throw error;
    }
  };

  // Finding all Users
  User.getAll = async () => {
    try {
      const userList = await User.findAll();
      console.log("Users:", userList);
      return userList;
    } catch (error) {
      console.error("Error finding all Users:", error);
      throw error;
    }
  };

  // Updating a User by ID
  User.updateById = async (id, updatedUser) => {
    try {
      const [affectedRows] = await User.update(updatedUser, {
        where: { id_users: id }
      });
      if (affectedRows === 0) {
        console.log(`User with ID ${id} not found`);
        return null;
      } else {
        console.log("Updated User:", { id, ...updatedUser });
        return { id, ...updatedUser };
      }
    } catch (error) {
      console.error("Error updating User:", error);
      throw error;
    }
  };

  // Deleting a User by ID
  User.remove = async (id) => {
    try {
      const deletedRows = await User.destroy({
        where: { id_users: id }
      });
      if (deletedRows === 0) {
        console.log(`User with ID ${id} not found`);
        return null;
      } else {
        console.log("Deleted User with ID:", id);
        return deletedRows;
      }
    } catch (error) {
      console.error("Error deleting User:", error);
      throw error;
    }
  };

  return User;
};
