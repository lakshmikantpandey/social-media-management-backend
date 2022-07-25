const $table = "user_channels";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.hasTable($table).then((exists) => {
		if(!exists){
			return knex.schema.createTable($table, (table) => {
				table.bigIncrements();
				table.bigInteger('user_id').notNullable();
				table.string('channel_type').notNullable();
				table.json('user_auth').nullable();
				table.json('permissions').nullable();
				table.json('schedules').nullable();
				table.string('timezone').nullable();
				table.date("expired_at").nullable();
				table.boolean('is_active').defaultTo(false);
				table.string('channel_token').nullable();
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
	return knex.schema.dropTableIfExists($table);
};
