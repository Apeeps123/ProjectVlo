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

router.get("/",  authenticateToken, (req, res) => {
  connection.query("SELECT * FROM roles", (err, rows) => {
    if (err) {
      console.error("Error retrieving roles data:", err);
      return res.status(500).json({ status: false, message: "Server Error" });
    }
    console.log("Roles data retrieved successfully");
    return res
      .status(200)
      .json({ status: true, message: "Data Roles", data: rows });
  });
});

router.post(
  "/store", authenticateToken,
  upload.single("icon"),
  [body("role").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const icon = req.file ? req.file.filename : null;

    const data = {
      role,
      icon,
    };

    connection.query("INSERT INTO roles SET ?", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Server Error",
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "Role created successfully",
          data: rows[0],
        });
      }
    });
  }
);

router.patch("/update/:id", authenticateToken, upload.single("icon"), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const id = req.params.id;
  const { role } = req.body;
  const icon = req.file ? req.file.filename : null;

  connection.query(`SELECT * FROM roles WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Role not found",
      });
    }

    const iconLama = rows[0].icon;

    if (iconLama && icon) {
      const pathIconLama = path.join(__dirname, "../public/images", iconLama);
      fs.unlinkSync(pathIconLama);
    }

    const data = {
      role,
      icon: icon || iconLama,
    };

    connection.query(
      "UPDATE roles SET ? WHERE id = ?",
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
          message: "Role updated successfully",
        });
      }
    );
  });
});
router.delete("/delete/:id", authenticateToken, (req, res) => {
  const id = req.params.id;

  connection.query("DELETE FROM roles WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting role:", err);
      return res.status(500).json({
        status: false,
        message: "Server Error",
      });
    }

    if (result.affectedRows === 0) {
      // No rows were affected, which means the role with the given ID was not found.
      return res.status(404).json({
        status: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Role has been deleted!",
    });
  });
});

module.exports = router;
