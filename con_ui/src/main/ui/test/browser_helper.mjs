import { By } from 'selenium-webdriver';

export function get_with_testId(testId) { 
    return By.xpath(`//*[@data-testid="${testId}"]`);
}
