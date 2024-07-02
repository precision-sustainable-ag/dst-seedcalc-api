

const obj = {
    one: 'one',
    two: 'three'
}


class Obj {

    constructor(raw){
        for(let [key,value] of Object.entries(raw)){
            this[key] = value;
        }
    }
}



const inst = new Obj(obj);

console.log(inst.two);


const PROPS = {
    one: ['one'],
    two: [...this.one, 'two']
}

console.log(PROPS.two);