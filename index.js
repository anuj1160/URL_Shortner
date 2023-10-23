const express = require("express");
const path = require("path");
const { connecToMongoDB } = require("./connect");
const urlRoutes = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const URL = require("./models/url");
const dotenv = require("dotenv").config();
const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = 8000;
connecToMongoDB(process.env.URI)
  .then(() => app.listen(5000))
  .then(() =>
    console.log("Connected TO Database and Listening TO Localhost 5000")
  )
  .catch((err) => console.log("myerror " + err));
// Routes
app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});
app.use("/url", urlRoutes);
app.use("/", staticRouter);
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  // console.log(entry);
  res.redirect(entry?.redirectURL);
});
app.listen(PORT, () => console.log(`Server started at port:${PORT}`));
