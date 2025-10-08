from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the index.html file
        path = os.path.abspath('index.html')

        # Navigate to the local HTML file
        page.goto(f'file://{path}')

        # Wait for the language buttons to be visible
        english_button = page.get_by_role("button", name="English")
        expect(english_button).to_be_visible(timeout=10000)

        # Click the English button to trigger the animation
        english_button.click()

        # The most reliable way to wait is to check for the result of the transition.
        # The `transitionend` event creates the `.aureole` elements.
        # So, we will wait directly for the first aureole to become visible.
        # We'll give it a generous timeout to account for any system lag.
        first_aureole = page.locator(".aureole").first
        expect(first_aureole).to_be_visible(timeout=2000)

        # Give the aureole animation a moment to develop so the effect is clear in the screenshot
        page.wait_for_timeout(500)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification_fix.png")

        browser.close()

if __name__ == '__main__':
    run_verification()