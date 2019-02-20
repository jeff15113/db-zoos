exports.up = function(knex) {
  return knex.schema.createTable("zoos", function(zoos) {
    zoos.increments();
    zoos
      .string("name")
      .notNullable()
      .unique();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("zoos");
};
