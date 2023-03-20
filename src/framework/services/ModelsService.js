const { Model } = require("../models/Model");


class ModelsService {

    static _model;
    static _rules;

    static model(){
        return Model;        
    }

    static Rules(){
        return {};
    }

    static async Sync(){
        const crops = await CoverCropsService.GetCrops();

        for(let crop of crops){
            await this.Add(crop);
        }
    }


    static getModel(){
        if(this._model) return this._model;

        const model = this.model();

        model.register();

        return this._model = model;
    }


    static getRules(){
        if(this._rules) return this._rules;

        return this._rules = this.Rules();
    }


    static Validate(data){
        const rules = this.getRules();
        return ValidatorProvider.factory().validate({data,rules});
    }



    async Add(data){
        data = CropsService.Validate(data);// redundant, but there is no point in moving forward with upsert if invalid payload. saves processing time.

        const record = await Crop.findOne({where:{id:data.id}, paranoid: false});

        if(!record){
            return this.Create(data);
        }

        return this.Update(record, data);
    }

    async Create(data) {
        data = CropsService.Validate(data);

        return Crop.create(data);
    }

    async Update(record, data) {
        data = CropsService.Validate(data);

        return record.update(data);
    }


}

module.exports = {
    CropsService
}