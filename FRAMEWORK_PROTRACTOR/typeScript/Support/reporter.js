"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const child_process_1 = require("child_process");
const crypto = require("crypto-js");
const reporter = require("cucumber-html-reporter");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment");
const jsonReports = path.join(process.cwd(), '/reports/json');
const htmlReports = path.join(process.cwd(), '/reports/html');
const confluenceUsername = 'QRG_CONFLUENCE_SOAPU';
const confluencePassword = crypto.AES.decrypt('U2FsdGVkX1+2RBAeWUiyIhY1xmylT6V2Zco9EA4WZf0=', '1234').toString(crypto.enc.Utf8);
const cucumberReporterOptions = {
    jsonDir: jsonReports,
    output: `${htmlReports}/cucumber_report_${moment().format('YYYY-MM-DD_hh-mm-ss')}.html`,
    reportSuiteAsScenarios: true,
    theme: 'bootstrap',
    jsonFile: '',
    launchReport: false
};
class Reporter {
    static createDirectory() {
        try {
            fs.emptyDirSync(jsonReports);
            fs.emptyDirSync(htmlReports);
        }
        catch (err) {
            console.error(`Error creating report directory:\n${err.stack}`);
        }
    }
    static createAndAttachReport(pageParentId, comment) {
        Reporter.createHTMLReport();
        Reporter.attachReport(pageParentId, comment);
    }
    static attachReport(pageParentId, comment) {
        const url = `https://confluence.qvcdev.qvc.net/rest/api/content/${pageParentId}/child/attachment`;
        const cmd = `curl -D- -u ${confluenceUsername}:${Reporter.sanitizedPassword()} -k -X POST -H X-Atlassian-Token:nocheck -F  file=@${cucumberReporterOptions.output} -F comment=${comment} ${url}`;
        try {
            child_process_1.execSync(cmd);
            // use this to debug confluence upload
            // execSync(cmd, { stdio: 'inherit' });
        }
        catch (err) {
            throw new Error('Failed to attach cucumber test results to Confluence.\nCaused by: ' + err.stack);
        }
    }
    static createHTMLReport() {
        try {
            reporter.generate(cucumberReporterOptions);
        }
        catch (err) {
            throw new Error('Failed to save cucumber test results to html file.\nCaused by: ' + err.stack);
        }
    }
    static sanitizedPassword() {
        if (process.env['OS'] && process.env['OS'].includes('Windows')) {
            return confluencePassword;
        }
        else {
            return confluencePassword.replace('$', '\\$').replace('#', '\\#');
        }
    }
}
exports.Reporter = Reporter;
