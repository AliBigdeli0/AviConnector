import { open_browser } from './browser.mjs'
import { Builder, By } from 'selenium-webdriver';

async function open_parameters() {
    const driver = await open_browser("time_view?well_id=2345415781"); 
    try { 
        let button = await driver.findElement(By.id("layer1_chart_1_settings"));
        await button.click();

        await driver.sleep(0xff);
        const  toggleButton = await driver.findElement(By.xpath('//*[@data-testid="parameters-list-test-toggle"]'));
        toggleButton.click();

        await driver.sleep(0xff);
        const editButton = await driver.findElement(By.xpath('//*[@data-testid="parameters-list-test-edit"]'));
        editButton.click();
        
        await driver.sleep(0xfffff);
    }
    finally { 
        await driver.quit();
    }
}

open_parameters();