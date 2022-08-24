const $table = "users";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable($table).then((exists) => {
	if(!exists){
		return knex.schema.createTable($table, function (table) {
			table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).unique().primary();
			table.bigInteger('parent_id').defaultTo(0);
			table.string("first_name");
			table.string("last_name").nullable();
			table.string("username").notNullable().unique();
			table.string("email").nullable().unique();
			table.string("mobile").nullable();
			table.string("password").nullable();
			table.string("role");
			table.boolean("is_active").defaultTo(false);
			table.boolean("is_deleted").defaultTo(false);
			// is deleted
			table.dateTime("deleted_at").nullable();
			table.timestamps(true, true);
			// compisite index
			table.index(["username", "is_active", "role"], "users_index");
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
