
const fs = require('fs');
const path = require('path');
const { Notify } = require('./Notifier');

class Logger {

    static DIR_PATHS = ['.','logs'];

    static SetLogDir(...subs){
        Notify.heading({context:'LOG',message:'Setting Log Directory'});
        this.DIR_PATHS = [...this.DIR_PATHS, ...subs, this.TimeStamp()];
        Notify.flat(this.GetLogPath());
    }

    static GetLogPath(...subs){
        return path.join(...this.DIR_PATHS, ...subs);
    }

    static TimeStamp() {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed in JavaScript
        const dd = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours());
        const minutes = String(date.getMinutes());
        const seconds = String(date.getSeconds());
        return `${yyyy}-${mm}-${dd}_${hours}-${minutes}-${seconds}`;
    }
    
    static async WriteLogFile(filepath, obj){
        return new Promise((resolve, reject) => {
            const outputString = JSON.stringify(obj, null, 2);
        
            fs.writeFile(filepath, outputString, (err) => {
                if (err) return reject(err);
                return resolve(filepath);
            });
        });
    }
    
    static async MakeLogDirectory(...subs){
        const dirPath = this.GetLogPath(...subs)
        return new Promise((resolve, reject) => {
            fs.mkdir(dirPath, { recursive: true }, (error) => {
                if (error) {
                  return reject(error);
                }
                
                return resolve(dirPath);
    
              });
        });
    }
    
    static async WriteObject(subs, loggables={}){
        let dir;

        if(Array.isArray(subs)){
            dir = await this.MakeLogDirectory(...subs);
        } else {
            dir = await this.MakeLogDirectory(subs);
        }
        Notify.heading({context:'LOG',message:`Writting Container ${dir}`})
        for(let [filename, content] of Object.entries(loggables)){
            await this.WriteLogFile(path.join(dir,`${filename}.json`), content);
        }
        Notify.flat(`${dir} written to disk.`);
        return;
    }



}

module.exports = { Logger }