import { Builder } from 'selenium-webdriver';

export async function open_browser() {
    const driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:9005');
    return driver;    
}





