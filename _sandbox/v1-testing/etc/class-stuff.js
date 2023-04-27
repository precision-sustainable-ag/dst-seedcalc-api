

class Fact {

    constructor(T){
        if(T === 'a'){
            return new A(T);
        }
        if(T === 'b'){
            return new B(T);
        }
    }

    hi(){
        console.log('based');
    }

    init(){
        this.setVal('123');
    }

    setVal(x){
        this.val = x;
    }



}


class A extends Fact {

    constructor(T){
        super();
    }

    hi(){
        console.log('Yo');
    }

    init(){
        super.init();
    }

    getVal(){
        return this.val;
    }

}


class B extends Fact {

    constructor(T){
        super();
    }

    hi(){
        console.log('Bo');
    }

}


const f = new Fact('a');
f.hi();
f.init();
console.log('val:',f.getVal());
