const $table = "channels";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.hasTable($table).then((exists) => {
		if(!exists) {
			return knex.schema.createTable($table, (table) => {
				table.increments();
				table.string('channel', 100).notNullable();
				table.string('slug', 20).notNullable();
				table.string('image').nullable();
				table.boolean('is_active').defaultTo(true);
				table.timestamps(true, true);
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
