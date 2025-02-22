const request = require("supertest");
const app = require("../server"); 
const db = require("../config/db"); 

// Clears the database before testing
beforeAll(async () => {
  await db.query("DELETE FROM contacts");
});

afterAll(async () => {
  await db.end(); 
});

// Checks if the end-point properly inserts data or not
describe("POST /identify", () => {
  it("should create a new primary contact when no match is found", async () => {
    const res = await request(app)
      .post("/identify")
      .send({ email: "test@example.com", phoneNumber: "1234567890" });

    expect(res.statusCode).toBe(200);
    expect(res.body.primaryContactId).toBeDefined();
    expect(res.body.emails).toContain("test@example.com");
    expect(res.body.phoneNumbers).toContain("1234567890");
  });

// Checks how the data gets inserted if duplicate data is added
it("should link new contact as secondary when a match is found", async () => {
    await request(app).post("/identify").send({ email: "john@example.com", phoneNumber: "9876543210" });
  
    const res = await request(app)
      .post("/identify")
      .send({ email: "john@example.com", phoneNumber: "1112223333" });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.emails).toContain("john@example.com");
  
    const retryRes = await request(app).post("/identify").send({ email: "john@example.com" });
  
    expect(retryRes.body.phoneNumbers).toContain("9876543210");
    expect(retryRes.body.phoneNumbers).toContain("1112223333"); 
    expect(retryRes.body.secondaryContactIds.length).toBeGreaterThan(0);
  });
  
});
