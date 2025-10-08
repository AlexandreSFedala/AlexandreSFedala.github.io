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

        # Wait for the first aureole to become visible. This is a reliable signal
        # that the button's slide transition has completed.
        first_aureole = page.locator(".aureole").first
        expect(first_aureole).to_be_visible(timeout=2000)

        # Give the aureole animation a moment to develop so the effect is clear
        page.wait_for_timeout(500)

        # Take a screenshot to verify the final state
        page.screenshot(path="jules-scratch/verification/verification_stabilized.png")

        browser.close()

if __name__ == '__main__':
    run_verification()