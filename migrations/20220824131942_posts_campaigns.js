const $table = "posts_campaigns";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.hasTable($table).then((exists) => {
		if(!exists) {
			return knex.schema.createTable($table, function(table) {
				table.uuid("id").defaultTo(knex.raw('gen_random_uuid()')).unique().primary();
				table.uuid("post_id").notNullable();
				table.uuid("campaign_id").nullable();
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
