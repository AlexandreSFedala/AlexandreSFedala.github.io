import os
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    # Increase the default timeout for the page
    page.set_default_timeout(60000)
    page.goto(f"file://{os.getcwd()}/index.html", wait_until="domcontentloaded")

    # Wait for the language buttons to be visible and click the English one
    english_button = page.locator('button[data-lang="en"]')
    expect(english_button).to_be_visible()
    english_button.click()

    # Wait for the main content to be visible, specifically the "About Me" column
    about_me_column = page.locator('section.column.aboutme')
    expect(about_me_column).to_be_visible()

    # Click the "About Me" column to activate it
    about_me_column.click()

    # Wait for the column to become active
    expect(about_me_column).to_have_class("column aboutme active")

    # Wait for the fade-in animation on the column content to complete
    page.wait_for_timeout(1000)

    # Now that the content is loaded, navigate the carousel
    next_button = page.locator('.carousel-arrow.next')

    # Click the "next" button three times to get to the certifications slide
    for i in range(3):
        expect(next_button).to_be_visible()
        # Force the click to bypass the actionability checks
        next_button.click(force=True)
        page.wait_for_timeout(500)  # Wait for slide animation

    # Final screenshot of the certifications slide
    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
