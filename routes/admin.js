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


    //POST CREATE
    router.post('/create/:type',function(req, res, next){
        const db = require('../db.js');
        const name = req.body.name;
        const description = req.body.description;
        const id = req.body.id;
        const type = req.body.type;

        if(req.params.type == 'questionnaire'){
            req.checkBody('name', 'Name field required').notEmpty()


            const errors = req.validationErrors();
            if(errors){
            async.parallel(
                [
                    function (callback) {
                        db.query('SELECT * FROM questionnaires', function(errors, results){
                            callback(errors, results);
                        })
                    }

                ],
                function (err, results) {
                   console.log(results[0])
                    res.render('admin/question', {
                        title: "Registration error",questionnaires:results[0],
                        errors: errors
                    })
                }
            )
            }else{
            db.query("INSERT INTO questionnaires (name, description) VALUES(?, ?)", [name, description], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect('/admin/questionnaire');
            }
        }
        if(req.params.type == 'page'){
            req.checkBody('name', 'Name field required').notEmpty()

            const errors = req.validationErrors();
            if(errors){
                async.parallel(
                    [
                        function (callback) {
                            db.query('SELECT * FROM page_questionnaires WHERE questionnaire_id  = ?', [id], function(errors, results){
                                callback(errors, results);
                            })
                        }

                    ],
                    function (err, results) {
                        res.render('admin/specific-question', {
                            title: "Registration error",page_questionnaires:results[0],id:req.body.id,
                            errors: errors
                        })

                    }
                )
            }else{
                db.query("INSERT INTO page_questionnaires (name, questionnaire_id) VALUES (?, ?)", [name, id], function (error, results, fields) {
                    if (error) throw error;
                });
                res.redirect('/admin/questionnaire/'+id);
            }


        }

        if(req.params.type == 'question'){
            req.checkBody('name', 'Name field required').notEmpty()
            req.checkBody('type', 'Type field required').notEmpty()

            const errors = req.validationErrors();
            if(errors){
                async.parallel(
                    [
                        function(callback){
                            db.query('SELECT * FROM questions WHERE page_questionnaire_id = ?',[id], function(errors, questions){
                                callback(errors, questions);
                            })
                        },
                        function(callback){
                            db.query('SELECT * FROM type_questions', function(errors, type_questions){
                                callback(errors, type_questions);
                            })
                        },

                    ],
                    function (err, results) {

                        res.render('admin/pages', {
                            title: "Registration error",questions:results[0],id:req.body.id,type_questions:results[1],
                            errors: errors
                        })
                    }
                )
            }else{
                db.query("INSERT INTO questions (name, type_question_id, page_questionnaire_id) VALUES (?, ?, ?)", [name, type, id], function (error, results, fields) {
                    if (error) throw error;
                });
                res.redirect('/admin/page/'+id);
            }

        }

        if(req.params.type == 'answer'){

            req.checkBody('name', 'Name field required').notEmpty()

            const errors = req.validationErrors();
            if(errors){
                async.parallel(
                    [
                        function (callback) {
                            db.query('SELECT * FROM answers WHERE question_id = ?',[id], function(errors, answers){
                                callback(errors, answers);
                            })
                        }

                    ],
                    function (err, results) {
                        var data = {answers: results[0],id:req.body.id, errors: errors}
                        res.render('admin/answers', data)
                    }
                )
            }else{
                db.query("INSERT INTO answers (name, question_id) VALUES (?, ?)", [name, id], function (error, results, fields) {
                    if (error) throw error;
                });
                res.redirect('/admin/question/'+id);
            }


        }

    });

    //GET DELETE
    router.get('/delete/:type/:id',function(req, res, next){

        const db = require('../db.js');
        if(req.params.type == 'page'){
            db.query("DELETE FROM page_questionnaires WHERE id  = ?", [req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
        }
        if(req.params.type == 'questionnaire'){
            db.query("DELETE FROM questionnaires WHERE id  = ?", [req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
        }

        if(req.params.type == 'question'){
            db.query("DELETE FROM questions WHERE id  = ?", [req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
        }

        if(req.params.type == 'answer'){
            db.query("DELETE FROM answers WHERE id  = ?", [req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
        }
        res.redirect(req.get('referer'));
    });

    //GET EDIT
    router.get('/edit/:type/:id',function(req, res, next){

        const db = require('../db.js');

        if (req.params.type == 'page') {
            async.parallel(
                [
                    function (callback) {
                        db.query('SELECT * FROM page_questionnaires WHERE id = ?', [req.params.id], function (errors, results) {
                            callback(errors, results);
                        })
                    }

                ],
                function (err, results) {
                    var data = {results: results[0], references: req.params.type}
                    res.render('admin/edit', data)
                }
            )
        }

        if (req.params.type == 'questionnaire') {
            async.parallel(
                [
                    function (callback) {
                        db.query('SELECT * FROM questionnaires WHERE id = ?',[req.params.id], function(errors, results){
                            callback(errors, results);
                        })
                    }

                ],
                function (err, results) {
                    var data = {results: results[0], references: req.params.type}
                    res.render('admin/edit', data)
                }
            )
        }

        if (req.params.type == 'question') {
            async.parallel(
                [
                    function(callback){
                        db.query('SELECT * FROM questions WHERE id = ?',[req.params.id], function(errors, questions){
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
                    var data = {results: results[0],references: req.params.type, id:[req.params.id], type_questions: results[1]}
                    res.render('admin/edit', data)
                }
            )
        }

        if (req.params.type == 'answer') {
            async.parallel(
                [
                    function (callback) {
                        db.query('SELECT * FROM answers WHERE id = ?',[req.params.id], function(errors, results){
                            callback(errors, results);
                        })
                    }

                ],
                function (err, results) {
                    var data = {results: results[0], references: req.params.type}
                    res.render('admin/edit', data)
                }
            )
        }

    });

    //POST EDIT
    router.post('/edit-save/:type/:id',function(req, res, next){
        const db = require('../db.js');
        const name = req.body.name;
        const description = req.body.description;
        const type = req.body.type;

        if(req.params.type == 'page'){
            db.query("UPDATE page_questionnaires SET name=? WHERE id  = ?", [name,req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect(req.get('referer'));
        };

        if(req.params.type == 'questionnaire'){

            db.query("UPDATE questionnaires SET name=? , description=? WHERE id  = ?", [name, description,req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect(req.get('referer'));
        };

        if(req.params.type == 'question'){

            db.query("UPDATE questions SET name=? , type_question_id=? WHERE id  = ?", [name, type, req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect(req.get('referer'));
        };

        if(req.params.type == 'answer'){

            db.query("UPDATE answers SET name=? WHERE id  = ?", [name, req.params.id], function (error, results, fields) {
                if (error) throw error;
            });
            res.redirect(req.get('referer'));
        };

    });
}



