import { knex } from 'knex';

export default knex({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '123123',
        database: process.env.DB_NAME || 'messenger_test',
        insecureAuth: true
    }
});
