
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('type_questions').del()
      .then(function () {
        // Inserts seed entries
        return knex('type_questions').insert([
          {
            id: 1,
            name:'Text',

          },
          {
            id: 2,
            name:'yes-no',

          },
          {
            id: 3,
            name:'multiple choice',

          },
          {
            id: 4,
            name:'single choice',

          },
        ]);
      });
};
