import os
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Get the absolute path to the index.html file
    file_path = os.path.abspath('index.html')

    # Go to the local file
    page.goto(f'file://{file_path}')

    # Wait for the loader to disappear and language buttons to be visible
    expect(page.locator('.language-button[data-lang="en"]')).to_be_visible(timeout=10000)
    expect(page.locator('.language-button[data-lang="fr"]')).to_be_visible()

    # Take a screenshot of the initial state (language selection)
    page.screenshot(path="jules-scratch/verification/01_language_selection.png")

    # Click the French language button
    page.locator('.language-button[data-lang="fr"]').click()

    # Wait for the main content to be visible and for a French text element to appear
    expect(page.locator('h2[data-lang-key="aboutMe"]')).to_have_text("Biographie", timeout=5000)

    # Add a short delay to allow for fade-in animations to complete
    page.wait_for_timeout(1000)

    # Take a screenshot of the page in French
    page.screenshot(path="jules-scratch/verification/02_french_language.png")

    browser.close()

with sync_playwright() as p:
    run_verification(p)

print("Verification script executed successfully.")