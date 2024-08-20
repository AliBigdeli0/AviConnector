
import { open_browser } from './browser.mjs';

async function run_home() {
    const driver = await open_browser();
    try { 
        await driver.sleep(0xfffff);
    }
    finally {
        await driver.quit();   
    }
}

run_home();