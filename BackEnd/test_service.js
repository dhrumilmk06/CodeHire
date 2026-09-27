import { executeCode } from './src/services/codeExecutionService.js';

async function runTest() {
  console.log("🚀 Testing Code Execution Service...");
  
  const result = await executeCode(
    'console.log(42)', 
    'javascript', 
    [{ input: '', expectedOutput: '42' }]
  );

  console.log("\nResult:");
  console.log(JSON.stringify(result, null, 2));

  if (result.status === 'SUCCESS' && result.testCasesPassed === '1/1') {
    console.log("\n✅ Test Passed!");
  } else {
    console.log("\n❌ Test Failed. Check if Piston is running at http://localhost:2000");
  }
}

runTest();
