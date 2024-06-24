const db = require("../model/db"); // Assuming your Sequelize models are in the "../models" directory
const Pendaftaran = db.pendaftaran;
const Lomba = db.lomba;
const Users = db.users;
const Sequelize = require("sequelize");

// Create and Save new Pendaftaran entries
async function create(req, res) {
    try {
        // Validate request
        if (!req.body.id_lomba || !req.body.id_users) {
            res.status(400).send({ message: "id_lomba and id_users are required" });
            return;
        }

        const { id_lomba, id_users } = req.body;

        // Check if Lomba exists
        const lomba = await Lomba.findByPk(id_lomba);
        if (!lomba) {
            return res.status(404).send({ message: `Lomba with ID ${id_lomba} not found` });
        }

        // Check if User exists
        const user = await Users.findByPk(id_users);
        if (!user) {
            return res.status(404).send({ message: `User with ID ${id_users} not found` });
        }

        // Create Pendaftaran entries
        const pendaftaran = {
            id_lomba: id_lomba,
            id_users: id_users,
            signed_at: Sequelize.literal('CURRENT_TIMESTAMP')
        };

        // Save Pendaftaran in the database
        const createdEntry = await Pendaftaran.createPendaftaran(pendaftaran);

        res.send(createdEntry);
    } catch (error) {
        console.error("Error creating Pendaftaran:", error);
        res.status(500).send({ message: "Some error occurred while creating the Pendaftaran." });
    }
}

// Retrieve all pendaftaran
async function findByIdUser(req, res) {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const offset = (page - 1) * limit;

    try {
        const pendaftaran = await Pendaftaran.findAll({where: {id_users: req.params.id}});

        res.send(pendaftaran);
    } catch (error) {
        console.error("Error finding all pendaftaran:", error);
        res.status(500).send({ message: "Some error occurred while retrieving pendaftaran." });
    }
}

// Retrieve all pendaftaran
async function findByIdLomba(req, res) {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
    const offset = (page - 1) * limit;

    try {
        const pendaftaran = await Pendaftaran.findAll({where: {id_lomba: req.params.id}});

        res.send(pendaftaran);
    } catch (error) {
        console.error("Error finding all pendaftaran:", error);
        res.status(500).send({ message: "Some error occurred while retrieving pendaftaran." });
    }
}

// Retrieve the count of pendaftaran by id_lomba
async function countByIdLomba(req, res) {
    try {
        const count = await Pendaftaran.count({
            where: { id_lomba: req.params.id }
        });

        res.send({ count });
    } catch (error) {
        console.error("Error counting pendaftaran:", error);
        res.status(500).send({ message: "Some error occurred while counting pendaftaran." });
    }
}

module.exports = {
    create,
    findByIdUser,
    findByIdLomba,
    countByIdLomba
};
