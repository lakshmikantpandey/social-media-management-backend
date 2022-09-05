const $table = "posts";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable($table).then((exists) => {
		if(!exists) {
			return knex.schema.createTable($table, function(table) {
				table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).unique().primary();
				table.uuid("user_id").notNullable();
				table.string("post_description").notNullable();
				table.json("hashtag").nullable();
				table.boolean("is_draft").defaultTo(false);
				table.boolean("is_active").defaultTo(true);
				table.boolean("is_approved").defaultTo(false);
				table.dateTime('deleted_at').nullable().defaultTo(null);
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
	return knex.schema.dropTableIfExists("posts_campaigns")
			.dropTableIfExists("post_channels_map")
			.dropTableIfExists("post_files")
			.dropTableIfExists($table);
};
