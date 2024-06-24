const db = require("../model/db");
const User = db.users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

// Sign Up
async function signUp(req, res) {
  try {
    // Validate request
    if (!req.body.email || !req.body.username || !req.body.password || !req.body.nama_lengkap || !req.body.jenis_kelamin || !req.body.nomor_telepon || !req.body.tanggal_lahir) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a User
    const user = {
      id_users: uuidv4(),
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      nama_lengkap: req.body.nama_lengkap,
      jenis_kelamin: req.body.jenis_kelamin,
      nomor_telepon: req.body.nomor_telepon,
      alamat: req.body.alamat,
      tanggal_lahir: req.body.tanggal_lahir,
      id_role: 1,
    };

    // Save User in the database
    const createdUser = await User.create(user);

    const { password: pass, ...rest } = createdUser.dataValues;
    res.send(rest);
  } catch (error) {
    console.error("Error creating User:", error);
    res.status(500).send({ message: "Some error occurred while creating the User." });
  }
}

// Login user
async function signIn(req, res) {
  try {
    // Validate request
    if (!req.body.email || !req.body.password) {
      res.status(400).send({ message: "Email and password are required!" });
      return;
    }

    // Find user by email
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      res.status(404).send({ message: "User not found!" });
      return;
    }

    const { password: pass, ...rest } = user.dataValues;

    // Check password
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      res.status(400).send({ message: "Invalid password!" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).cookie('access_token', token, {
      httpOnly: true
    }).json(rest);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ message: "Some error occurred while logging in." });
  }
}

// Login user
async function signOut(req, res) {
  try {
    return res.clearCookie('access_token').status(200).json({ message: 'Berhasil logout' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: "Some error occurred while logout." });
  }
}


// Retrieve all users
async function findAll(req, res) {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await User.findAndCountAll({
      offset: offset,
      limit: limit
    });

    res.send({
      data: rows,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      totalCount: count
    });
  } catch (error) {
    console.error("Error finding all pendaftaran:", error);
    res.status(500).send({ message: "Some error occurred while retrieving pendaftaran." });
  }
}

// Find a single User with an id
async function findOne(req, res) {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).send({ message: "Not found User with id " + id });
    } else {
      res.send(user);
    }
  } catch (error) {
    console.error("Error retrieving User:", error);
    res.status(500).send({ message: "Error retrieving User with id=" + id });
  }
}

module.exports = {
  findAll,
  signIn,
  signOut,
  signUp,
  findOne,
};
