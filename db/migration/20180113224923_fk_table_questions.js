
exports.up = function(knex, Promise) {
    return knex.schema.table('questions', function (table) {
        table.integer('type_question_id').unsigned()
            .notNullable().references('id').inTable('type_questions').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('questions', function (table) {
        table.dropForeign('type_question_id');
        table.dropColumn('type_question_id');
    })
};
