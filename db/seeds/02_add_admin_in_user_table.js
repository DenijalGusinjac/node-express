
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          first_name: 'admin',
          last_name: 'admin',
          email:'admin@admin.com',
          password:'$2a$10$1OCYH2VfnrL7HQiM85kMq.SDnOD7HK7vkXUdgxSH8/Lhav6JUCpBi',
          role_id:'1'

        },
      ]);
    });
};
