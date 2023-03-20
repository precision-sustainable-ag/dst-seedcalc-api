const { Document } = require('../documents/Document');
const { Route } = require('./Route');


class Router extends Document {

    static [Symbol.hasInstance](obj) {

        if (obj.getRoutes) return true;
        return false;
    }

    static expose({path, routes, tags=[]}){
        return new this({path,routes,tags});
    }

    constructor({path, routes,tags=[]}){
        super()
        this.path = path;
        if(tags.length <= 0) this._tag = this.path.replace('/','');
        this.tags = tags;
        this.routes = routes;
    }

    tag(T){
        if(T) return this.setTag(T);
        return this._tag;
    }
    
    setTag(T){
        this._tag = T;
        return this;
    }

    getTags(){
        const tag = this.tag();
        const tags = this.tags;
        if(tag) tags.push(tag);
        return tags;
    }

    getRoutes(prefix=''){
        if(this.map) return this.map;
        const tags = this.getTags();
        let map = {};

        for(let route of this.routes){
            if(route instanceof Router){
                const subs = route.getRoutes(prefix + this.path);
                map = {
                    ...map,
                    ...subs
                }
            } else{
                let path = prefix + this.path + route.path;
                route.tag(tags);
                // remove trailing /
                if(path.slice(-1) == '/') path = path.slice(0,-1);
                if(!map[path]) map[path] = {};
                map[path][route.method] = route
            }
        }
        return this.map = map;
    }

    register(app){
        const routes = this.getRoutes();
        for(let [path,methods] of Object.entries(routes)){
            path = path.replaceAll('{',':').replaceAll('}','');
            for( let [method, route] of Object.entries(methods)){
                app[method](
                    path,
                    route.middleware(),
                    route.validate(),
                    route.handle(),
                    route.respond(),
                )

            }
        }
    }

    renderDocument(){
        if(this._renderedDocument) return this._renderedDocument

        return this._renderedDocument = this.buildDocument();
    }


    buildDocument(){
        const document = this._document ?? {};
        const routes = this.getRoutes();

        for(let [path, methods] of Object.entries(routes)) {

            if(!document[path]) document[path] = {};

            for(let [method, route] of Object.entries(methods)){

                if(!document[path][method]) document[path][method] = {};

                if(route.document()) document[path][method] = {
                    ...document[path][method],
                    ...route.document()
                }


            }
        }

        return document;
    }

}

module.exports = { Router }