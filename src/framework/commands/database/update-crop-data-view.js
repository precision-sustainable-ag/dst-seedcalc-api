const {ModelsProvider} = require('../app/providers/ModelsProvider');


async function run(){
    const MIGRATIONS = await ModelsProvider.factory();
    
    
    for (let migration of Object.values(MIGRATIONS)) {
    
        await migration.sync({alter:true});
    
    }
}

run();

module.exports = {
    run
}