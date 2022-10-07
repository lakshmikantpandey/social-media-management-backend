const $table = "post_channels_map";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.hasTable($table).then((exists) => {
		if(!exists) {
			return knex.schema.createTable($table, function(table) {
				table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).unique().primary();
				table.uuid("post_id").notNullable();
				table.uuid("channel_id").notNullable();
				table.string("timezone").notNullable();
				table.timestamp("post_date", { useTz: true });
				table.dateTime('deleted_at').nullable().defaultTo(null);
				table.timestamps(true, true);

				// foreign relation
				table.foreign("channel_id").references("user_channels.id");
				table.foreign("post_id").references("posts.id");

				// index
				table.index(["post_id", "channel_id"], "posts_channel_map");
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
