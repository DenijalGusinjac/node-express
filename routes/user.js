/**
 * Created by denijalgusinjac on 13/01/2018.
 */
module.exports = function (router, passport) {
    //GET MY Administration
    var async = require('async');

    router.use(function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login')
    });

    //GET MY PROFILE user/profile
    router.get('/profile', function (req, res, next) {

        const db = require('../db.js');
        const user_id = req.session.passport.user.user_id;
        async.parallel(
            [
                function (callback) {
                    db.query("SELECT *,questionnaires.id as id FROM questionnaires WHERE NOT EXISTS(SELECT * FROM user_questionnaires WHERE questionnaires.id = user_questionnaires.questionnaires_id AND user_questionnaires.user_id = ?)",[user_id], function (errors, questionnaires) {
                        callback(errors, questionnaires);
                    })
                },

                function (callback) {
                    db.query("SELECT MIN(id) as id,questionnaire_id FROM page_questionnaires GROUP BY questionnaire_id", function (errors, pages) {
                        callback(errors, pages);
                    })
                }
            ],
            function (err, results) {
                var data = {questionnaires: results[0], pages: results[1]}
                console.log(data)
                res.render('user/myprofile', data)
            }
        )
    });

    //GET NEW QUESTIONNAIRES
    router.get('/questionnaire/:id/:page_id', function (req, res, next) {

        const db = require('../db.js');

        async.parallel(
            [
                function (callback) {
                    db.query('SELECT * FROM page_questionnaires WHERE questionnaire_id = ?', [req.params.id], function (errors, page_questionnaires) {
                        callback(errors, page_questionnaires);
                    })
                },
                function (callback) {
                    db.query("SELECT answers.name as answer_name, answers.id as answer_id, answers.question_id, questions.name, questions.type_question_id, page_questionnaires.questionnaire_id FROM questions LEFT JOIN page_questionnaires ON (questions.page_questionnaire_id) = page_questionnaires.id LEFT JOIN answers ON (questions.id = answers.question_id)  WHERE page_questionnaires.questionnaire_id = ? AND questions.page_questionnaire_id = ?", [req.params.id, req.params.page_id], function (errors, answers) {
                        callback(errors, answers);
                    })
                },
                function (callback) {
                    db.query("SELECT  questions.id, questions.name, questions.type_question_id, questions.page_questionnaire_id, page_questionnaires.questionnaire_id FROM questions LEFT JOIN page_questionnaires ON (questions.page_questionnaire_id) = page_questionnaires.id WHERE page_questionnaires.questionnaire_id = ? AND questions.page_questionnaire_id = ?", [req.params.id, req.params.page_id], function (errors, questions) {
                        callback(errors, questions);
                    })
                },
                function (callback) {
                    db.query('SELECT count(*) as count FROM page_questionnaires WHERE questionnaire_id = ?', [req.params.id], function (errors, page_count) {
                        callback(errors, page_count);
                    })
                }

            ],
            function (err, results) {
                console.log(results)
                var data = {page_questionnaires: results[0], answers: results[1], questions: results[2], count: results[3]}
                res.render('user/questionnaires', data)
            }
        )
    });


    router.post('/answer', function (req, res, next) {


        const db = require('../db.js');

        const user_id = req.user.user_id;

        const text_answers = req.body.text;
        const text_questions = req.body.textquestion;

        const multiples = req.body.multiples;
        const page = req.body.page;
        const y_n_questions = req.body.y_n_questions;
        const new_single_questions = req.body.single_questions;
        const questionnaire = req.body.questionnaire;

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        if(new_single_questions != undefined){
            var single_questions = new_single_questions.filter( onlyUnique );
        }else{
            var single_questions = req.body.single_questions;
        }



        // INSERT TEXT QUESTIONS ANSWER
        if (Array.isArray(text_answers))
            text_answers.forEach(function (text_answer, index, arr) {
                if (text_answer != '')
                    db.query("INSERT INTO answer_users (text_answer, question_id, user_id) VALUES (?, ?, ?)", [text_answer, text_questions[index], user_id], function (error, results, fields) {
                        if (error) throw error;
                    });
            });
        else if (text_answers != '')
            db.query("INSERT INTO answer_users (text_answer, question_id, user_id) VALUES (?, ?, ?)", [text_answers, text_questions, user_id], function (error, results, fields) {
                if (error) throw error;
            });


        // INSERT MULTIPLE QUESTION ANSWER
        if (Array.isArray(multiples))
            multiples.forEach(function (multiple, index, arr) {
                if (multiple != '')
                    db.query("INSERT INTO answer_users (answer_id, user_id) VALUES (?, ?)", [multiple, user_id], function (error, results, fields) {
                        if (error) throw error;
                    });
            });
        else if (multiples != '')
            db.query("INSERT INTO answer_users (answer_id, user_id) VALUES (?, ?)", [multiples, user_id], function (error, results, fields) {
                if (error) throw error;
            });





        if (Array.isArray(y_n_questions)){
            y_n_questions.forEach(function (y_n_question, index, arr) {
                var options = "options"+y_n_question;
                const num = req.body[options];
                db.query("INSERT INTO answer_users (user_id, y_n_answer, question_id) VALUES (?, ?, ?)", [user_id, num, y_n_question], function (error, results, fields) {
                    if (error) throw error;
                });
            });
        } else{
            if (y_n_questions != ''){
            var options = "options"+y_n_questions;
            const num = req.body[options];
            db.query("INSERT INTO answer_users (user_id, y_n_answer, question_id) VALUES (?, ?, ?)", [user_id, num, y_n_questions], function (error, results, fields) {
                if (error) throw error;
            });
            }
        }

            if (Array.isArray(single_questions)){
                single_questions.forEach(function (single_question, index, arr) {
                    var options = "singles"+single_question;
                    const num = req.body[options];
                    db.query("INSERT INTO answer_users (user_id, answer_id, question_id) VALUES (?, ?, ?)", [user_id, num, single_question], function (error, results, fields) {
                        if (error) throw error;
                    });
                });
            } else{
                if (single_questions != ''){
                    var options = "options"+single_questions;
                    const num = req.body[options];
                    db.query("INSERT INTO answer_users (user_id, answer_id, question_id) VALUES (?, ?, ?)", [user_id, num, single_questions], function (error, results, fields) {
                        if (error) throw error;
                    });
                }
            }


        const questionnaire_id = questionnaire.filter( onlyUnique )
        const page_id = page.filter( onlyUnique )

        db.query("SELECT * from page_questionnaires WHERE questionnaire_id =? ORDER BY id DESC", [questionnaire_id], function (error, results, fields) {
            if (error) throw error;
                if (results[0].id == page_id) {

                    db.query("INSERT INTO user_questionnaires (user_id, questionnaires_id ,finish) VALUES (?, ?, ?)", [user_id, questionnaire_id, 1], function (error, results, fields) {
                        if (error) throw error;
                    });

                    res.redirect('/user/questionnaire-finish');
                }else{
                    db.query("SELECT id from page_questionnaires WHERE questionnaire_id =? AND id > ? ORDER BY id LIMIT 1", [questionnaire_id, page_id], function (error, results, fields) {
                        if (error) throw error;

                        res.redirect('/user/questionnaire/'+questionnaire_id +'/'+ results[0].id);
                    });
                }

        });

        // INSERT YES / NO QUESTION ANSWER



    });

    //GET MY PROFILE user/profile
    router.get('/questionnaire-finish', function (req, res, next) {

        res.render('user/finish')
    });

}
