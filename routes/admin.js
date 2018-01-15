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

    router.use(function(req, res, next){
        const db = require('../db.js');
        const user_id = req.session.passport.user.user_id;
        db.query("SELECT role_id, id FROM users WHERE id = "+user_id,function(error, results, fields){
        	if (error) throw error;
            console.log(results[0].role_id)
        	if(results[0].role_id == 1){
                return next();

        	}
                res.redirect('/user/profile')

        });
    });

    router.get('/profile',function(req, res, next){
        res.render('admin/administration', {title: 'Administration'})
    });

    router.get('/questionnaire',function(req, res, next){
        const db = require('../db.js');

        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM questionnaires', function(errors, questionnaires){
                        callback(errors, questionnaires);
                    })
                }
            ],
            function(err, results){
                var data = {questionnaires: results[0]}
                res.render('admin/question', data)
            }
        )

    });

    //GET DELETE QUESTIONNAIRE
    router.get('/delete-questionnaire/:id',function(req, res, next){

            const db = require('../db.js');
            db.query("DELETE FROM questionnaires WHERE id  = ?", [req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect('/admin/questionnaire');



    });

    //GET EDIT QUESTIONNAIRE
    router.get('/edit-questionnaire/:id',function(req, res, next){

        const db = require('../db.js');
        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM questionnaires WHERE id = ?',[req.params.id], function(errors, questionnaires){
                        callback(errors, questionnaires);
                    })
                }
            ],
            function(err, results){
                var data = {questionnaires: results[0]}
                res.render('admin/edit', data)
            }
        )


    });

    //POST EDIT QUESTIONNAIRE
    router.post('/edit-questionnaire-save/:id',function(req, res, next){

        const db = require('../db.js');
        const name = req.body.name;
        const description = req.body.description;

        db.query("UPDATE questionnaires SET name=? , description=? WHERE id  = ?", [name, description,req.params.id], function (error, results, fields) {
            if (error) throw error;
        });
        res.redirect('/admin/questionnaire');


    });

    //POST CREATE QUESTIONNAIRE
    router.post('/create-questionnaire',function(req, res, next){

        req.checkBody('name', 'Title field require').notEmpty()

        const errors = req.validationErrors();

        if(errors){
            res.render('admin/question', {
                title: "Questionnaire error",
                errors: errors
            })
        }else{

            const db = require('../db.js');
            const name = req.body.name;
            const description = req.body.description;


                db.query("INSERT INTO questionnaires (name, description) VALUES(?, ?)", [name, description], function (error, results, fields) {
                    if (error) throw error;
                });


            res.redirect('/admin/questionnaire');


        }


    });

    //GET QUESTIONNARIE SPECIFIC
    router.get('/questionnaire/:id',function(req, res, next){
        const db = require('../db.js');

        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM page_questionnaires WHERE questionnaire_id = ?',[req.params.id], function(errors, page_questionnaires){
                        callback(errors, page_questionnaires);
                    })
                }
            ],
            function(err, results){
                var data = {page_questionnaires: results[0], id:[req.params.id]}
                res.render('admin/specific-question', data)
            }
        )
    });

    //POST INSERT NEW PAGE QUESTIONARRIE

    router.post('/create-pages',function(req, res, next){


            const db = require('../db.js');
            const name = req.body.name;
            const id = req.body.id;

            db.query("INSERT INTO page_questionnaires (name, questionnaire_id) VALUES (?, ?)", [name, id], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect('/admin/questionnaire/'+id);



    });

    //GET QUESTIONNARIE SPECIFIC
    router.get('/page/:id',function(req, res, next){
        const db = require('../db.js');

        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM questions WHERE page_questionnaire_id = ?',[req.params.id], function(errors, questions){
                        callback(errors, questions);
                    })
                },
                function(callback){
                    db.query('SELECT * FROM type_questions', function(errors, type_questions){
                        callback(errors, type_questions);
                    })
                },
            ],
            function(err, results){
                var data = {questions: results[0],id:[req.params.id], type_questions: results[1]}
                res.render('admin/pages', data)
            }
        )
    });
    //POST CREATE QUESTION
    router.post('/create-questions',function(req, res, next){


        const db = require('../db.js');
        const name = req.body.name;
        const type = req.body.type;
        const id = req.body.id;

        db.query("INSERT INTO questions (name, type_question_id, page_questionnaire_id) VALUES (?, ?, ?)", [name, type, id], function (error, results, fields) {
            if (error) throw error;
        });
        res.redirect('/admin/page/'+id);



    });

    //GET QUESTION SPECIFIC
    router.get('/question/:id',function(req, res, next){
        const db = require('../db.js');

        async.parallel(
            [
                function(callback){
                    db.query('SELECT * FROM answers WHERE question_id = ?',[req.params.id], function(errors, answers){
                        callback(errors, answers);
                    })
                },
            ],
            function(err, results){
                var data = {answers: results[0],id:[req.params.id]}
                res.render('admin/answers', data)
            }
        )
    });


    //POST CREATE QUESTION
    router.post('/create-answers',function(req, res, next){


        const db = require('../db.js');
        const name = req.body.name;
        const id = req.body.id;

        db.query("INSERT INTO answers (name, question_id) VALUES (?, ?)", [name, id], function (error, results, fields) {
            if (error) throw error;
        });
        res.redirect('/admin/question/'+id);



    });
}



