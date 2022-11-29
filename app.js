const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const Photo = require("./models/Photo");
const fs = require("fs");
const methodOverride = require("method-override");
const app = express();

//* Connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//* Template Engine
app.set("view engine", "ejs");

const port = 3000;

//* Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//* Routes
app.get("/", async (req, res) => {
  const photos = await Photo.find({}).sort("-createdDate");
  res.render("index", {
    photos,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadedImage.name;

  uploadedImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadedImage.name,
    });
    res.redirect("/");
  });
});

app.get("/photos/:id", async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  res.render("photo", {
    photo,
  });
});

app.get("/photos/edit/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", {
    photo,
  });
});

app.put("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
});

app.delete("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({_id: req.params.id});

  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
