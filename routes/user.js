/**
 * Created by denijalgusinjac on 13/01/2018.
 */
module.exports = function(router, passport){
    //GET MY Administration
    var async = require('async');

    router.use(function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        res.redirect('/login')
    });

    //GET MY PROFILE user/profile
    router.get('/profile',function(req, res, next){

        const db = require('../db.js');

        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM questionnaires LEFT JOIN user_questionnaires ON questionnaires.id = user_questionnaires.questionnaires_id WHERE user_questionnaires.questionnaires_id IS NULL', function(errors, questionnaires){
                        callback(errors, questionnaires);
                    })
                }
            ],
            function(err, results){
                var data = {questionnaires: results[0]}
                res.render('user/myprofile', data)
            }
        )
    });

    //GET NEW QUESTIONNAIRES
    router.get('/questionnaire/:id',function(req, res, next){

        const db = require('../db.js');

        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM page_questionnaires WHERE questionnaire_id = ?',[req.params.id], function(errors, page_questionnaires){
                        callback(errors, page_questionnaires);
                    })
                },
                function(callback){
                    db.query("SELECT answers.name as answer_name, answers.id as answer_id, answers.question_id, questions.name, questions.type_question_id, page_questionnaires.questionnaire_id FROM questions LEFT JOIN page_questionnaires ON (questions.page_questionnaire_id) = page_questionnaires.id LEFT JOIN answers ON (questions.id = answers.question_id)  WHERE page_questionnaires.questionnaire_id = ?",[req.params.id], function(errors, answers){
                        callback(errors, answers);
                    })
                },
                function(callback){
                    db.query("SELECT  questions.id, questions.name, questions.type_question_id, questions.page_questionnaire_id, page_questionnaires.questionnaire_id FROM questions LEFT JOIN page_questionnaires ON (questions.page_questionnaire_id) = page_questionnaires.id WHERE page_questionnaires.questionnaire_id = ?",[req.params.id], function(errors, questions){
                        callback(errors, questions);
                    })
                },
            ],
            function(err, results){
                var data = {page_questionnaires: results[0], answers:results[1], questions:results[2]}
                res.render('user/questionnaires', data)
            }
        )
    });


    router.post('/answer',function(req, res, next){


        const db = require('../db.js');

        const user_id = req.user.user_id;

        const text_answers = req.body.text;
        const text_questions = req.body.textquestion;

        const multiples = req.body.multiples;
        const page = req.body.page;
        console.log(page[0])


        // INSERT TEXT QUESTIONS ANSWER
        if(Array.isArray(text_answers))
        text_answers.forEach(function(text_answer, index, arr) {
            if(text_answer != '')
            db.query("INSERT INTO answer_users (text_answer, question_id, user_id) VALUES (?, ?, ?)", [text_answer, text_questions[index], user_id], function (error, results, fields) {
                if (error) throw error;
            });
        });
        else
        if(text_answers != '')
            db.query("INSERT INTO answer_users (text_answer, question_id, user_id) VALUES (?, ?, ?)", [text_answers, text_questions, user_id], function (error, results, fields) {
                if (error) throw error;
            });


        // INSERT MULTIPLE QUESTION ANSWER
        if(Array.isArray(multiples))
            multiples.forEach(function(multiple, index, arr) {
                if(multiple != '')
                    db.query("INSERT INTO answer_users (answer_id, user_id) VALUES (?, ?)", [multiple, user_id], function (error, results, fields) {
                        if (error) throw error;
                    });
            });
        else

            if(multiples != '')
                db.query("INSERT INTO answer_users (answer_id, user_id) VALUES (?, ?)", [multiples, user_id], function (error, results, fields) {
                    if (error) throw error;
                });




        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM page_questionnaires WHERE id = ?',page[0], function(errors, page_questionnaires){
                        callback(errors, page_questionnaires);
                    })
                },
            ],
            function(err, results){
                var data =  results[0]

                db.query("INSERT INTO user_questionnaires (user_id, questionnaires_id ,finish) VALUES (?, ?, ?)", [user_id, data[0].questionnaire_id, 1], function (error, results, fields) {
                    if (error) throw error;
                });
            }
        )




        res.redirect('/user/questionnaire-finish');



    });

    //GET MY PROFILE user/profile
    router.get('/questionnaire-finish',function(req, res, next){

        res.render('user/finish')
    });

}
