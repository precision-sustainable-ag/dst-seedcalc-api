
const { getFilesFrom, app_path } = require('../helpers/path');
const { Log } = require('./LoggingProvider');
const {Provider} = require('./Provider');
const { VirtualModel } = require('../models/VirtualModel');


const MODELS = {};

class ModelsProvider extends Provider {

    static virtuals(){
        return [
        ];
    }

    static async associations(){

    }

    /**
     * overrides auto-resolver. if you use this function, you must list all models here.                                                                                                                                                                                                             `
     * @returns returns ordered list of models.
     */ 
    static models(){
        return [ 
        ];
    }

    static ignore(){
        return [
            'Associations',
        ];
    }

    static isVirtualModel(model){
        return (model.prototype instanceof VirtualModel);
    }

    static async getModels(){

        const models = this.models();

        if(models.length <= 0) return this.getModelsFromDir();

        return models;
    }

    static async getModelsFromDir(){

        const modelsDir = 'src/app/models';
        const modelFiles = await getFilesFrom(modelsDir);
        const models = [];
        const ignore = this.ignore();

        for(let file of modelFiles){
            const className = file.replace('.js','');
            if(ignore.includes(className)) continue;

            const module = require(app_path(`src/app/models/${file}`))
            const model = module[className] ?? module;
            models.push(model);
        }

        return models;
    }

    static async registerModel(model, dbProvider){

        // is this model already registered?
        if(model.getTable() in MODELS) return;

        /**
         * before we register this model,
         * we need to see if this model depends on another other models
         * via the references foreign key property.
         */
        const attributes = model.attributes();

        for(let [attribute, properties] of Object.entries(attributes) ){
            
            if(properties?.references){
                const parent = properties.references.model;
                // is this model already registered?
                if(parent.getTable() in MODELS) continue;
                // some models might reference themselves.
                if(parent.getTable() == model.getTable()) continue;
                // register parent model.
                await this.registerModel(parent,dbProvider);
            }
        }

        // register this model
        await model.register(dbProvider);
        // add model to models registry map.
        MODELS[model.getTable()] = model;
    }


    static async register(app, dbProvider){

        const models = await this.getModels();
        const virtuals = this.virtuals();

        // first register all models
        for(let model of models){
            await this.registerModel(model,dbProvider);
        }
        
        for(let model of virtuals){
            await this.registerModel(model,dbProvider);
        }

        await this.associations();

        Log.Info({message:Object.keys(MODELS),heading:'Registered Models'});

        return true;
    }

    static factory(dbProvider){
        if(Object.keys(MODELS).length <= 0){
            return new Promise((resolve, reject)=>{
                ModelsProvider.register(null,dbProvider)
                .then((registered)=>{resolve(MODELS)})
                .catch(err => reject(err));
            });
        }
        
        return {...MODELS};
    }

}


module.exports = {
    ModelsProvider
}
