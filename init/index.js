const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => console.log("connected with db"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderLust');
};


const initDb = async ()=>{
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj)=>({

      ...obj, owner:"65322525f7899dd8e86549d1"
    }));
    await Listing.insertMany(initData.data);
    console.log("initialized successfully");
}
initDb();