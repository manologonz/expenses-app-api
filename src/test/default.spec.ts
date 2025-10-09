import request from "supertest";
import app from "../api/app";

describe("GET /", function () {
    it("should respond with a welcome text", async function () {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.body.detail).toBeDefined();
        expect(response.body.detail).toEqual(
            "WelcomeEntity to the Node-Typescript API starter! :)"
        );
    });
});
