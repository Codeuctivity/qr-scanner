const { test, expect } = require('@playwright/test');

const expectedQrPayload =
    '_R1-AT1_4_ft3F472#245326_2021-08-09T13:54:09_0,00_0,00_0,00_0,00_11,10_+tJArYw=_4450931f_3ijIIGpGHa4=_H4C21Ns3YQ4UbW4SWA0aERPa8eOI82dwcWFTqg8jDnyAZAmauimGqlPjYKT0qe1AbWP46zFVe5CKhq+s3iOHKw==';

test('decodes a QR code from the fake camera stream', async ({ page }) => {
    const pageErrors = [];

    page.on('pageerror', (error) => {
        pageErrors.push(error.message);
    });

    await page.goto('/playwright/fixtures/qr-camera-harness.html');

    await page.waitForFunction(() => window.__scanState?.result || window.__scanState?.error);

    const scanState = await page.evaluate(() => window.__scanState);

    expect(scanState.error).toBeNull();
    expect(scanState.result).toBe(expectedQrPayload);
    expect(scanState.cornerPoints).toHaveLength(4);
    expect(pageErrors).toEqual([]);
});
