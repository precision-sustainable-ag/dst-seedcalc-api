
const CLS = (E) => class extends E {

    static [Symbol.hasInstance](obj) {

        if (!(obj.document && typeof obj.document == 'function')) return false;
        if (!(obj.setDocument && typeof obj.setDocument == 'function')) return false;
        if (!(obj.buildDocument && typeof obj.buildDocument == 'function')) return false;
        if (!(obj.renderDocument && typeof obj.renderDocument == 'function')) return false;
        if (!(obj.buildParameters && typeof obj.buildParameters == 'function')) return false;
        if (!(obj.buildContent && typeof obj.buildContent == 'function')) return false;

        return true;
    }

    document(doc){
        if(doc) return this.setDocument(doc);

        if(this._document) return this.renderDocument();

        return this._document = this.buildDocument();
    }

    setDocument(doc){
        this._document = doc;
        return this;
    }

    buildDocument(){
        return {}
    }

    renderDocument(){
        return this._document;
    }


}

const Document = CLS(Object);

module.exports = { Document, CLS }