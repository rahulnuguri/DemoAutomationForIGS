const CHROME_BROWSER: string = 'chrome';
const WINDOWS_OS: string = 'WINDOWS';

interface ChromeCapabilites {
    browserName: string;
    platform: string;
    chromeOptions: {
        args: string[];
    };
    specs: string[];
}

class ChromeMultiCapabilities {
    capabilities: Array<ChromeCapabilites>;

    constructor(multiSpecs: string[][], chromeArgs: string[]) {
        this.capabilities = new Array<ChromeCapabilites>();
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

export class MultiCapabilitiesBuilder {
    public static buildMultiCapabilites(browserName: string, multiSpecs: string[][], chromeArgs?: string[]): any[] {
        if (browserName === CHROME_BROWSER && chromeArgs) {
            return this.buildChromeMultiCapabilities(multiSpecs, chromeArgs);
        } else {
            return [];
        }
    }

    public static buildChromeMultiCapabilities(multiSpecs: string[][], chromeArgs: string[]): any[] {
        return new ChromeMultiCapabilities(multiSpecs, chromeArgs).capabilities;
    }
}
