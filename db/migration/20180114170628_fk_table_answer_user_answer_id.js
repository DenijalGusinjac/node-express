
exports.up = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.integer('answer_id').unsigned()
            .nullable().references('id').inTable('answers')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.dropForeign('answer_id');
        table.dropColumn('answer_id');
    })
};
