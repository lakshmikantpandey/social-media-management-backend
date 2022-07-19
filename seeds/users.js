// env config
require('dotenv').config();
const { randomBytes, pbkdf2Sync } = require('crypto');
// end

const { CONFIG_BYTES, CONFIG_ITERATION, CONFIG_KEY_LENGTH, CONFIG_DIGEST} = process.env;

function hashPassword(password) {
  const salt = randomBytes(parseInt(CONFIG_BYTES)).toString('hex');
  const hash = pbkdf2Sync(password, salt, parseInt(CONFIG_ITERATION), parseInt(CONFIG_KEY_LENGTH), CONFIG_DIGEST).toString('hex');
  const data = `${salt}:${hash}`;
  return Buffer.from(data).toString('base64');
}

const $table = "users";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex($table).del();
  await knex($table).insert([
    {
      first_name: 'Techphant Consulting Group',
      last_name: '',
      username: 'admin',
      email:'admin@mailinator.com',
      mobile:'',
      password: hashPassword('12345'),
      role: 'admin',
      is_active: true
    },
    {
      first_name: 'Techphant Consulting Group',
      last_name: '',
      username: 'creator',
      email:'creator01@mailinator.com',
      mobile:'',
      password: hashPassword('12345'),
      role: 'creator',
      is_active: true
    }
  ]);
};
