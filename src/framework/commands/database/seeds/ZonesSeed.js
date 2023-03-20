const { DatabaseProvider } = require('../../../../app/providers/DatabaseProvider');
const { Log } = require('../../../../app/providers/LoggingProvider');
const { ZonesService } = require('../../../../app/services/models/ZonesService');


class ZonesSeed {

    static model(){
        return null;
    }
    
    static async data(){
    }

    static async plant(){
        Log.Info({heading:'Seeding Zones from Cover Crops Service.'});
       
        const service = new ZonesService(DatabaseProvider);

        await service.Sync();

    }

}

module.exports = {
    ZonesSeed
}