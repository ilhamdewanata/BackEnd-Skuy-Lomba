const db = require("../model/db");
const Kategori = db.kategori;
const { v4: uuidv4 } = require('uuid');

// Create and Save a new Kategori
async function create(req, res) {
  try {
    // Validate request
    if (!req.body.nama_kategori || !req.body.deskripsi) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }

    // Create a Kategori
    const kategori = {
      id_kategori: uuidv4(),
      nama_kategori: req.body.nama_kategori,
      deskripsi: req.body.deskripsi
    };

    // Save Kategori in the database
    const createdKategori = await Kategori.create(kategori);
    res.send(createdKategori);
  } catch (error) {
    console.error("Error creating Kategori:", error);
    res.status(500).send({ message: "Some error occurred while creating the Kategori." });
  }
}

// Retrieve all Kategori from the database.
async function findAll(req, res) {
  try {
    const kategoriList = await Kategori.findAll();
    res.send(kategoriList);
  } catch (error) {
    console.error("Error finding all Kategori:", error);
    res.status(500).send({ message: "Some error occurred while retrieving Kategori." });
  }
}

// Retrieve a single Lomba by ID
async function findOne(req, res) {
  const { id } = req.params;
  try {
    const kategori = await Kategori.findByPk(id);

    if (!kategori) {
      return res.status(404).send({ message: `Kategori with ID ${id} not found` });
    }

    res.send(kategori);
  } catch (error) {
    console.error("Error finding Kategori:", error);
    res.status(500).send({ message: "Some error occurred while finding Kategori." });
  }
}

// Delete a Kategori with the specified id in the request
async function remove(req, res) {
  try {
    const id = req.params.id;
    const result = await Kategori.destory(id);
    if (result === 1) {
      res.send({ message: "Kategori was deleted successfully!" });
    } else {
      res.send({ message: `Cannot delete Kategori with id=${id}. Maybe Kategori was not found!` });
    }
  } catch (error) {
    console.error("Error deleting Kategori:", error);
    res.status(500).send({ message: "Could not delete Kategori with id=" + id });
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  remove,
};
