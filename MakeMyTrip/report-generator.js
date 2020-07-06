const report = require('multiple-cucumber-html-reporter');
const path = require('path');
const projectName = path.basename(__dirname);
const projectVersion = process.env.npm_package_version;
const reportGenerationTime = new Date().toISOString();
report.generate({
  reportName: 'TestCafe Report',
  jsonDir: 'cucumber-json-reports',
  reportPath: 'cucumber-json-reports/html',
  openReportInBrowser: true,
  disableLog: true,
  displayDuration: true,
  durationInMS: true,
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project Name', value: `${projectName}` },
      { label: 'Project URL', value:`https://www.makemytrip.com/` },
      { label: 'Test Environment', value: `QA` },
      { label: 'Report Generation Time', value: `${reportGenerationTime}` }
      
    ],
  },
});