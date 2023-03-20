const { DatabaseProvider } = require('../../../../app/providers/DatabaseProvider');
const { Log } = require('../../../../app/providers/LoggingProvider');
const { CropsZonesService } = require('../../../../app/services/models/CropsZonesService');


class CropsZonesSeed {

    static model(){
        return null;
    }
    
    static async data(){
    }

    static async plant(){
        Log.Info({heading:'Seeding Crops Zones from Cover Crops Service.'});

        const service = new CropsZonesService(DatabaseProvider);

        await service.Sync();

    }

}

module.exports = {
    CropsZonesSeed
}