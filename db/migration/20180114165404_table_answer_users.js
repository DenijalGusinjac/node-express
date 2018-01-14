
exports.up = function(knex, Promise) {
    return knex.schema.createTable('answer_users', function(table){
        table.increments();
        table.string('text_answer').nullable();
        table.tinyint('y_n_answer', 1).nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('answer_users');
};
