import { open_browser } from './browser.mjs'
import { get_with_testId } from './browser_helper.mjs';
import { Builder, By } from 'selenium-webdriver';

async function get_driver() { 
    return await open_browser("time_view?well_id=2345415781");
}

async function mouse_hover_numerics(driver) { 
    const numericToHover = await driver.findElement(get_with_testId('layer1_chart_1_settings_numerics'));
        

    const action = driver.actions({ bridge: true });
    await action.move({ origin: numericToHover }).perform(); 
}

async function open_parameters(elementName) {
    const driver = await get_driver(); 
    try { 
        await mouse_hover_numerics(driver);
        await driver.sleep(0xff);

        let button = await driver.findElement(By.id("layer1_chart_1_settings"));
        await button.click();
        await driver.sleep(0xff);

        const  toggleButton = await driver.findElement();
        toggleButton.click();
        await driver.sleep(0xff);

        const editButton = await driver.findElement(get_with_testId(elementName));
        editButton.click();
        
        await driver.sleep(0xfffff);
    }
    finally { 
        await driver.quit();
    }
}

async function open_normal() {
    try { 
        const driver =await  get_driver(); 
        await driver.sleep(0xfffff);
    }
    finally { 
        await driver.quit();
    }
}

async function open_others() { 
    const driver = await get_driver();
    try { 
        await mouse_hover_numerics(driver);
        await driver.sleep(0xff);

        const settingsButton = await driver.findElement(By.id("layer1_chart_1_settings"));
        await settingsButton.click();
        await driver.sleep(0xff);


        const othersTab = await driver.findElement(get_with_testId('layer1_chart_1_settings_others'));
        await othersTab.click();
        await driver.sleep(0xff);

        await driver.sleep(0xfffff);
    }
    finally { 
        await driver.quit();
    }
}

// edit button : parameters-list-test-0-edit
// delete button : parameters-list-test-0-delete
// add button : parameters-list-add
// open_parameters("parameters-list-add");
// open_normal();

open_others();