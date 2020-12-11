import { superoak,assertEquals } from "../deps.js";
import { isTodaySubmitted, days_between, calcAverage } from "../services/reportingService.js";

//reporting service functions tests:

const reportingFunctionTests = async() => {

Deno.test("days_between returns 0 when the two days are the same", async() => {
    const result = days_between(new Date(),new Date())
    assertEquals(result,0)
});

Deno.test("calcAverage should return 1 when the datalist is only 1", async() => {            
    const result = calcAverage([1])
    assertEquals(result,1)
});      

Deno.test("calcAverage should return 0 when the datalist is empty", async() => {
    const result = calcAverage([])
    assertEquals(result,0)
});

Deno.test("isTodaySubmitted should return false,false when submitting with an id that doesn't exist", async() => {
	const res = await isTodaySubmitted(9999999)
	assertEquals(res,[false,false])
})

}

export { reportingFunctionTests }


