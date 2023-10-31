const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// @ index route
module.exports.indexRender = async(req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

// @ new route
module.exports.renderNewListing = (req, res) =>{
    res.render("listings/new.ejs");
}

module.exports.newListing = async(req, res) =>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing added");
    res.redirect("/listings");
}

// @ show route
module.exports.showListing = async(req,res) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error", "Listing you requsted for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}


// @ edit route
module.exports.editListing = async(req, res, error) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requsted for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

// @ update route
module.exports.updateListing = async(req, res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    listing.geometry = response.body.features[0].geometry;
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

// @ delete/destroy route

module.exports.destroyListing = async(req,res, err)=>{
    let{id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}