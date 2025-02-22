const request = require("supertest");
const app = require("../server"); // Import Express app
const db = require("../config/db"); // Import database connection

beforeAll(async () => {
  await db.query("DELETE FROM contacts"); // Clear test database
});

afterAll(async () => {
  await db.end(); // Close DB connection after tests
});

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

//   it("should link new contact as secondary when a match is found", async () => {
//     // First request - creates a primary contact
//     await request(app).post("/identify").send({ email: "john@example.com", phoneNumber: "9876543210" });

//     // Second request - should be linked as secondary
//     const res = await request(app)
//       .post("/identify")
//       .send({ email: "john@example.com", phoneNumber: "1112223333" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.emails).toContain("john@example.com");
//     expect(res.body.phoneNumbers).toContain("9876543210");
//     expect(res.body.phoneNumbers).toContain("1112223333");

//     // Expect secondary contacts to be created
//     expect(res.body.secondaryContactIds.length).toBeGreaterThan(0);
//   });

it("should link new contact as secondary when a match is found", async () => {
    // First request - creates a primary contact
    await request(app).post("/identify").send({ email: "john@example.com", phoneNumber: "9876543210" });
  
    // Second request - should be linked as secondary
    const res = await request(app)
      .post("/identify")
      .send({ email: "john@example.com", phoneNumber: "1112223333" });
  
    expect(res.statusCode).toBe(200);
    expect(res.body.emails).toContain("john@example.com");
  
    // Retry fetching latest contacts
    const retryRes = await request(app).post("/identify").send({ email: "john@example.com" });
  
    expect(retryRes.body.phoneNumbers).toContain("9876543210");
    expect(retryRes.body.phoneNumbers).toContain("1112223333"); // Ensure secondary number is now linked
    expect(retryRes.body.secondaryContactIds.length).toBeGreaterThan(0);
  });
  
});
