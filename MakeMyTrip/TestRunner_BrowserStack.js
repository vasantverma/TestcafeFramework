const createTestCafe = require("testcafe");
const browsers = [
  //For Windows 10
  ['browserstack:Chrome@84.0:Windows 10','browserstack:Chrome@83.0:Windows 10'],
  ['browserstack:firefox@78.0:Windows 10','browserstack:firefox@77.0:Windows 10'],
  ['browserstack:edge@83.0:Windows 10','browserstack:edge@81.0:Windows 10'],
  //For macOS v10.15 and v10.13
  ['browserstack:safari@13.1:OS X Catalina','browserstack:chrome@83:OS X Catalina'],
  ['browserstack:safari@13.1:OS X High Sierra','browserstack:chrome@83:OS X High Sierra'],
  //For iOS v10 and iOS v13
  ['browserstack:iPhone 7','browserstack:iPhone 11'],
  //For andriod v9.0 and v10.0
  ['browserstack:Google Pixel 3 XL','browserstack:Google Pixel 4 XL']

];

const runTest = async browser => {
  console.log('starting tests');
  await createTestCafe()
    .then(tc => {
      testcafe = tc;
      const runner = testcafe.createRunner();

      return runner
        .src([
          './tests/LoginPageTest.js'
            ])
        .browsers(browser)
        .reporter('cucumber-json')
        .run({

            skipJsErrors: true,
            quarantineMode: false,
            selectorTimeout: 2000,
            assertionTimeout: 2000,
            pageLoadTimeout: 7000,
            speed:1,
        });
    })
    .then(async failedCount => {
      console.log('Tests failed: ' + failedCount);
      await testcafe.close();
      return;
    });
}

const runAllBrowsers = async () =>
{
   for (const browser of browsers)
   {
    console.log('Currently running testcases in :'+browser)
    await runTest(browser)
   }
}
runAllBrowsers()