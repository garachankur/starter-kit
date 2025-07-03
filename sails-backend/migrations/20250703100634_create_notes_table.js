exports.up = async function (knex) {
  await knex.schema.createTable("notes", (t) => {
    t.increments("id").primary();
    t.string("title").notNullable();
    t.string("description").notNullable();
    t.datetime("created_at", { useTz: true });
    t.datetime("updated_at", { useTz: true });
  });

  return true;
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("notes");
};
