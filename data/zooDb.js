const db = require("./dbConfig.js");

module.exports = {
  get,
  getById,
  insert,
  update,
  remove
};

function get() {
  return db("zoos");
}

function getById(id) {
  return db("zoos")
    .where({ id })
    .first();
}

function insert(zoo) {
  return db("zoos")
    .insert(zoo)
    .then(ids => {
      return getById(ids[0]);
    });
}

function update(id, changes) {
  return db("zoos")
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db("zoos")
    .where("id", id)
    .del();
}
