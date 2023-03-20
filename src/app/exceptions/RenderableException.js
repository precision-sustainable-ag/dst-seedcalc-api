
class RenderableException extends Error {

    constructor(){
        super();
        this.body = {}
        this.status = 500;
    }

    render(response){
        response
            .status(this.status)
            .send(this.body);
    }

}

module.exports =  {
    RenderableException
}