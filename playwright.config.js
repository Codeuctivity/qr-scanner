const path = require('node:path');
const { devices } = require('@playwright/test');

const pathToCamFakeStream = path.resolve(
    __dirname,
    'playwright',
    'fixtures',
    'VideoOfQrCode.mjpeg',
);

/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
    testDir: './playwright',
    testMatch: '**/*.spec.js',
    timeout: 60 * 1000,
    retries: 0,
    workers: 1,
    reporter: 'list',
    use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
        headless: true,
        trace: 'retain-on-failure',
        permissions: ['camera'],
        launchOptions: {
            args: [
                '--use-fake-device-for-media-stream',
                '--use-fake-ui-for-media-stream',
                `--use-file-for-fake-video-capture=${pathToCamFakeStream}`,
            ],
        },
    },
    projects: [
        {
            name: 'chromium',
        },
    ],
    webServer: {
        command: 'node playwright\\support\\static-server.cjs',
        url: 'http://127.0.0.1:4173/playwright/fixtures/qr-camera-harness.html',
        reuseExistingServer: false,
        timeout: 30 * 1000,
    },
};
