
exports.up = function(knex, Promise) {
    return knex.schema.createTable('user_questionnaires', function(table){
        table.integer('user_id').unsigned()
            .notNullable().references('id').inTable('users')
        table.integer('questionnaires_id').unsigned()
            .notNullable().references('id').inTable('questionnaires')
        table.tinyint('finish', 1).nullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('user_questionnaires');
};
