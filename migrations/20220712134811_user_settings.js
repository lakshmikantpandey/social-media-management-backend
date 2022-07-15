/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const $table = "user_settings";

exports.up = function(knex) {

	return knex.schema.hasTable($table).then((exists) => {
		if(!exists){
			return knex.schema.hasTable($table).then(function (exists) {
				if (!exists) {
					return knex.schema.createTable($table, (table) => {
						table.bigIncrements();
						table.bigInteger('user_id').notNullable();
						table.json('settings').notNullable();
						table.timestamps(true, true);
					});
				}
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
