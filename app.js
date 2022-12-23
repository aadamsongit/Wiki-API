//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    // _id: String,
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err);
        }
    });
    })

    .post(function (req, res) {
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function (err) {
        if (!err) {
            res.send("Successfully added a new article!")
        } else {
            res.send(err);
        }
    });
    })


    .delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all articles!")
        } else {
            res.send(err);
        }
    });
    });


// app.get("/articles",);

// app.post("/articles", );

// app.delete("/articles",);

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching the title were found");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (err) {
                    res.send("There is some error");
                } else {
                    res.send("Updated successfully");
                }
            }
        );
    })
      
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (err) {
                    res.send("There is some error");
                } else {
                    res.send("Updated successfully");
                }
            }
        );
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (err) {
                    res.send("There is some error");
                } else {
                    res.send("Deleted article successfully");
                }
            }
        );
    });
    
    

app.listen(3000, function() {
  console.log("Server started on port 3000");
});