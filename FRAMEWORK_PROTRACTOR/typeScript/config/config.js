"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const protractor_1 = require("protractor");
const capabilities_1 = require("../support/capabilities");
const reporter_1 = require("../support/reporter");
const common_utils_1 = require("../util/common-utils");
const environment_1 = require("./environment");
const Specs = require("./specs");
const CONFLUENCE_PAGE_ID = '72848192';
const HEADLESS_CHROME_ARGS = ['--headless', '--disable-gpu', '--no-sandbox', '--disable-web-security', '--window-size=1920,1080'];
const NON_HEADLESS_CHROME_ARGS = ['--disable-gpu', '--no-sandbox', '--disable-web-security', '--window-size=1920,1080'];
const SELENIUM_GRID_ADDRESS = 'http://qloud.qvcdev.qvc.net:4444/wd/hub';
const LOCAL_SELENIUM_ADDRESS = 'http://localhost:4444/wd/hub';
const CHROME_ARGS = common_utils_1.CommonUtils.getRunMode() === 'NH' ? NON_HEADLESS_CHROME_ARGS : HEADLESS_CHROME_ARGS;
const SELENIUM_ADDRESS = common_utils_1.CommonUtils.getUseGridOption() ? SELENIUM_GRID_ADDRESS : LOCAL_SELENIUM_ADDRESS;
const SPEC_LIST = common_utils_1.CommonUtils.isRegressionBuild() ? Specs.E2E_SPECS : Specs.TEST_SPECS;
// Environment and properties
const ENV = new environment_1.Environment(common_utils_1.CommonUtils.getEnvironment());
const ENV_PROPERTIES = ENV.getEnvironmentProperties();
exports.config = {
    seleniumAddress: SELENIUM_ADDRESS,
    SELENIUM_PROMISE_MANAGER: false,
    baseUrl: ENV_PROPERTIES.baseUrl,
    multiCapabilities: capabilities_1.MultiCapabilitiesBuilder.buildMultiCapabilites(ENV_PROPERTIES.browserName, SPEC_LIST, CHROME_ARGS),
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    beforeLaunch: () => {
        reporter_1.Reporter.createDirectory();
    },
    onPrepare: () => __awaiter(void 0, void 0, void 0, function* () {
        yield protractor_1.browser.waitForAngularEnabled(false);
        console.log(yield protractor_1.browser.getCapabilities());
    }),
    afterLaunch: (exitCode) => {
        reporter_1.Reporter.createAndAttachReport(CONFLUENCE_PAGE_ID, common_utils_1.CommonUtils.isRegressionBuild() ? 'productcreation_REGRESSION' : 'productcreation');
    },
    cucumberOpts: {
        compiler: 'ts:ts-node/register',
        format: 'json:./reports/json/cucumber_report.json',
        require: ['../../typeScript/stepdefinitions/*.js', '../../typeScript/support/*.js'],
        strict: !common_utils_1.CommonUtils.isRegressionBuild(),
        tags: '@Smoke',
        retry: common_utils_1.CommonUtils.isRegressionBuild() ? 2 : 0
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
