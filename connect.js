const mongoose = require("mongoose");
async function connecToMongoDB(url) {
  return mongoose.connect(url);
}
module.exports = {
  connecToMongoDB,
};
