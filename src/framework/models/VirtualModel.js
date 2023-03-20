const { DatabaseProvider } = require('../../app/providers/DatabaseProvider');
const { Log } = require('../../app/providers/LoggingProvider');
const { Model } = require('./Model');
/**
 * For more information on sequelize attributes & options
 * please visit https://sequelize.org/docs/v6/core-concepts/model-basics/#column-options
 */
class VirtualModel extends Model {

   
    static async sync(){
        Log.Debug({heading:`Creating virtual table for ${this.name}`});
        const structure = this.structure();
        return DatabaseProvider.Service().query({sql:structure}).execute();
    }

    static async drop(){
        const table = this.getTableName();
        console.log('DROPING VIRTUAL MODEL:',table);
        const sql = `
            drop view if exists ${table};
        `;
        return DatabaseProvider.Service().query({sql}).execute();
    }


    static structure(){
        const table = this.getTableName();
        return `create or replace view ${table} as (select true)`;
    }

    static register(dbProvider){
        Log.Debug({heading:`Registering Model ${this.name}`})
        const attributes = this.attributes();
        const options = this.getOptions(dbProvider);
        this.init(attributes, options);

    }



}

module.exports = {
    VirtualModel
}