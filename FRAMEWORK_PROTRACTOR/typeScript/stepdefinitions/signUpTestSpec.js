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
const signUpPage_1 = require("../pages/signUpPage");
const signUpTest = new signUpPage_1.SignUpPageObject();
const FEATURE_NAME = 'signUpTest';
cucumber_1.Given(/^I am on Automation Test Practice Page$/, { timeout: 15 * 1000 }, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Landed on the home page");
}));
cucumber_1.When(/^I click create new account$/, { timeout: 15 * 1000 }, () => __awaiter(void 0, void 0, void 0, function* () {
    yield signUpTest.clickSignInLink();
    //await signUpTest.clickcreateNewAccount();
}));
cucumber_1.When(/^I enter input to all fields$/, { timeout: 15 * 1000 }, () => __awaiter(void 0, void 0, void 0, function* () {
    yield signUpTest.createNewUserAccount("rahul", "nuguri", "rahulnuguri@gmail.com");
}));
cucumber_1.Then(/^new user account should be created$/, { timeout: 15 * 1000 }, () => __awaiter(void 0, void 0, void 0, function* () {
    yield console.log("successful");
}));
