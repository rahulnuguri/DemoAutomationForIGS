import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';
import { config } from '../config/config';
import { expect } from '../Support/expect';

export class SignUpPageObject {
    
    public signInLink: ElementFinder;
    public emailInput: ElementFinder;
    public createAccountButton: ElementFinder;
    public firstName: ElementFinder;
    public lastName:ElementFinder;
    public submitButton:ElementFinder;

    constructor() {
        
        this.signInLink = element(by.xpath("//a[contains(text(),'Sign in')]"));
        this.emailInput = element(by.id('email_create'));
        this.createAccountButton = element(by.id('SubmitCreate'));
        this.firstName = element(by.id('customer_firstname'));
        this.lastName = element(by.id('customer_lastname'));
        this.submitButton = element(by.id('submitAccount'));
        

               
    }

    public async clickSignInLink() : Promise<void> {

        await browser.wait(ExpectedConditions.visibilityOf(this.signInLink));
        await this.signInLink.click();
    }

    public async clickcreateNewAccount() : Promise<void> {

        await browser.wait(ExpectedConditions.visibilityOf(this.createAccountButton));
        await this.createAccountButton.click();
    }



    public async setFirstName(firstName: string) : Promise<void> {

        await browser.wait(ExpectedConditions.visibilityOf(this.firstName));
        await this.firstName.sendKeys(firstName);


    }

    public async setLastName(lastName: string) : Promise<void> {

        await browser.wait(ExpectedConditions.visibilityOf(this.lastName));
        await this.lastName.sendKeys(lastName);


    }

    public async setEmail(email: string) : Promise<void> {

        await browser.wait(ExpectedConditions.visibilityOf(this.emailInput));
        await this.emailInput.sendKeys(email);


    }

    public async clicksubmit() : Promise<void> {

        await browser.wait(ExpectedConditions.visibilityOf(this.submitButton));
        await this.submitButton.click();
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


    public async createNewUserAccount(firstName: string,lastName: string,email: string) : Promise<void> {

        await this.clickSignInLink();
        await browser.sleep(5000);
        await this.setEmail(email);
        await this.clickcreateNewAccount();
        await browser.sleep(5000);
        await this.setFirstName(firstName);
        await this.setLastName(lastName);
        await this.clicksubmit();

    }

    
}
