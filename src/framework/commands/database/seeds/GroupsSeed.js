const { DatabaseProvider } = require('../../../../app/providers/DatabaseProvider');
const { Log } = require('../../../../app/providers/LoggingProvider');
const { GroupsService } = require('../../../../app/services/models/GroupsService');


class GroupsSeed {

    static model(){
        return null;
    }
    
    static async data(){
    }

    static async plant(){
        Log.Info({heading:'Seeding Groups from Cover Crops Service.'});
        
        const service = new GroupsService(DatabaseProvider);

        await service.Sync();

    }

}

module.exports = {
    GroupsSeed
}