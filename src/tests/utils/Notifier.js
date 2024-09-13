
class Notify {

    static linebreak(){
        console.log('\n');
        return this;
    }

    static heading({context='###', message=''}={}){
        console.log(`[${context}] ${message}`);
        return this;
    }

    static step(msg){
        console.log(`- ${msg}`);
        return this;
    }

    static flat(msg){
        console.log(msg);
        return this;
    }

}

module.exports = { Notify }