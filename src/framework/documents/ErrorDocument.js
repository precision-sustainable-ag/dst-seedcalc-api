const {CLS:StaticDocument} = require('./StaticDocument');



class ErrorDocument extends StaticDocument(Error) { }

module.exports = {
    ErrorDocument
}