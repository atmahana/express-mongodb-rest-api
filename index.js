//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGODB_URL);
}

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((result) => {
        res.send(result);
      })
      .catch((err) => res.send(err));
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save();
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then(() => {
        res.send("successfully deleted all articles");
      })
      .catch((err) => {
        res.send(err);
      });
  });

app
  .route("/articles/:title")
  .get((req, res) => {
    Article.findOne({ title: req.params.title })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    )
      .then(() => {
        res.send("Successfully updated article.");
      })
      .catch((err) => res.send(err));
  })
  .patch((req, res) => {
    Article.updateOne({ title: req.params.title }, { $set: req.body })
      .then(() => {
        res.send("Successfully updated article.");
      })
      .catch((err) => res.send(err));
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.title})
    .then(() => {
      res.send("Successfully deleted article.");
    }).catch((err) => res.send(err));
  })

app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
