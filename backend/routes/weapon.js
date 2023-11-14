const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db");
const fs = require("fs");
const multer = require("multer");
const authenticateToken = require("../routes/auth/middleware/authenticateToken");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Jenis file tidak diizinkan"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Mendapatkan semua data senjata

// "SELECT a.id, a.nama, a.bio, b.role AS role, b.icon AS icon, a.gambar FROM agent a JOIN roles b ON a.role = b.id",
router.get("/", authenticateToken, (req, res) => {
  connection.query("SELECT * from weapon", (err, rows) => {
    if (err) {
      console.error("Error retrieving weapon data:", err);
      return res.status(500).json({ status: false, message: "Server Error" });
    }
    console.log("Weapon data retrieved successfully");
    return res
      .status(200)
      .json({ status: true, message: "Data Weapon", data: rows });
  });
});

// Menambahkan senjata baru
router.post(
  "/store", authenticateToken,
  upload.single("gambarWpn"),
  [body("nama").notEmpty(), body("type").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { nama, type } = req.body;
    const gambarWpn = req.file ? req.file.filename : null;

    const data = {
      nama,
      type,
      gambarWpn,
    };

    connection.query("INSERT INTO weapon SET ?", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      return res.status(201).json({
        status: true,
        message: "Weapon added successfully",
        data: rows[0],
      });
    });
  }
);

router.patch("/update/:id", authenticateToken, upload.single("gambarWpn"), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { nama, type } = req.body;
  const gambarWpn = req.file ? req.file.filename : null;

  connection.query(`SELECT * FROM weapon WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Weapon not found",
      });
    }

    const gambarWpnLama = rows[0].gambarWpn;

    if (gambarWpnLama && gambarWpn) {
      const pathGambarWpnLama = path.join(
        __dirname,
        "../public/images",
        gambarWpnLama
      );
      fs.unlinkSync(pathGambarWpnLama);
    }

    const data = {
      nama,
      type,
      gambarWpn: gambarWpn || gambarWpnLama,
    };

    connection.query(
      "UPDATE weapon SET ? WHERE id = ?",
      [data, id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "Server Error",
          });
        }
        return res.status(200).json({
          status: true,
          message: "Weapon updated successfully",
        });
      }
    );
  });
});

// Menghapus data senjata berdasarkan ID
router.delete("/delete/:id", authenticateToken, (req, res) => {
  const id = req.params.id;

  connection.query(`SELECT * FROM weapon WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Weapon not found",
      });
    }

    const gambarWpnLama = rows[0].gambarWpn;

    if (gambarWpnLama) {
      const pathGambarWpnLama = path.join(
        __dirname,
        "../public/images",
        gambarWpnLama
      );
      fs.unlinkSync(pathGambarWpnLama);
    }

    connection.query("DELETE FROM weapon WHERE id = ?", [id], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Weapon deleted successfully",
      });
    });
  });
});

module.exports = router;
