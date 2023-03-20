const path = require('path');
const fs = require('fs');

const SRC_DIR_PATH = path.join(__dirname,'../../..');

function make_path(...paths){
    return path.join(...paths);
}

function get_file_extension(filename){
    return path.extname(filename).toLowerCase();
}

function app_path(...subpath){
    return path.join(SRC_DIR_PATH, ...subpath)
}

function storage_path(...subpath){
    return app_path('..','storage',...subpath);
}

function view(filepath){
    return app_path('views',filepath)
}


async function getFilesFrom(...subpath){
    const _dir = app_path(...subpath);

    return await new Promise((resolve, reject)=>{
        fs.readdir(_dir, (err, files) => {
            if(err) reject(err);
            resolve(files);
        });
    });
}

module.exports = {
    SRC_DIR_PATH, app_path, view, getFilesFrom, storage_path, get_file_extension,make_path
}