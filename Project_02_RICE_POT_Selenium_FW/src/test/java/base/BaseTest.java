package base;

import java.time.Duration;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.IOException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

public class BaseTest {
    protected WebDriver driver;
    protected Properties props;

    @BeforeTest
    public void setup() {
        try {
            props = new Properties();
            FileInputStream fis = new FileInputStream("src/test/resources/config.properties");
            props.load(fis);

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--remote-allow-origins=*");
            // Suppress CDP version warnings if possible
            System.setProperty("webdriver.chrome.silentOutput", "true");
            
            driver = new ChromeDriver(options);
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(60));
            driver.get(props.getProperty("url"));
        } catch (IOException e) {
            throw new RuntimeException("Configuration file missing or unreadable", e);
        } catch (Exception e) {
            throw new RuntimeException("Driver Initialization Failed", e);
        }
    }

    @AfterTest
    public void teardown() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception e) {
                System.err.println("Driver teardown failed: " + e.getMessage());
            }
        }
    }
}
