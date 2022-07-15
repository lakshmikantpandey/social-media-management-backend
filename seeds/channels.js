const $table = "channels";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex($table).del();
  await knex($table).insert([
    {
      channel: 'Facebook',
      slug:'FB',
      image:'',
      is_active: true
    },
    {
      channel: 'LinkedIn',
      slug:'Ln',
      image:'',
      is_active: true
    },
    {
      channel: 'Instagram',
      slug:'In',
      image:'',
      is_active: true
    }
  ]);
};
