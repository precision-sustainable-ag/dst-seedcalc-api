
const {ModelsProvider:BaseModelsProvider} = require('../../framework/providers/ModelsProvider');
const { Log } = require('./LoggingProvider');
const { VirtualModel } = require('../../framework/models/VirtualModel');
const { Model } = require('../../framework/models/Model');


const MODELS = {};

class ModelsProvider extends BaseModelsProvider {
    
    /**
     * Define Sequelize Associations.
     * https://sequelize.org/docs/v6/core-concepts/assocs/#defining-the-sequelize-associations
     * @returns {void}
     */
    static async associations(){


    }

    /**
     * Register Virtual Models
     * @returns {Array<VirtualModel>} - Array of VirtualModel classes to register.
     */
    static virtuals(){
        return [
            
        ];
    }

    /**
     * !!THIS WILL OVERRIDE AUTO-REGISTRATION OF MODELS!!
     * if this array is not empty, then it MUST include ALL models that you want to register.                                                                                                                                                                                                           `
     * @returns {Array<Model>} - Array of Model classes to register. !!THIS WILL OVERRIDE AUTO-REGISTRATION OF MODEL!! 
     */ 
    static models(){
        return [ 

        ];
    }
    
}


module.exports = {
    ModelsProvider
}
