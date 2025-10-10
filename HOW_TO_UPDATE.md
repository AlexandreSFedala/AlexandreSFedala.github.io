# How to Update Your Portfolio

This guide provides simple, step-by-step instructions for adding new projects, skills, and certifications to your portfolio. All content is managed in the `data/` directory.

**Important:** The portfolio supports both English (`en`) and French (`fr`). To keep your site consistent, you must add the new information to both the `en` and `fr` sections within each file.

---

## 1. How to Add a New Project

All project information is stored in `data/projects.js`.

1.  **Open the file:** `data/projects.js`
2.  **Find the projects list:** Inside the file, you'll see `en: [ ... ]` and `fr: [ ... ]`. These are the lists of your projects for each language.
3.  **Copy an existing project:** To ensure you have the correct format, copy an entire existing project block (from `{` to `}`).
4.  **Add a comma:** If you are adding the new project in the middle of the list, make sure there is a comma `,` after the closing brace `}` of the project before it.
5.  **Paste and edit:** Paste the copied block at the end of the list (before the closing `]`) and edit the following fields:

    *   `id`: A **unique** identifier for the project (e.g., `"project4"`). This is very important!
    *   `title`: The title of your project (e.g., `"New Bridge Design"`).
    *   `image`: The path to the project's thumbnail image (e.g., `"images/new-bridge.jpg"`).
    *   `alt`: A short description of the image for accessibility.
    *   `description`: An array of strings, where each string is a paragraph of the project description.
    *   `pdf`: (Optional) The path to the project's PDF file (e.g., `"pdfs/new-bridge-report.pdf"`).
    *   `pdfButtonText`: The text for the "View PDF" button.
    *   `downloadFile`: (Optional) The path to a downloadable file (like a .zip or .rvt).
    *   `downloadText`: The text for the download button.
    *   `skills`: A list of skills used in the project.
    *   `detailImage`: (Optional) The path to a larger image shown in the project detail view.
    *   `detailImageAlt`: A short description of the detail image.

6.  **Repeat for the other language:** Scroll down to the `fr` section and add the translated version of your new project.

---

## 2. How to Add a New Skill

All skill information is stored in `data/skills.js`.

1.  **Open the file:** `data/skills.js`
2.  **Choose a category:** Decide if the skill is `technical` or `soft`.
3.  **Add the skill:** In both the `en` and `fr` sections, add a new line in the chosen category's list with the following format:
    `{ name: "Your Skill Name", level: "SkillLevel" }`

    *   `name`: The name of the skill (e.g., `"Python"`).
    *   `level`: The skill level. Must be one of: `Basic`, `Intermediate`, or `Proficient`.

    **Example (adding a "Basic" skill to `technical`):**
    ```javascript
    technical: [
      { name: "AutoCAD", level: "Intermediate" },
      { name: "Structural Analysis", level: "Intermediate" },
      { name: "Python", level: "Basic" } // New skill added here
    ],
    ```
4.  **Remember to add a comma** after the preceding item in the list.

---

## 3. How to Add a New Certification

All certification information is stored in `data/certifications.js`.

1.  **Open the file:** `data/certifications.js`
2.  **Add the certification:** In both the `en` and `fr` sections, add a new object to the list with the following format:
    `{ img: "path/to/image.jpg", title: "Certification Title" }`

    *   `img`: The path to the certification image or logo.
    *   `title`: The name of the certification.

    **Example:**
    ```javascript
    en: [
      { img: "images/CAA-Approved-drone.jpg", title: "Certified Civil Aviation Authority (CAA) Drone Pilot" },
      { img: "images/new-cert.png", title: "New Certification Title" } // New certification
    ],
    ```
3.  **Remember to add a comma** after the preceding item in the list.

---

After saving your changes to the files, the website will automatically update with the new content the next time you load it. No other changes are needed!

---

## 4. How to Add a Project to the Map

To make a project appear on the interactive map, you need to add a `coordinates` property to its object in the `data/projects.js` file.

The `coordinates` property is an array of two numbers: `[latitude, longitude]`.

**Example:**

```javascript
{
  id: "project4",
  title: "New Project",
  // ... other properties
  coordinates: [51.5074, -0.1278] // Coordinates for London
}
```

You can use an online tool like [Google Maps](https://www.google.com/maps) to find the latitude and longitude for a specific location. Simply right-click on the map to get the coordinates.