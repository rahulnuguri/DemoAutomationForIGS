Feature: SignUp Creation

    @Regression
    @Smoke
    Scenario: Verify Create New User Account
        Given I am on Automation Test Practice Page
        When I click create new account
        And  I enter input to all fields
        Then new user account should be created
