import { apiTests } from "./test_api.js"
import { pathTests } from "./test_controller.js"
import { reportingFunctionTests } from "./test_reportingService.js"

await apiTests()
await pathTests()
await reportingFunctionTests() 
