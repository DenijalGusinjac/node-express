/**
 * Created by denijalgusinjac on 12/01/2018.
 */
module.exports= {
    development:{
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'dbnode'
        },
        migrations:{
            directory:__dirname +'/db/migration'
        },
        seeds:{
            directory:__dirname +'/db/seeds'
        }
    }
}