import * as crypto from 'crypto-js';

export interface EnvironmentProperties {
    baseUrl: string;
    username: string;
    password: string;
    browserName: string;
    server: string;
    database: string;
    dbusername: string;
    dbpassword: string;
    port: number;
    vendorPartyID: string;
    vendorOptionID: string;
    testData: string;
    db2DataBase: string;
    db2HostName: string;
    db2UID: string;
    db2PWD: string;
    db2Port: number;
    db2Protocol: string;
}

export class Environment {
    private readonly environmentProps: EnvironmentProperties;

    constructor(env: string) {
        switch (env.toUpperCase()) {
            case 'QA':
                this.environmentProps = {
                    baseUrl: 'https://automationpractice.com/index.php',
                    username: 'kalyan.kumar@idp.com',
                    password: 'IGSigs@123',
                    //password: crypto.AES.decrypt('U2FsdGVkX1/gK7U5tJyIS/LV0+6rivfJqR0iz0np2Go=', '1234').toString(crypto.enc.Utf8),
                    browserName: 'chrome',
                    server: 'sqllist2004',
                    database: 'ProductCreation',
                    dbusername: 'Prdcreatea',
                    dbpassword: crypto.AES.decrypt('U2FsdGVkX1/LHtSmTeIsbLX0g6XcC20NkaKEuBhdqaU=', '2345').toString(crypto.enc.Utf8),
                    port: 1433,
                    vendorPartyID: '213875',
                    vendorOptionID: '1170',
                    testData: 'qa',
                    db2DataBase: 'LOCDBA0',
                    db2HostName: 'WASACC.qvcdev.qvc.net',
                    db2UID: 'PDMSIA',
                    db2PWD: 'MANSO#93',
                    db2Port: 447,
                    db2Protocol: 'TCPIP'
                };
                break;
            case 'DEV':
                this.environmentProps = {
                    baseUrl: 'https://automationpractice.com/index.php',
                    username: 'ProdCreateBuyingOfficeAdminUser-QA',
                    password: crypto.AES.decrypt('U2FsdGVkX1/gK7U5tJyIS/LV0+6rivfJqR0iz0np2Go=', '1234').toString(crypto.enc.Utf8),
                    browserName: 'chrome',
                    server: 'U01VDAAWDBS0006',
                    database: 'ProductCreation_int',
                    dbusername: 'pcpapp',
                    dbpassword: crypto.AES.decrypt('U2FsdGVkX18fBc3c2L5ZgJZLXXNtCskyHadG6KKOLFA=', '2345').toString(crypto.enc.Utf8),
                    port: 1433,
                    vendorPartyID: '1545550',
                    vendorOptionID: '1063',
                    testData: 'dev',
                    db2DataBase: 'LOCDBI0',
                    db2HostName: 'z800b.qvcdev.qvc.net',
                    db2UID: 'PDMISI',
                    db2PWD: 'LOLSG#79',
                    db2Port: 446,
                    db2Protocol: 'TCPIP'
                };
                break;
            case 'LOCAL':
                this.environmentProps = {
                    baseUrl: 'https://automationpractice.com/index.php',
                    // baseUrl: "https://10.102.27.24:16338/product-create/",
                    username: 'ProdCreateBuyingOfficeAdminUser-QA',
                    password: crypto.AES.decrypt('U2FsdGVkX1/gK7U5tJyIS/LV0+6rivfJqR0iz0np2Go=', '1234').toString(crypto.enc.Utf8),
                    browserName: 'chrome',
                    server: 'U01VDAAWDBS0006',
                    database: 'ProductCreation_int',
                    dbusername: 'pcpapp',
                    dbpassword: crypto.AES.decrypt('U2FsdGVkX18fBc3c2L5ZgJZLXXNtCskyHadG6KKOLFA=', '2345').toString(crypto.enc.Utf8),
                    port: 1433,
                    vendorPartyID: '1545550',
                    vendorOptionID: '1063',
                    testData: 'dev',
                    db2DataBase: 'LOCDBI0',
                    db2HostName: 'z800b.qvcdev.qvc.net',
                    db2UID: 'PDMISI',
                    db2PWD: 'LOLSG#79',
                    db2Port: 446,
                    db2Protocol: 'TCPIP'
                };
                break;
        }
    }

    public getEnvironmentProperties(): EnvironmentProperties {
        return this.environmentProps;
    }
}
