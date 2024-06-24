const express = require("express");
const router = express.Router();

// include file semua file routes
const lombaRoutes = require("./lomba.routes");
const usersRoutes = require("./users.routes");
const kategoriRoutes = require("./kategori.routes");
const pendaftaranRoutes = require("./pendaftaran.routes");

// header route
router.use("/lomba", lombaRoutes);
router.use("/users", usersRoutes);
router.use("/kategori", kategoriRoutes);
router.use("/pendaftaran", pendaftaranRoutes);

module.exports = router;
