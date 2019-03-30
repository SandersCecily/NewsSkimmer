var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var router = express.Router();
var db = require("./models");
var Note = require("../models/Note.js");

router.get("/", function (req, res) {
  db.Article.find({ saved: false }, function (error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

router.get("/saved", function (req, res) {
  db.Article.find({ saved: true })
    .populate("notes")
    .exec(function (error, articles) {
      var hbsObject = {
        article: articles
      };
      res.render("saved", hbsObject);
    });
});

router.get("/scrape", function (req, res) {
  axios.get("https://www.google.com/search?q=google&tbm=nws").then(function (response) {
    var $ = cheerio.load(response.data);
    $("div.g").each(function (i, element) {
      var result = {};
      result.title = $(element).find(".r").text();
      result.link = $(element).find("a").attr("href");
      result.summary = $(element).find(".st").text();
      result.pic = $(element).find("img.th").attr("src");
      db.Article.create(result)
        .then(function (data) {
          console.log(data);
        })
        .catch(function (err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

router.get("/clear", function (req, res) {
  db.Article.remove({ saved: false }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed");
    }
  });
  res.redirect("/");
});

router.get("/articles", function (req, res) {
  db.Article.find({}, function (error, data) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(data);
    }
  });
});

router.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .exec(function (error, data) {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
      }
    });
});

router.post("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .exec(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
      }
    });
});

router.post("/articles/delete/:id", function (req, res) {
  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: false, notes: [] }
  ).exec(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
});

router.post("/notes/save/:id", function (req, res) {
  var newNote = new Note({
    body: req.body.text,
    article: req.params.id
  });
  console.log(req.body);
  newNote.save(function (error, note) {
    if (error) {
      console.log(error);
    } else {
      db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: note } }
      ).exec(function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send(note);
        }
      });
    }
  });
});

router.delete("/notes/delete/:note_id/:article_id", function (req, res) {
  db.Note.findOneAndRemove({ _id: req.params.note_id }, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      db.Article.findOneAndUpdate(
        { _id: req.params.article_id },
        { $pull: { notes: req.params.note_id } }
      ).exec(function (err) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send("Note Deleted");
        }
      });
    }
  });
});

module.exports = router;