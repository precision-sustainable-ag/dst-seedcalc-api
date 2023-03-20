

class It {

    static ShouldReturnStatus(req, status){
        return it(`should return staus ${status}`, async () => {
            await req().then(res => {
                expect(res.statusCode).toBe(status);
            });
        });
    }

    static ShouldReturnObjectType(req,object){
        return it(`should return object property with value ${object}`, async () => {
            await req().then(res => {
                expect(res.body.object).toBeTruthy();
                expect(res.body.object).toBe(object);
            });
        });
    }


    static ShouldReturnMetaData(req, keys){
        return it("should return pagination meta data", async () => {
            await req().then(res => {
                expect(typeof res.body.meta).toBe('object');

                for(let key of keys){
                    expect(res.body.meta[key]).toBeTruthy();
                }

            });
        });
    }
    
    static ShouldReturnDataAsArray(req){
        return it("should return data as array", async () => {
            await req().then(res => {
                expect(res.body.data).toBeTruthy();
                expect(res.body.data instanceof Array);
            });
        });
    }

    static ShouldReturnDataAsObject(req){
        return it("should return data as array", async () => {
            await req().then(res => {
                expect(res.body.data).toBeTruthy();
                expect(typeof res.body.data).toBe('object');
            });
        });
    }

    static ShouldReturnPaginatedResponse(req){
        It.ShouldReturnStatus(req,200);
        It.ShouldReturnObjectType(req,'paginated');
        It.ShouldReturnMetaData(req,['page','limit','records','pages']);
        It.ShouldReturnDataAsArray(req);
    }

    static ShouldReturnRetrieveResponse(req){
        It.ShouldReturnStatus(req,200);
        It.ShouldReturnObjectType(req,'object');
        It.ShouldReturnDataAsObject(req);
    } 
}

class Expect {

    static DatabaseRecord(record) {
        expect(record.id).toBeTruthy();
        expect(record.createdAt).toBeTruthy();
        expect(record.updatedAt).toBeTruthy();
    }

    static CropRecord(record){
        Expect.DatabaseRecord(record);
        Expect.CropObject(record);
    }
    
    static CropObject(record){
        expect(record.label).toBeTruthy();
        expect(record.scientificName).toBeTruthy();
        expect(record.usdaSymbol).toBeTruthy();
    }

    static FamilyRecord(record){
        Expect.DatabaseRecord(record);
        Expect.FamilyObject(record);
    }

    static FamilyObject(record){
        expect(record.commonName).toBeTruthy();
        expect(record.scientificName).toBeTruthy();
    }

}


module.exports = {
    It, Expect
}