
exports.up = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.integer('question_id').unsigned()
            .nullable().references('id').inTable('questions')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.dropForeign('question_id');
        table.dropColumn('question_id');
    })
};
