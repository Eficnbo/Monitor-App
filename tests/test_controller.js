import { superoak,assertEquals } from "../deps.js";
import { app } from "../app.js"

const pathTests = async() => {

//tests for the default root path '/' should be accessible by all and work:
Deno.test("GET request to / should work without login -> 200 with empty response body, meaning no error messages", async () => {
  const testClient = await superoak(app);
  await testClient.get("/").expect("");
});

//runtime tests for auth path:

Deno.test("GET request to /auth/login should work -> 200 with empty response body, meaning no error messages", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/login").expect("");
});

Deno.test("GET request to /auth/register should work -> 200, with empty response body, meaning no error messages", async () => {
  const testClient = await superoak(app);
  await testClient.get("/auth/registration").expect("");
});

Deno.test("POST request to /auth/register should not work with no data", async () => {
  const testClient = await superoak(app);
  await testClient.post("/auth/registration").expect(404);
});

Deno.test("POST request to /auth/login should  not work with no data-> 404", async () => {
  const testClient = await superoak(app);
  await testClient.post("/auth/login").expect(404);
});


//tests for reporting and summary:
Deno.test("GET request to /behavior/reporting should work and return empty response body(errors would return body)", async () => {
  const testClient = await superoak(app);
  await testClient.get("/behavior/reporting").expect("");
});

Deno.test("POST request to /behavior/reporting should not work with empty data", async () => {
  const testClient = await superoak(app);
  await testClient.post("/behavior/reporting").expect(404);
});


}

export { pathTests }
