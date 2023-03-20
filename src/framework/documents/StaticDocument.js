const {CLS:Document} = require('./Document');

const CLS = (E) => class extends Document(E) {

    static document(doc){
        const instance = new this();

        if(doc) return instance.setDocument(doc);

        if(instance._document) return instance.renderDocument();

        return instance._document = instance.buildDocument();
    }

}

const StaticDocument = CLS(Object);

module.exports = { StaticDocument, CLS }