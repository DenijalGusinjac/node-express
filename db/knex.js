/**
 * Created by denijalgusinjac on 12/01/2018.
 */
var envirovment =process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[envirovment];
module.exports = require('knex')(config);