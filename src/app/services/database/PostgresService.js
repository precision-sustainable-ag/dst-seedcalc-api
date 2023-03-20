const { Client } = require("pg");



class PostgresService {


    constructor(settings){

        this.settings = settings;
        this.queries = [];
        this.watching = {};
        this.client = null;
        this.listener = null;

    }

    getSSL(){
        if(this.settings?.dialectOptions){
            return this.settings.dialectOptions;
        }
        return {};
    }

    buildClient(database, settings){
        if(!settings) settings = this.settings;
        if(!database) database = settings.database;
        const ssl = this.getSSL();

        return new Client({
            user: settings.username,
            password: settings.password,
            host: settings.host,
            database: database,
            ...ssl
        });
    }

    async buildListener(database, settings){
        if(this.listener) return;

        this.listener = this.buildClient(database, settings);
        await this.listener.connect();

        const watching = this.watching;

        this.listener.on('notification', (msg) => {
            const channel = msg.channel;
            if(channel in watching){
                const callback = watching[channel];
                callback(msg);
            }
        })
    }

    async listen({channel, callback, database, settings}){
        if(!this.listener) this.buildListener(database, settings);

        await this.listener.query(`LISTEN ${channel}`);
        this.watching[channel] = callback;
    }

    open({client, database, settings}){
        if(this.client) return this.client

        if(!client) client = this.buildClient(database,settings);
        this.client = client;
        
        return this;
    }

    async execute(config={}){
        if(!this.client) this.open(config);

        const results = [];
        await this.client.connect();

        for(let query of this.queries){
            const result = await this.client.query(query.sql,query.params);
            const output = await query.resolver(result);
            results.push(output);
            if(output === false) break;
        }

        await this.client.end();
        this.client = null;
        this.queries = [];

        return results;
    }

    query({sql, params, resolver}){
        if(!params) params = [];
        if(!resolver) resolver = () => true;

        this.queries.push({
            sql, params, resolver
        });

        return this;
    }

    findExistingDatabase(database){

        const sql = `
            SELECT true 
            WHERE EXISTS (
                SELECT FROM pg_database WHERE datname = $1::text
            )`;
        

        return this.query({
            sql,
            params: [database],
            resolver: (result) => result.rowCount >=1
        });
    }

    createTriggers(){
        return this;
    }
    
    findNonExistingDatabase(database){

        const sql = `
            SELECT true 
            WHERE NOT EXISTS (
                SELECT FROM pg_database WHERE datname = $1::text
            )`;
        

        return this.query({
            sql,
            params: [database],
            resolver: (result) => result.rowCount >= 1
        });
    }

    createDatabase(database){

        const sql = `
            CREATE DATABASE ${database}
        `;

        return this.query({
            sql,
            params: [],
            resolver: (result) => true
        });
    }

    dropDatabase(database){

        const sql = `
            DROP DATABASE ${database}
        `;

        return this.query({
            sql,
            params: [],
            resolver: (result) => true
        });
    }



    createDatabaseIfNotExists(database){

        return this
            .findNonExistingDatabase(database)
            .createDatabase(database);

    }

        
    dropDatabaseIfExists(database){

        return this
            .findExistingDatabase(database)
            .dropDatabase(database);

    }

}


module.exports = {
    PostgresService
}