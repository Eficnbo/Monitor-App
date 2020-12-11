import { superoak,assertEquals } from "../deps.js";
import { getSummary, getSummaryDay } from "../services/apiService.js";
import { app } from "../app.js"

//api serive function tests:

const apiTests = async() => {

Deno.test("getSummary returns something or empty list but not null", async() => {
    const result = await getSummary()
    if(result.length == 1) {
	    //undefined but not null 
    	assertEquals(typeof(result.mood),"undefined")
    }
    else {
    	assertEquals(result.length,0);
    }
});


Deno.test("getSummaryDay returns something or empty list but not null", async() => {
    const result = await getSummaryDay(2020,10,4)
    if(result.length == 1) {
            //undefined but not null
        assertEquals(typeof(result.mood),"undefined")
    }
    else {
        assertEquals(result.length,0);
    }
});


//runtime tests for api path:

Deno.test("GET request to /api/summary should work -> 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/summary").expect(200);
});

Deno.test("GET request to /api/summary/2020/10/4 should work -> 200", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/summary/2020/10/4").expect(200);
});

Deno.test("GET request to /api/summary/1111/11/1 wrong date format(year is too low must be over 2000) should return the error message)", async () => {
  const testClient = await superoak(app);
  await testClient.get("/api/summary/1111/11/1").expect("No data for given day, perhaps wrong formatting?");
});

}

export { apiTests }
