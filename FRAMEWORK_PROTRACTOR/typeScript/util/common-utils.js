"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUtils = void 0;
const fs = require("fs");
class CommonUtils {
    static getDataForFeature(featureName, environment) {
        return JSON.parse(fs.readFileSync(`./data/${environment}/${featureName}.json`, CommonUtils.ENCODING));
    }
    static readFullFileSync(fileName) {
        const rawData = fs.readFileSync(fileName);
        const data = JSON.parse(rawData.toString());
        console.log(data);
        fs.closeSync(fileName);
        return data;
    }
    static readValueSync(fileName, key) {
        const rawData = fs.readFileSync(fileName);
        const data = JSON.parse(rawData.toString());
        const value = data[key];
        console.log('Key: ' + key + ', Value:' + value);
        return value;
    }
    static readValueAsync(fileName, key) {
        const totalContent = require(fileName);
        const value = totalContent[key];
        console.log('Key: ' + key + ', Value:' + value);
        return value;
    }
    static writeFileSync(fileName, sampleData) {
        const data = JSON.stringify(sampleData, null, 3);
        fs.writeFileSync(fileName, data);
    }
    static getEnvironment() {
        return CommonUtils.processArgs.get('--env');
    }
    static getRunMode() {
        return CommonUtils.processArgs.get('--run-mode');
    }
    static getUseGridOption() {
        return CommonUtils.processArgs.get('--use-grid') === 'true';
    }
    static isRegressionBuild() {
        return process.env.REGRESSION_BUILD === 'true';
    }
    static getProcessArgs() {
        const argsMap = new Map();
        return process.argv.slice(2).reduce(function (container, content) {
            const [key, value] = content.split('=');
            if (!container.get(key)) {
                container.set(key, value);
            }
            return container;
        }, argsMap);
    }
}
exports.CommonUtils = CommonUtils;
CommonUtils.ENCODING = 'utf8';
CommonUtils.processArgs = CommonUtils.getProcessArgs();
