var express = require("express");
var router = express.Router();

// Import the model (burger.js) to use its database functions.
var burger = require("../models/burger.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {  //SHOWS ALL THE burgerS
  burger.all(function(data) {
    var hbsObject = {
      burgers: data
    };
    console.log("router.get", hbsObject);
    res.render("index", hbsObject);
  });
});



router.post("/api/burgers", function(req, res) {
  console.log("req in post:", req.body)
  burger.create([
    "burger_name", "devoured"  //COLUMN HEADERS WE WANT TO ADD INTO OUR DATABASE
  ], [
    req.body.name, req.body.devour // VALUES TO ENTER INTO THE DATABASE
  ], function(result) {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});



router.put("/api/burgers/:id", function(req, res) {
  var condition = "id = " + req.params.id; //id = 6

  console.log("condition", condition);
  console.log ("router.put", req.body)

  burger.update({
    devoured: req.body.devour //dDATA WE ARE UPDATING
  }, condition, function(result) {
    if (result.changedRows == 0) {  // changedRows WORKS ONLY FOR UPDATING
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});



router.delete("/api/burgers/:id", function(req, res) {
  var condition = "id = " + req.params.id;

  burger.delete(condition, function(result) {
    if (result.affectedRows == 0) { // affectedRows WORKS ONLY FOR DELETING
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// Export routes for server.js to use.
module.exports = router;
