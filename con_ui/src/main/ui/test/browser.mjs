import { Builder } from 'selenium-webdriver';
import  chrome from 'selenium-webdriver/chrome.js';

export async function open_browser(uri) {
    const options = new chrome.Options(); 
    options.addArguments("start-maximized");
    options.addArguments("--disable-infobars");
    
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    const completeUri = `http://localhost:9005/${uri === undefined ? "" : uri}`;

    await driver.get(completeUri);
    return driver;    
}





