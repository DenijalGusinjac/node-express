
exports.up = function(knex, Promise) {
    return knex.schema.table('questions', function (table) {
        table.integer('page_questionnaire_id').unsigned()
            .notNullable().references('id').inTable('page_questionnaires').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('questions', function (table) {
        table.dropForeign('page_questionnaire_id');
        table.dropColumn('page_questionnaire_id');
    })
};
