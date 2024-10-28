const { Logger } = require("./Logger");
const { Notify } = require("./Notifier");


class Toolbelt {

    static Notify = Notify;
    static Log = Logger;

    static async ProcessRows(rows, processorFunc, {steps, autoPrint=true, autoInc=true}={}){
        let index = 0;

        if(!steps) steps = rows.length;
        else Notify.step(`Total Steps: ${steps}`);

        const iterator = () => { return index += 1; };
        const printer = () => Notify.progress(index, steps);

        return new Promise(async (resolve, reject) => {
            for(let row of rows){
                if(autoInc === true){
                    iterator();
                }

                await processorFunc(row, iterator, printer);
                
                if(autoPrint === true) {
                    printer();
                }
            }
            return resolve(rows);
        });
    }

    static async sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

module.exports = { Toolbelt }