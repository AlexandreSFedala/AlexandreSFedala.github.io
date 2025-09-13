<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Portfolio</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      color: #333;
    }

    /* Navigation Bar */
    nav {
      background: #2c3e50;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem 1.5rem;
      flex-wrap: wrap;
    }
    nav .logo {
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      margin: 0;
      padding: 0;
    }
    nav ul li a {
      color: white;
      text-decoration: none;
      font-weight: 500;
    }
    nav ul li a:hover {
      text-decoration: underline;
    }

    header {
      background: #34495e;
      color: white;
      padding: 1rem;
      text-align: center;
    }

    .container {
      max-width: 1000px;
      margin: 2rem auto;
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .item {
      display: flex;
      gap: 20px;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .item img {
      width: 30%;
      border-radius: 8px;
    }
    .caption {
      width: 30%;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
    }
    .text {
      flex: 1;
      width: 70%;
    }

    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }

    iframe {
      width: 100%;
      height: 600px;
      border: none;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .item img, .caption, .text {
        width: 100%;
      }
      nav {
        flex-direction: column;
        align-items: flex-start;
      }
      nav ul {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
      }
    }
  </style>
</head>
<body>

  <!-- Navigation Bar -->
  <nav>
    <a href="#" class="logo">MyPortfolio</a>
    <ul>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#pdfs">PDFs</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>

  <!-- Header -->
  <header>
    <h1>Welcome to My GitHub Page</h1>
    <p>Pictures, descriptions, and integrated PDFs</p>
  </header>

  <!-- Main Content -->
  <div class="container" id="projects">
    <section class="item">
      <div>
        <img src="example.jpg" alt="Example Image">
        <div class="caption">This is an image caption</div>
      </div>
      <div class="text">
        <h2>Project Title</h2>
        <p>
          This is a description of your project. You can include 
          <a href="https://example.com" target="_blank">hyperlinks</a> 
          to external resources here.
        </p>
      </div>
    </section>
  </div>

  <div class="container" id="pdfs">
    <h2>View or Download My PDF</h2>
    <p>
      You can view the PDF below or 
      <a href="example.pdf" download>download it here</a>.
    </p>
    <iframe src="example.pdf"></iframe>
  </div>

  <div class="container" id="contact">
    <h2>Contact</h2>
    <p>
      Feel free to reach out via 
      <a href="mailto:your-email@example.com">email</a> 
      or connect on 
      <a href="https://linkedin.com" target="_blank">LinkedIn</a>.
    </p>
  </div>

</body>
</html>
