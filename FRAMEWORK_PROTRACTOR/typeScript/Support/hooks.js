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
const cucumber_1 = require("cucumber");
const protractor_1 = require("protractor");
const config_1 = require("../config/config");
// import { LogoutPageObject } from '../pages/logOutPage';
// import { LoginPageObject } from './../pages/loginPage';
//const loginPage: LoginPageObject = new LoginPageObject();
//const logoutPage: LogoutPageObject = new LogoutPageObject();
cucumber_1.Before({ timeout: 30 * 1000 }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield protractor_1.browser.get(config_1.config.baseUrl);
        //await loginPage.credentialLogin();
        //await browser.wait(ExpectedConditions.urlIs(config.baseUrl + '/#/product-maintenance'));
    });
});
cucumber_1.After({ timeout: 30 * 1000 }, function () {
    return __awaiter(this, void 0, void 0, function* () {
        // screenShot is a base-64 encoded PNG
        const screenShot = yield protractor_1.browser.takeScreenshot();
        this.attach(screenShot, 'image/png');
        //await logoutPage.attemptLogout();
        //await logoutPage.Logout();
    });
});
