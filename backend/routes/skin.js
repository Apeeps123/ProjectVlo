const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db");
const fs = require("fs");
const multer = require("multer");
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

router.get("/", (req, res) => {
  connection.query(
    "SELECT a.id, a.skin, a.gambarSkin, a.nama , b.nama AS weaponName FROM skin a JOIN weapon b ON a.nama = b.nama",
    (err, rows) => {
      if (err) {
        console.error("Error retrieving skin data:", err);
        return res.status(500).json({ status: false, message: "Server Error" });
      }
      console.log("Skin data retrieved successfully");
      return res
        .status(200)
        .json({ status: true, message: "Data Skin", data: rows });
    }
  );
});

// Update your SQL query to include the weapon name
router.get("/detail/:nama", (req, res) => {
  connection.query(
    "SELECT a.id, a.skin, a.gambarSkin, a.nama , b.nama AS weaponName FROM skin a JOIN weapon b ON a.nama = b.nama WHERE a.nama = ?",
    [req.params.nama],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving skin data:", err);
        return res.status(500).json({ status: false, message: "Server Error" });
      }
      console.log("Skin data retrieved successfully");
      return res
        .status(200)
        .json({ status: true, message: "Data Skin", data: rows });
    }
  );
});

router.post(
  "/store",
  upload.single("gambarSkin"),
  [body("skin").notEmpty()],
  [body("nama").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { skin } = req.body;
    const { nama } = req.body;
    const gambarSkin = req.file ? req.file.filename : null;

    const data = {
      skin,
      nama,
      gambarSkin,
    };

    connection.query("INSERT INTO skin SET ?", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      return res.status(201).json({
        status: true,
        message: "Skin added successfully",
        data: rows[0],
      });
    });
  }
);

router.patch("/update/:id", upload.single("gambarSkin"), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { skin } = req.body;
  const { nama } = req.body;
  const gambarSkin = req.file ? req.file.filename : null;

  connection.query(`SELECT * FROM skin WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Skin not found",
      });
    }

    const gambarSkinLama = rows[0].gambarSkin;

    if (gambarSkinLama && gambarSkin) {
      const pathGambarSkinLama = path.join(
        __dirname,
        "../public/images",
        gambarSkinLama
      );
      fs.unlinkSync(pathGambarSkinLama);
    }

    const data = {
      skin,
      nama,
      gambarSkin: gambarSkin || gambarSkinLama,
    };

    connection.query(
      "UPDATE skin SET ? WHERE id = ?",
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
          message: "Skin updated successfully",
        });
      }
    );
  });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  connection.query(`SELECT * FROM skin WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Skin not found",
      });
    }

    const gambarSkinLama = rows[0].gambarSkin;

    if (gambarSkinLama) {
      const pathGambarSkinLama = path.join(
        __dirname,
        "../public/images",
        gambarSkinLama
      );
      fs.unlinkSync(pathGambarSkinLama);
    }

    connection.query("DELETE FROM skin WHERE id = ?", [id], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Skin  has been deleted",
      });
    });
  });
});

module.exports = router;
