// const Setup = require('./Setup');
const request = require("supertest");
const { It, Expect } = require('./utilities');
const { JwtService } = require('../app/services/jwt/JwtService');

describe("GET /", () => {
    const app = process.testSetup.app;

    const req = () => new Promise((resolve, reject) => {
        resolve(request(app).get("/"));
    });

    It.ShouldReturnRetrieveResponse(req);

    it("should have some other attributes", async () => {
        await req().then(res => {
            expect(res).toBeTruthy();
        });
    });

});


