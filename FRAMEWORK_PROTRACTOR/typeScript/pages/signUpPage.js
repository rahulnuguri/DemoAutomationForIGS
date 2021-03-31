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
exports.SignUpPageObject = void 0;
const protractor_1 = require("protractor");
class SignUpPageObject {
    constructor() {
        this.signInLink = protractor_1.element(protractor_1.by.xpath("//a[contains(text(),'Sign in')]"));
        this.emailInput = protractor_1.element(protractor_1.by.id('email_create'));
        this.createAccountButton = protractor_1.element(protractor_1.by.id('SubmitCreate'));
        this.firstName = protractor_1.element(protractor_1.by.id('customer_firstname'));
        this.lastName = protractor_1.element(protractor_1.by.id('customer_lastname'));
        this.submitButton = protractor_1.element(protractor_1.by.id('submitAccount'));
    }
    clickSignInLink() {
        return __awaiter(this, void 0, void 0, function* () {
            yield protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.signInLink));
            yield this.signInLink.click();
        });
    }
    clickcreateNewAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.createAccountButton));
            yield this.createAccountButton.click();
        });
    }
    setFirstName(firstName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.firstName));
            yield this.firstName.sendKeys(firstName);
        });
    }
    setLastName(lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.lastName));
            yield this.lastName.sendKeys(lastName);
        });
    }
    setEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.emailInput));
            yield this.emailInput.sendKeys(email);
        });
    }
    clicksubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield protractor_1.browser.wait(protractor_1.ExpectedConditions.visibilityOf(this.submitButton));
            yield this.submitButton.click();
        });
    }
    // public async setMobilenumber(mobileNumber: string) : Promise<void> {
    //     await browser.wait(ExpectedConditions.visibilityOf(this.mobileNumberInput));
    //     await this.mobileNumberInput.sendKeys(mobileNumber);
    // }
    // public async setbirthDate(birthDate: string) : Promise<void> {
    //     await browser.wait(ExpectedConditions.visibilityOf(this.birthDateInput));
    //     await this.birthDateInput.sendKeys(birthDate);
    // }
    // public async setPassword(Password: string) : Promise<void> {
    //     await browser.wait(ExpectedConditions.visibilityOf(this.passwordInput));
    //     await this.passwordInput.sendKeys(Password);
    // }
    // public async setConfirmPassword(ConfirmPassword: string) : Promise<void> {
    //     await browser.wait(ExpectedConditions.visibilityOf(this.confirmPasswordInput));
    //     await this.confirmPasswordInput.sendKeys(ConfirmPassword);
    // }
    // public async clickTerms() : Promise<void> {
    //     await browser.wait(ExpectedConditions.visibilityOf(this.termsAndConditionsCheckBox));
    //     await this.termsAndConditionsCheckBox.click();
    // }
    // public async clickAccountCreation() : Promise<void> {
    //     await browser.wait(ExpectedConditions.visibilityOf(this.accountCreationButton));
    //     await this.accountCreationButton.click();
    // }
    createNewUserAccount(firstName, lastName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clickSignInLink();
            yield protractor_1.browser.sleep(5000);
            yield this.setEmail(email);
            yield this.clickcreateNewAccount();
            yield protractor_1.browser.sleep(5000);
            yield this.setFirstName(firstName);
            yield this.setLastName(lastName);
            yield this.clicksubmit();
        });
    }
}
exports.SignUpPageObject = SignUpPageObject;
