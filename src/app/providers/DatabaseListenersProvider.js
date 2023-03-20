
const {Provider} = require('../../framework/providers/Provider');

class DatabaseListenersProvider extends Provider {


    static async register(app,dbProvider,watching){
        const config = dbProvider.getConfig();
        
        if(config.connection != 'postgres') return false;

        const service = dbProvider.Service();

        for(let event of watching){
            service.listen({channel:event.channel,callback: (payload) => event.handler(payload)})
        }

    }

    static factory(){
        return null;
    }

}


module.exports = {
    DatabaseListenersProvider
}
