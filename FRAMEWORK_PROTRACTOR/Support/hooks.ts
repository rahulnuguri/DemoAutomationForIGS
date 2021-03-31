import { After, Before } from 'cucumber';
import { browser, ExpectedConditions } from 'protractor';
import { config } from '../config/config';
// import { LogoutPageObject } from '../pages/logOutPage';
// import { LoginPageObject } from './../pages/loginPage';

//const loginPage: LoginPageObject = new LoginPageObject();
//const logoutPage: LogoutPageObject = new LogoutPageObject();

Before({ timeout: 30 * 1000 }, async function () {
    await browser.get(config.baseUrl);
    //await loginPage.credentialLogin();
    //await browser.wait(ExpectedConditions.urlIs(config.baseUrl + '/#/product-maintenance'));
});

After({ timeout: 30 * 1000 }, async function () {
    // screenShot is a base-64 encoded PNG
    const screenShot = await browser.takeScreenshot();
    this.attach(screenShot, 'image/png');
    //await logoutPage.attemptLogout();
    //await logoutPage.Logout();
});
