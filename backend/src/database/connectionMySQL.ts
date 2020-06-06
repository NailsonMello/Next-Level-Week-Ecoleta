import Knex from 'knex'

const connection = Knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'nlw'
    },
    useNullAsDefault: true,
})

export default connection