exports.up = async function (knex) {
  await knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("email").unique().notNullable();
    t.string("password").notNullable();
    t.string("first_name").notNullable();
    t.string("last_name").notNullable();
    t.string("profile_image").nullable();
    t.datetime("created_at", { useTz: true });
    t.datetime("updated_at", { useTz: true });
  });

  return true;
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
