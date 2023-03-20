const { DatabaseProvider } = require('../../../../app/providers/DatabaseProvider');
const { Log } = require('../../../../app/providers/LoggingProvider');
const { RegionsService } = require('../../../../app/services/models/RegionsService');


class RegionsSeed {

    static model(){
        return null;
    }
    
    static async data(){
    }

    static async plant(){
        Log.Info({heading:'Seeding Regions from Cover Crops Service.'});
        
        const service = new RegionsService(DatabaseProvider);

        await service.Sync();

    }

}

module.exports = {
    RegionsSeed
}