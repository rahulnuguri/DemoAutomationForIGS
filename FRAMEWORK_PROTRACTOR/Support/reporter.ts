import { execSync } from 'child_process';
import * as crypto from 'crypto-js';
import * as reporter from 'cucumber-html-reporter';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as moment from 'moment';

const jsonReports = path.join(process.cwd(), '/reports/json');
const htmlReports = path.join(process.cwd(), '/reports/html');
const confluenceUsername = 'QRG_CONFLUENCE_SOAPU';
const confluencePassword = crypto.AES.decrypt('U2FsdGVkX1+2RBAeWUiyIhY1xmylT6V2Zco9EA4WZf0=', '1234').toString(crypto.enc.Utf8);

const cucumberReporterOptions: reporter.Options = {
    jsonDir: jsonReports,
    output: `${htmlReports}/cucumber_report_${moment().format('YYYY-MM-DD_hh-mm-ss')}.html`,
    reportSuiteAsScenarios: true,
    theme: 'bootstrap',
    jsonFile: '',
    launchReport: false
};

export class Reporter {
    public static createDirectory(): void {
        try {
            fs.emptyDirSync(jsonReports);
            fs.emptyDirSync(htmlReports);
        } catch (err) {
            console.error(`Error creating report directory:\n${err.stack}`);
        }
    }

    public static createAndAttachReport(pageParentId: string, comment: string) {
        Reporter.createHTMLReport();
        Reporter.attachReport(pageParentId, comment);
    }

    public static attachReport(pageParentId: string, comment: string): void {
        const url = `https://confluence.qvcdev.qvc.net/rest/api/content/${pageParentId}/child/attachment`;
        const cmd = `curl -D- -u ${confluenceUsername}:${Reporter.sanitizedPassword()} -k -X POST -H X-Atlassian-Token:nocheck -F  file=@${cucumberReporterOptions.output} -F comment=${comment} ${url}`;
        try {
            execSync(cmd);

            // use this to debug confluence upload
            // execSync(cmd, { stdio: 'inherit' });
        } catch (err) {
            throw new Error('Failed to attach cucumber test results to Confluence.\nCaused by: ' + err.stack);
        }
    }

    public static createHTMLReport(): void {
        try {
            reporter.generate(cucumberReporterOptions);
        } catch (err) {
            throw new Error('Failed to save cucumber test results to html file.\nCaused by: ' + err.stack);
        }
    }

    private static sanitizedPassword(): string {
        if (process.env['OS'] && process.env['OS'].includes('Windows')) {
            return confluencePassword;
        } else {
            return confluencePassword.replace('$', '\\$').replace('#', '\\#');
        }
    }
}
