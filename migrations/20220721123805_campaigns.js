const $table = "campaigns";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable($table).then((exists) => {
    if(!exists) {
        return knex.schema.createTable($table, (table) => {
            table.bigIncrements('id').primary();
            table.bigInteger('user_id').unsigned().notNullable();
            table.string("campaign_name").notNullable();
            table.string("slug").notNullable();
            table.string("color", 15).notNullable();
            table.dateTime('deleted_at').nullable().defaultTo(null);
            table.timestamps(true, true);
            // relationsship
            table.foreign("user_id").references("users.id");
            // index
            table.index(["user_id", "slug", "deleted_at"], "userId_slug_index");
        });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists($table);  
};
