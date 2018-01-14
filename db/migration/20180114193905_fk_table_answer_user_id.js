
exports.up = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.integer('user_id').unsigned()
            .notNullable().references('id').inTable('users')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.dropForeign('user_id');
        table.dropColumn('user_id');
    })
};