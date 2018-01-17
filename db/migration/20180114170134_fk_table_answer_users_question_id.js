
exports.up = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.integer('question_id').unsigned()
            .nullable().references('id').inTable('questions').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('answer_users', function (table) {
        table.dropForeign('question_id');
        table.dropColumn('question_id');
    })
};
