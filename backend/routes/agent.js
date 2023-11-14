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

router.get("/", authenticateToken, (req, res) => {
  connection.query(
    "SELECT a.id, a.nama, a.bio, b.role AS role, b.icon AS icon, a.gambar FROM agent a JOIN roles b ON a.role = b.id",
    (err, rows) => {
      if (err) {
        console.error("Error retrieving agent data:", err);
        return res.status(500).json({ status: false, message: "Server Error" });
      }
      console.log("Agent data retrieved successfully");
      return res
        .status(200)
        .json({ status: true, message: "Data Agent", data: rows });
    }
  );
});

router.post(
  "/store", authenticateToken,
  upload.fields([{ name: "gambar", maxCount: 1 }]),
  [body("nama").notEmpty(), body("role").notEmpty(), body("bio").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { nama, role, bio } = req.body;
    const gambar = req.files["gambar"][0].filename;

    const data = {
      nama,
      role,
      bio,
      gambar,
    };

    connection.query("INSERT INTO agent SET ?", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Success..!",
          data: rows[0],
        });
      }
    });
  }
);

router.patch(
  "/update/:id", authenticateToken,
  upload.fields([{ name: "gambar", maxCount: 1 }]),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { nama, role, bio } = req.body;
    const gambar = req.files["gambar"] ? req.files["gambar"][0].filename : null;

    connection.query(`SELECT * FROM agent WHERE id = ?`, [id], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      }

      const gambarLama = rows[0].gambar;

      if (gambarLama && gambar) {
        const pathGambarLama = path.join(
          __dirname,
          "../public/images",
          gambarLama
        );
        fs.unlinkSync(pathGambarLama);
      }

      const data = {
        nama,
        role,
        bio,
      };
      if (gambar) {
        data.gambar = gambar;
      }

      connection.query(
        "UPDATE agent SET ? WHERE id = ?",
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
            message: "Update Success..!",
          });
        }
      );
    });
  }
);

router.delete("/delete/:id", authenticateToken, (req, res) => {
  const id = req.params.id;

  connection.query(`SELECT * FROM agent WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Not Found",
      });
    }

    const gambarLama = rows[0].gambar;

    if (gambarLama) {
      const pathGambarLama = path.join(
        __dirname,
        "../public/images",
        gambarLama
      );
      fs.unlinkSync(pathGambarLama);
    }

    connection.query("DELETE FROM agent WHERE id = ?", [id], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      }
      return res.status(200).json({
        status: true,
        message: "Data has been deleted!",
      });
    });
  });
});

module.exports = router;
