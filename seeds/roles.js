const $table = "roles";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex($table).del()
  await knex($table).insert([
    {
      role:'ADMIN',
      slug:'admin'
    },
    {
      role:'CREATOR',
      slug:'creator'
    },
  ]);
};
