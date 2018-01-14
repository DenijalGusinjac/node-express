
exports.up = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
       table.integer('role_id').unsigned()
           .notNullable().references('id').inTable('roles')
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
        table.dropForeign('role_id');
        table.dropColumn('role_id');
    })
};
