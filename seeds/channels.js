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
      slug:'Fb',
      image: `fb.svg`,
      is_active: true
    },
    {
      channel: 'LinkedIn',
      slug:'Ln',
      image:'ln.svg',
      is_active: true
    },
    {
      channel: 'Instagram',
      slug:'In',
      image:'in.svg',
      is_active: true
    },
    {
      channel: 'Twitter',
      slug:'Tw',
      image:'tw.svg',
      is_active: false
    }
  ]);
};
