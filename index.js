const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
let { destinations } = require("./db");
const { generateUniqueId } = require("./services");

const server = express();
server.use(express.json());
server.use(cors());
server.use(express.urlencoded());

// const PORT = process.env.PORT === undefined ? 3000 : process.env.PORT

let PORT = process.env.PORT || 3000;

// if (process.env.PORT !== undefined){
//   PORT = process.env.PORT
// }

server.listen(PORT, function () {
  console.log(`Server listening on PORT ${PORT}`);
});

// POST => create destinations
// data => {name^, location^, photo, description}
server.post("/destinations", async (req, res) => {
  const { name, location, description } = req.body;

  // Make sure we have a name AND location
  if (
    name === undefined ||
    name.length === 0 ||
    location === undefined ||
    location.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Name and Location are both required" });
  }

  const dest = { id: generateUniqueId(), name, location };

  const UNSPLASH_URL = `https://api.unsplash.com/photos/random?client_id=ZUAPn3ODLz7xSJEa_kQZY4B2kfKSccXz6f3jBytjcGE&q=${name} ${location}`;

  const fetchRes = await fetch(UNSPLASH_URL);
  const data = await fetchRes.json();

  dest.photo = data.urls.small;

  if (description && description.length !== 0) {
    dest.description = description;
  }

  destinations.push(dest);

  res.redirect("/destinations");
});

// GET => read destinations
// accepts the follow query parameters
// continent
server.get("/destinations", (req, res) => {
  res.send(destinations);
});

// PUT => edit a destination
server.put("/destinations/", (req, res) => {
  const { id, name, location, photo, description } = req.body;

  if (id === undefined) {
    return res.status(400).json({ message: "id is required" });
  }

  if (name !== undefined && name.length === 0) {
    return res.status(400).json({ message: "Name can't be empty" });
  }

  if (location !== undefined && location.length === 0) {
    return res.status(400).json({ message: "Location can't be empty" });
  }

  for (const dest of destinations) {
    if (dest.id === id) {
      if (name !== undefined) {
        dest.name = name;
      }

      if (location !== undefined) {
        dest.location = location;
      }

      if (photo !== undefined) {
        dest.photo = photo;
      }

      if (description !== undefined) {
        dest.description = description;
      }

      return res.json(dest);
    }
  }
});

// DELETE => delete a destination
// HOW TO GET THE ID from the reqs
// route parameters /destinations/:id => req.params.id
// query /destinations?id=198745 => req.query.id
server.delete("/destinations", (req, res) => {
  const destId = req.query.id;

  const newDestinations = destinations.filter((dest) => dest.id !== destId);

  destinations = newDestinations;

  res.redirect("/destinations");
});
