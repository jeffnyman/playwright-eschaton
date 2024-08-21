export interface Stats {
  totalTests: number;
  totalTestsExecuted: number;
  expectedPasses: number;
  unexpectedFailures: number;
  flakyPasses: number;
  skippedTests: number;
  executionDuration: number;
  totalDuration: number;
  averageDuration: number;
  formattedAverageDuration: string;
  formattedExecutionDuration: string;
  failureFree: boolean;
  failures: object;
  workers: number;
}

export type OutputFile = string;
export type InputTemplate = () => string;

/*
totalTests: Total number of tests in a given suite.
- A "suite" refers to a group of tests.
- In Playwright, each project has a suite of tests.
- That suite is made up of each test file in the project.
- A describe block also creates a test suite.
*/

/*
totalTestsExecuted: Total tests that were actually executed.
Retried tests can make this value larger than the totalTests.
*/

/*
expectedPasses: Total tests that finished as expected.
- Emphasizes the expected outcome.
unexpectedFailures: Total tests that did not finish as expected.
- Clearly indicates unexpected outcomes.
*/

/*
flakyPasses: Total number of tests that passed only when retried.
*/

/*
skippedTests: Total tests marked as skip() or fixme().
*/

/*
executionDuration: Total milliseconds sepnt running all the tests in a suite.
*/

/*
totalDuration: This refers to the total milliseconds spent running tests.
If tests run parallel with muiple works, this value would be larger than
the suite duration.
*/

/*
averageDuration: Average test duration of all tests in milliseconds.
*/

/*
formattedAverageDuration: Average test duration of all tests in mm:ss format.
*/

/*
formattedExecutionDuration: Duration to complete all tests in mm:ss format.
*/

/*
failureFree: True if the suite complets with all tests completing as expected.
This takes into account retries. So if retries passed, the suite is still not
failure free.
*/

/*
failures: An object that contains each test failure.
- Format is: { [test.title: result.status] }
- Retries with feailures will populate this object with multiple
- entires that show the same test.
*/

/*
workers: Total number of workers used to run a given suite.
*/
