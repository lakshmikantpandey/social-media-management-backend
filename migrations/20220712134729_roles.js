const $table = "roles";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.hasTable($table).then(function (exists) {
		if (!exists) {
			return knex.schema.createTable($table, (table) => {
				table.increments();
				table.string('role').notNullable();
				table.string('slug').unique().notNullable();
				table.boolean('is_active').defaultTo(true);
				table.timestamps(true, true);
				// index
				table.index(["slug"], "role_index");
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
