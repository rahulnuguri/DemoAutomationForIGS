import { browser, Config } from 'protractor';
import { MultiCapabilitiesBuilder as MCB } from '../support/capabilities';
import { Reporter } from '../support/reporter';
import { CommonUtils } from '../util/common-utils';
import { Environment } from './environment';
import * as Specs from './specs';

const CONFLUENCE_PAGE_ID = '72848192';
const HEADLESS_CHROME_ARGS = ['--headless', '--disable-gpu', '--no-sandbox', '--disable-web-security', '--window-size=1920,1080'];
const NON_HEADLESS_CHROME_ARGS = ['--disable-gpu', '--no-sandbox', '--disable-web-security', '--window-size=1920,1080'];
const SELENIUM_GRID_ADDRESS = 'http://qloud.qvcdev.qvc.net:4444/wd/hub';
const LOCAL_SELENIUM_ADDRESS = 'http://localhost:4444/wd/hub';

const CHROME_ARGS = CommonUtils.getRunMode() === 'NH' ? NON_HEADLESS_CHROME_ARGS : HEADLESS_CHROME_ARGS;
const SELENIUM_ADDRESS = CommonUtils.getUseGridOption() ? SELENIUM_GRID_ADDRESS : LOCAL_SELENIUM_ADDRESS;
const SPEC_LIST = CommonUtils.isRegressionBuild() ? Specs.E2E_SPECS : Specs.TEST_SPECS;

// Environment and properties
const ENV = new Environment(CommonUtils.getEnvironment());
const ENV_PROPERTIES = ENV.getEnvironmentProperties();

export const config: Config = {
    seleniumAddress: SELENIUM_ADDRESS,
    SELENIUM_PROMISE_MANAGER: false,
    baseUrl: ENV_PROPERTIES.baseUrl,

   multiCapabilities: MCB.buildMultiCapabilites(ENV_PROPERTIES.browserName, SPEC_LIST, CHROME_ARGS),
 

    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),

    beforeLaunch: () => {
        Reporter.createDirectory();
    },

    onPrepare: async () => {
        await browser.waitForAngularEnabled(false);
        console.log(await browser.getCapabilities());
    },

    afterLaunch: (exitCode: number) => {
        Reporter.createAndAttachReport(CONFLUENCE_PAGE_ID, CommonUtils.isRegressionBuild() ? 'productcreation_REGRESSION' : 'productcreation');
    },

    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: 'json:./reports/json/cucumber_report.json',
        require: ['../../typeScript/stepdefinitions/*.js', '../../typeScript/support/*.js'],
        strict: !CommonUtils.isRegressionBuild(),
        tags: '@Smoke',
        retry: CommonUtils.isRegressionBuild() ? 2 : 0
    },

    dbConfig: {
        server: ENV_PROPERTIES.server,
        database: ENV_PROPERTIES.database,
        user: ENV_PROPERTIES.dbusername,
        password: ENV_PROPERTIES.dbpassword,
        port: ENV_PROPERTIES.port,
        options: {
            encrypt: false
        }
    },

    db2Config: {
        DATABASE: ENV_PROPERTIES.db2DataBase,
        HOSTNAME: ENV_PROPERTIES.db2HostName,
        UID: ENV_PROPERTIES.db2UID,
        PWD: ENV_PROPERTIES.db2PWD,
        PORT: ENV_PROPERTIES.db2Port,
        PROTOCOL: ENV_PROPERTIES.db2Protocol
    },

    application: {
        Username: ENV_PROPERTIES.username,
        Password: ENV_PROPERTIES.password,
        vendorPartyID: ENV_PROPERTIES.vendorPartyID,
        vendorOptionID: ENV_PROPERTIES.vendorOptionID,
        testData: ENV_PROPERTIES.testData
    }
};
