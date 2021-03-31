import { Given, Then, When, } from 'cucumber';
import { browser, ExpectedConditions, Key } from 'protractor';
import { config } from '../config/config';
import { SignUpPageObject } from '../pages/signUpPage';
import { expect } from '../support/expect';
import { CommonUtils } from '../util/common-utils';

const signUpTest: SignUpPageObject = new SignUpPageObject();
const FEATURE_NAME = 'signUpTest';


Given(/^I am on Automation Test Practice Page$/, { timeout: 15 * 1000 }, async () => {

    console.log("Landed on the home page");
        

});


When(/^I click create new account$/, { timeout: 15 * 1000 }, async () => {

    await signUpTest.clickSignInLink();
    //await signUpTest.clickcreateNewAccount();
        

});

When(/^I enter input to all fields$/, { timeout: 15 * 1000 }, async () => {

    await signUpTest.createNewUserAccount("rahul","nuguri","rahulnuguri@gmail.com");
    

});

Then(/^new user account should be created$/, { timeout: 15 * 1000 }, async () => {

    await console.log("successful");

});









