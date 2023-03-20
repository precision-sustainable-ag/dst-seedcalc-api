const { DatabaseProvider } = require('../../../../app/providers/DatabaseProvider');
const { Log } = require('../../../../app/providers/LoggingProvider');
const { CoverCropsService } = require('../../../../app/services/apis/CoverCropsService');
const { CropsService } = require('../../../../app/services/models/CropsService');


class CropsSeed {

    static model(){
        return null;
    }
    
    static async data(){
    }

    static async plant(){
        Log.Info({heading:'Seeding Crops from Cover Crops Service.'});
        
        const service = new CropsService(DatabaseProvider);

        await service.Sync();

    }

}

module.exports = {
    CropsSeed
}