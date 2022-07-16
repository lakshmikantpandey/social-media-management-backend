import Knex from 'knex';
import { Model } from 'objection';
import config from '../config';

// knex connection
const knex = Knex(config.knex.config);
Model.knex(knex);

export class BaseModel extends Model {};