exports.up = async function (knex) {
  await knex.schema.createTable("students", (t) => {
    t.increments("id").primary();
    t.string("email").unique().notNullable();
    t.string("password").nullable();
    t.string("first_name").nullable();
    t.string("last_name").nullable();
    t.datetime("created_at", { useTz: true });
    t.datetime("updated_at", { useTz: true });
  });

  return true;
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("students");
};
