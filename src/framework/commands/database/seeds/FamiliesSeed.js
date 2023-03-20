const { DatabaseProvider } = require('../../../../app/providers/DatabaseProvider');
const { Log } = require('../../../../app/providers/LoggingProvider');
const { FamiliesService } = require('../../../../app/services/models/FamiliesService');


class FamiliesSeed {

    static model(){
        return null;
    }
    
    static async data(){
    }

    static async plant(){
        Log.Info({heading:'Seeding Families from Cover Crops Service.'});
        
        const service = new FamiliesService(DatabaseProvider);

        await service.Sync();

    }

}

module.exports = {
    FamiliesSeed
}