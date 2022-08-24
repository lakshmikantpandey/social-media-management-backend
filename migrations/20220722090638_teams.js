const $table = "teams";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable($table).then((exists) => {
    if(!exists) {
        return knex.schema.createTable($table, (table) => {
            table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).unique().primary();
            table.uuid("user_id").notNullable();
            table.boolean("admin_access").defaultTo(false);
            table.json("channels").notNullable();
            table.dateTime("deleted_at").nullable();
            table.timestamps(true, true);
            // relations
            table.foreign("user_id").references("users.id");
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
