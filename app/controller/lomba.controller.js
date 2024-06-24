const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const db = require("../model/db");
const { v4: uuidv4 } = require('uuid');
const Lomba = db.lomba;
const User = db.users;
const Pendaftaran = db.pendaftaran;
require('dotenv').config();

// Create a new Lomba
async function create(req, res) {

  if (
    !req.body.nama_lomba ||
    !req.body.tanggal_akhir ||
    !req.body.penyelenggara_lomba ||
    !req.body.link_pendaftaran_lomba ||
    !req.body.link_narahubung ||
    !req.body.tingkat_perlombaan ||
    !req.body.biaya_pendaftaran ||
    !req.body.id_kategori ||
    !req.body.survei
  ) return res.status(400).send({ message: "Harap isi semua field terlebih dahulu" });

  try {
    const lomba = {
      nama_lomba: req.body.nama_lomba,
      tanggal_akhir: req.body.tanggal_akhir,
      penyelenggara_lomba: req.body.penyelenggara_lomba,
      link_pendaftaran_lomba: req.body.link_pendaftaran_lomba,
      link_narahubung: req.body.link_narahubung,
      tingkat_perlombaan: req.body.tingkat_perlombaan,
      biaya_pendaftaran: req.body.biaya_pendaftaran,
      id_user: req.body.id_user,
      id_kategori: req.body.id_kategori,
      image_lomba: req.body.image_lomba ?? '',
      survei: req.body.survei,
    };

    const newLomba = {
      id_lomba: uuidv4(),
      nama_lomba: String(lomba.nama_lomba),
      tanggal_akhir: new Date(lomba.tanggal_akhir),
      penyelenggara_lomba: String(lomba.penyelenggara_lomba),
      link_pendaftaran_lomba: String(lomba.link_pendaftaran_lomba),
      link_narahubung: String(lomba.link_narahubung),
      id_kategori: String(lomba.id_kategori),
      survei: String(lomba.survei),
      tingkat_perlombaan: String(lomba.tingkat_perlombaan),
      biaya_pendaftaran: parseInt(lomba.biaya_pendaftaran, 10),
      // image_lomba: image_lomba_url,
      image_lomba: lomba.image_lomba,
      id_users: lomba.id_user,
      views: 0,
      is_active: 1,
    };

    const createdLomba = await Lomba.create(newLomba);
    res.status(201).send(createdLomba);
  } catch (error) {
    console.log(error);
    console.error("Error creating Lomba:", error.message);
    res.status(500).send({ message: "Some error occurred while creating Lomba." });
  };
}

// Update an existing Lomba
async function update(req, res) {
  const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).send({ message: "Error parsing form data." });
    }

    try {
      const {
        nama_lomba,
        tanggal_akhir,
        penyelenggara_lomba,
        link_pendaftaran_lomba,
        link_narahubung,
        tingkat_perlombaan,
        biaya_pendaftaran
      } = fields;

      const tanggalAkhir = new Date(tanggal_akhir);
      const userId = req.params.userId;
      const lombaId = req.params.lombaId;

      if (!nama_lomba || isNaN(tanggalAkhir) || !userId || !lombaId ||
        !penyelenggara_lomba || !link_pendaftaran_lomba ||
        !link_narahubung || !tingkat_perlombaan) {
        return res.status(400).send({ message: "All fields are required!" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: `User with ID ${userId} not found` });
      }

      const lomba = await Lomba.findById(lombaId);
      if (!lomba) {
        return res.status(404).send({ message: `Lomba with ID ${lombaId} not found` });
      }

      let image_lomba_url = lomba.image_lomba;
      if (files.image_lomba) {
        let file;
        if (Array.isArray(files.image_lomba)) {
          file = files.image_lomba[0];
        } else {
          file = files.image_lomba;
        }

        const timestamp = Date.now();
        const oldPath = file.filepath;
        const fileExt = path.extname(file.originalFilename);
        const newFileName = `${timestamp}${fileExt}`;
        const newPath = path.join(__dirname, '../../public/image', newFileName);

        // Copy the file and then delete the old file
        fs.copyFileSync(oldPath, newPath);
        fs.unlinkSync(oldPath);

        image_lomba_url = `${process.env.BASE_URL}/image/${newFileName}`;

        // Delete old image file if it exists
        const oldImagePath = path.join(__dirname, '../../public', lomba.image_lomba.replace(process.env.BASE_URL, ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const updatedLomba = {
        nama_lomba: String(nama_lomba),
        tanggal_akhir: tanggalAkhir,
        penyelenggara_lomba: String(penyelenggara_lomba),
        link_pendaftaran_lomba: String(link_pendaftaran_lomba),
        link_narahubung: String(link_narahubung),
        tingkat_perlombaan: String(tingkat_perlombaan),
        biaya_pendaftaran: parseInt(biaya_pendaftaran, 10),
        image_lomba: image_lomba_url,
        id_users: userId,
        is_active: fields.is_active === 'true' ? true : fields.is_active === 'false' ? false : lomba.is_active,
      };

      const updatedLombaData = await Lomba.findByIdAndUpdate(lombaId, updatedLomba, { new: true });
      res.status(200).send(updatedLombaData);
    } catch (error) {
      console.error("Error updating Lomba:", error);
      res.status(500).send({ message: "Some error occurred while updating Lomba." });
    }
  });
}

// Toggle the is_active status of a Lomba
async function toggleIsActive(req, res) {
  try {
    const lombaId = req.params.lombaId;

    if (!lombaId) {
      return res.status(400).send({ message: "User ID and Lomba ID are required!" });
    }

    const lomba = await Lomba.findByPk(lombaId);
    if (!lomba) {
      return res.status(404).send({ message: `Lomba with ID ${lombaId} not found` });
    }

    const newIsActiveStatus = !lomba.is_active;

    lomba.is_active = newIsActiveStatus;
    await lomba.save();

    res.status(200).send({ message: `Lomba is_active status updated to ${newIsActiveStatus}` });
  } catch (error) {
    console.error("Error toggling is_active status:", error);
    res.status(500).send({ message: "Some error occurred while toggling is_active status." });
  }
}

// Retrieve all Lomba
async function findAll(req, res) {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Lomba.findAndCountAll({
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
    console.error("Error finding all Lomba:", error);
    res.status(500).send({ message: "Some error occurred while retrieving lomba." });
  }
}


async function incrementViews(req, res) {
  try {
    const lombaId = req.params.lombaId;

    if (!lombaId) {
      return res.status(400).send({ message: "Lomba ID is required!" });
    }

    const lomba = await Lomba.findByPk(lombaId);
    if (!lomba) {
      return res.status(404).send({ message: `Lomba with ID ${lombaId} not found` });
    }

    lomba.views += 1;
    await lomba.save();

    res.status(200).send({ message: "Lomba views count incremented", views: lomba.views });
  } catch (error) {
    console.error("Error incrementing views count:", error);
    res.status(500).send({ message: error.message });
  }
}

// Retrieve a single Lomba by ID
async function findOne(req, res) {
  const { id } = req.params;
  try {
    const lomba = await Lomba.findByPk(id);
    const count = await Pendaftaran.count({
      where: { id_lomba: req.params.id }
    });
    if (!lomba) {
      return res.status(404).send({ message: `Lomba with ID ${id} not found` });
    }
    lomba.jumlah_pendaftar = count;
    res.send(lomba);
  } catch (error) {
    console.error("Error finding Lomba:", error);
    res.status(500).send({ message: "Some error occurred while finding Lomba." });
  }
}

// Delete a Lomba by ID
async function remove(req, res) {
  const { id } = req.params;
  try {
    const deletedRows = await Lomba.destroy({
      where: { id_lomba: id }
    });
    if (!deletedRows) {
      return res.status(404).send({ message: `Lomba with ID ${id} not found` });
    }
    res.send({ message: "Lomba was deleted successfully!" });
  } catch (error) {
    console.error("Error deleting Lomba:", error);
    res.status(500).send({ message: "Some error occurred while deleting Lomba." });
  }
}

module.exports = {
  findAll,
  create,
  findOne,
  update,
  remove,
  toggleIsActive,
  incrementViews,
};
