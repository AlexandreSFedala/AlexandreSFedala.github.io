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

        # Wait for the `.selected` class to be applied, which changes the position to absolute.
        # This is a reliable signal that the transition has started.
        expect(english_button).to_have_css("position", "absolute", timeout=2000)

        # The transition itself takes 0.6s. We'll add a buffer and wait for it to complete.
        page.wait_for_timeout(800)

        # Now, we can safely look for the first aureole.
        first_aureole = page.locator(".aureole").first
        expect(first_aureole).to_be_visible()

        # Give the aureole animation a moment to develop for the screenshot
        page.wait_for_timeout(500)

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == '__main__':
    run_verification()