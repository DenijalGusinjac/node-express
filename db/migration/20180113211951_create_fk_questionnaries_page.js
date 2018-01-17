
exports.up = function(knex, Promise) {
    return knex.schema.table('page_questionnaires', function (table) {
        table.integer('questionnaire_id').unsigned()
            .notNullable().references('id')
           .inTable('questionnaires').onDelete('CASCADE').onUpdate('CASCADE')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('page_questionnaires', function (table) {
        table.dropForeign('questionnaire_id');
        table.dropColumn('questionnaire_id');
    })
};
