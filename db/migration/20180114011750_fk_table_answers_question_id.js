
exports.up = function(knex, Promise) {
    return knex.schema.table('answers', function (table) {
        table.integer('question_id').unsigned()
            .notNullable().references('id').inTable('questions')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('questions', function (table) {
        table.dropForeign('question_id');
        table.dropColumn('question_id');
    })
};