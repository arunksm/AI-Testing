package tests;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pages.LoginPage;
import base.BaseTest;

public class LoginTests extends BaseTest {
    private LoginPage loginPage;

    @BeforeMethod
    public void initPage() {
        loginPage = new LoginPage(driver);
    }

    @Test(priority = 1)
    public void testInvalidLogin() {
        try {
            loginPage.doLogin(props.getProperty("invalid_username"), props.getProperty("invalid_password"));
            Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message not displayed for invalid login.");
            String errorText = loginPage.getErrorMessage();
            Assert.assertTrue(errorText.contains("check your username and password"),
                    "Unexpected error message: " + errorText);
        } catch (RuntimeException e) {
            Assert.fail("Invalid login test encountered an exception: " + e.getMessage());
        }
    }

    @Test(priority = 2)
    public void testValidLogin() {
        try {
            // Updated to use credentials from properties file
            loginPage.doLogin(props.getProperty("valid_username"), props.getProperty("valid_password"));
            
            // If the user hasn't provided valid credentials yet, this assertion might still fail,
            // but the framework is now structured correctly for when they do.
            Assert.assertFalse(loginPage.isErrorMessageDisplayed(), "Error message appeared for valid user.");
        } catch (RuntimeException e) {
            Assert.fail("Valid login test encountered an exception: " + e.getMessage());
        }
    }
}
