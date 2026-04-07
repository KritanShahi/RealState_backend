import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";

describe("RealState API end-to-end", () => {
  let propertyId = 0;
  const testEmail = `e2e_${Date.now()}@example.com`;
  const testPassword = "password123";
  const testName = "E2E Buyer";

  beforeAll(async () => {
    await prisma.favourite.deleteMany();
    await prisma.user.deleteMany({
      where: { email: { contains: "e2e_" } }
    });

    const property = await prisma.property.create({
      data: {
        title: "E2E Property",
        location: "Test City",
        price: 150000
      }
    });
    propertyId = property.id;
  });

  afterAll(async () => {
    await prisma.favourite.deleteMany();
    await prisma.user.deleteMany({
      where: { email: { contains: "e2e_" } }
    });
    await prisma.property.deleteMany({
      where: { id: propertyId }
    });
    await prisma.$disconnect();
  });

  it("GET /health returns ok", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("POST /auth/register creates user", async () => {
    const response = await request(app).post("/auth/register").send({
      name: testName,
      email: testEmail,
      password: testPassword
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(testEmail);
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("POST /auth/register blocks duplicate email", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Duplicate",
      email: testEmail,
      password: testPassword
    });

    expect(response.status).toBe(409);
  });

  it("POST /auth/login rejects wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "wrong-password"
    });

    expect(response.status).toBe(401);
  });

  it("GET /me rejects unauthenticated user", async () => {
    const response = await request(app).get("/me");
    expect(response.status).toBe(401);
  });

  it("auth flow + protected endpoints + favourites flow works", async () => {
    const agent = request.agent(app);

    const login = await agent.post("/auth/login").send({
      email: testEmail,
      password: testPassword
    });
    expect(login.status).toBe(200);

    const me = await agent.get("/me");
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(testEmail);

    const properties = await agent.get("/properties");
    expect(properties.status).toBe(200);
    expect(Array.isArray(properties.body)).toBe(true);
    expect(properties.body.some((item: { id: number }) => item.id === propertyId)).toBe(true);

    const addFavourite = await agent.post(`/favourites/${propertyId}`);
    expect(addFavourite.status).toBe(201);

    const duplicateFavourite = await agent.post(`/favourites/${propertyId}`);
    expect(duplicateFavourite.status).toBe(409);

    const favourites = await agent.get("/favourites");
    expect(favourites.status).toBe(200);
    expect(Array.isArray(favourites.body)).toBe(true);
    expect(favourites.body.some((item: { id: number }) => item.id === propertyId)).toBe(true);

    const removeFavourite = await agent.delete(`/favourites/${propertyId}`);
    expect(removeFavourite.status).toBe(200);

    const removeAgain = await agent.delete(`/favourites/${propertyId}`);
    expect(removeAgain.status).toBe(404);

    const logout = await agent.post("/auth/logout");
    expect(logout.status).toBe(200);
  });

  it("favourites endpoints reject unauthenticated access", async () => {
    const list = await request(app).get("/favourites");
    expect(list.status).toBe(401);

    const add = await request(app).post(`/favourites/${propertyId}`);
    expect(add.status).toBe(401);

    const remove = await request(app).delete(`/favourites/${propertyId}`);
    expect(remove.status).toBe(401);
  });
});
