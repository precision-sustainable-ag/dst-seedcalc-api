
module.exports = class Seed {

    static model(){
        return null;
    }
    
    static async data(){

        return [
            {}
        ];

    }

    static async plant(){

        const model = this.model();
        const data = await this.data();
        if (!model) return;
        model.register();
        for(let row of data){
            await model.create(row);
        }
        return data;

    }

}