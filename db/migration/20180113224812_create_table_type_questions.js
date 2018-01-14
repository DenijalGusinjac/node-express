
exports.up = function(knex, Promise) {
    return knex.schema.createTable('type_questions', function(table){
        table.increments();
        table.string('name').notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('type_questions');
};
