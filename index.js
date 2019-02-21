const express = require("express");
const helmet = require("helmet");

const server = express();

server.use(express.json());
server.use(helmet());

const db = require("./data/zooDb");

server.post("/api/zoos", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "zoo must have a name."
    });
    return;
  }
  db.insert({
    name
  })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the zoo to the database"
      });
      return;
    });
});

server.get("/api/zoos", (req, res) => {
  db.get()
    .then(zoos => {
      res.json({ zoos });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "zoo list could not be retrieved."
      });
      return;
    });
});

server.get("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db.getById(id)
    .then(zoo => {
      if (zoo.length === 0) {
        res.status(404).json({
          message: "That zoo does not exist."
        });
        return;
      }
      res.json({ zoo });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "zoo could not be retrived"
      });
      return;
    });
});

server.delete("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(response => {
      if (response === 0) {
        res.status(404).json({
          message: "The zoo with the specified ID does not exist."
        });
        return;
      }
      res.json({ success: `zoo ${id} removed.` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The zoo could not be removed"
      });
      return;
    });
});

server.put("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "Name is required to modify zoo name"
    });
    return;
  }
  db.update(id, { name })
    .then(response => {
      if (response == 0) {
        res.status(404).json({
          message: "The zoo with the specified ID does not exist."
        });
        return;
      }
      db.getById(id)
        .then(zoo => {
          if (zoo.length === 0) {
            res.status(404).json({
              errorMessage: "The name with the specified ID does not exist."
            });
            return;
          }
          res.json(zoo);
        })
        .catch(error => {
          console.log(error);
          res
            .status(500)
            .jason({ error: "The zoo information could not be modified." });
        });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The zoo information could not be modified." });
      return;
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
