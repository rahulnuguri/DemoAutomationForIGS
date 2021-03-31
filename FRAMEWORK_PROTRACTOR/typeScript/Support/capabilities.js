"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiCapabilitiesBuilder = void 0;
const CHROME_BROWSER = 'chrome';
const WINDOWS_OS = 'WINDOWS';
class ChromeMultiCapabilities {
    constructor(multiSpecs, chromeArgs) {
        this.capabilities = new Array();
        multiSpecs.forEach((specs) => {
            this.capabilities.push({
                browserName: CHROME_BROWSER,
                platform: WINDOWS_OS,
                chromeOptions: {
                    args: chromeArgs,
                },
                specs: specs,
            });
        });
    }
}
class MultiCapabilitiesBuilder {
    static buildMultiCapabilites(browserName, multiSpecs, chromeArgs) {
        if (browserName === CHROME_BROWSER && chromeArgs) {
            return this.buildChromeMultiCapabilities(multiSpecs, chromeArgs);
        }
        else {
            return [];
        }
    }
    static buildChromeMultiCapabilities(multiSpecs, chromeArgs) {
        return new ChromeMultiCapabilities(multiSpecs, chromeArgs).capabilities;
    }
}
exports.MultiCapabilitiesBuilder = MultiCapabilitiesBuilder;
