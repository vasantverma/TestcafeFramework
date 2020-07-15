const createTestCafe = require('testcafe');
let testcafe = null;

// createTestCafe('localhost', 1337, 1338)
createTestCafe()
    .then(tc => {
        testcafe     = tc;
         //create test runner for configuring and launching test tasks
        const runner = testcafe.createRunner();

    return runner

        //run test from specified folders/files
        .src([
             './tests/LoginPageTest.js'

        ])

        //configure the test runner to run tests in the specified browsers
        .browsers(['browserstack:Chrome@83.0:Windows 10'])
        .reporter('cucumber-json')
        .run({

            skipJsErrors: true,
            quarantineMode: false,
            selectorTimeout: 2000,
            assertionTimeout: 2000,
            pageLoadTimeout: 7000,
            speed:1,
        })
        
})

//if failed show in console log how many tests failed
.then(failedCount => {
    console.log('Tests failed: ' + failedCount);
    
    //stop testcafe server
    testcafe.close();
});