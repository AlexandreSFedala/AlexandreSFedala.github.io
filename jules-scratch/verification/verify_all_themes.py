import asyncio
from playwright.async_api import async_playwright, expect
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        file_path = os.path.abspath('index.html')
        url = f'file://{file_path}'

        # --- Desktop Verification ---
        await page.set_viewport_size({"width": 1920, "height": 1080})
        await page.goto(url)
        # Clear local storage to ensure a clean start for the test
        await page.evaluate("localStorage.clear()")
        await page.reload()

        # Dismiss loader
        await page.locator('button[data-lang="en"]').click()
        await expect(page.locator('#loader-overlay')).to_be_hidden(timeout=10000)
        await expect(page.locator('#main-website-content')).to_be_visible(timeout=5000)

        # Desktop Light Theme
        await expect(page.locator('html')).to_have_attribute('data-theme', 'light')
        await page.screenshot(path="jules-scratch/verification/desktop-light.png")

        # Switch to Dark Theme
        await page.locator('#theme-switcher').click()
        await expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
        await page.wait_for_timeout(500) # Wait for transitions

        # Desktop Dark Theme
        await page.screenshot(path="jules-scratch/verification/desktop-dark.png")

        # --- Mobile Verification ---
        await page.set_viewport_size({"width": 375, "height": 667})
        # Go to the URL again; localStorage should persist the dark theme
        await page.goto(url)

        # Dismiss loader on mobile
        await page.locator('button[data-lang="en"]').click()
        await expect(page.locator('#loader-overlay')).to_be_hidden(timeout=10000)
        await expect(page.locator('#main-website-content')).to_be_visible(timeout=5000)

        # Mobile Dark Theme (should be persisted)
        await expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
        await page.screenshot(path="jules-scratch/verification/mobile-dark.png")

        # Switch to Light Theme
        await page.locator('#theme-switcher').click()
        await expect(page.locator('html')).to_have_attribute('data-theme', 'light')
        await page.wait_for_timeout(500) # Wait for transitions

        # Mobile Light Theme
        await page.screenshot(path="jules-scratch/verification/mobile-light.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())