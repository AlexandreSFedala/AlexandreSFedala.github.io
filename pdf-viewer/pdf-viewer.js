// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get('file');
const pdfTitle = urlParams.get('title') || 'Document';

// Set document title
document.getElementById('pdf-title').textContent = pdfTitle;

// PDF rendering variables
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let canvas = document.getElementById('pdf-canvas');
let ctx = canvas.getContext('2d');

// Show loading state
document.getElementById('pdf-loading').style.display = 'flex';
document.getElementById('pdf-canvas').style.display = 'none';

// Load PDF document
pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
    pdfDoc = pdf;
    document.getElementById('page-count').textContent = pdf.numPages;
    
    // Hide loading, show canvas
    document.getElementById('pdf-loading').style.display = 'none';
    document.getElementById('pdf-canvas').style.display = 'block';
    
    // Render first page
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error loading PDF:', error);
    document.getElementById('pdf-loading').innerHTML = 
        '<p>Error loading document. Please <a href="' + pdfUrl + '" download>download the PDF</a> instead.</p>';
});

// Function to render a page
function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);
        
        renderTask.promise.then(function() {
            pageRendering = false;
            
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
            
            document.getElementById('page-num').textContent = num;
        });
    });
    
    updatePagination();
}

// Check and update pagination buttons
function updatePagination() {
    document.getElementById('prev-page').disabled = (pageNum <= 1);
    document.getElementById('next-page').disabled = (pageNum >= pdfDoc.numPages);
}

// Go to previous page
function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

// Go to next page
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

// Queue page rendering
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

// Zoom in
function zoomIn() {
    scale += 0.25;
    queueRenderPage(pageNum);
}

// Zoom out
function zoomOut() {
    if (scale > 0.5) {
        scale -= 0.25;
        queueRenderPage(pageNum);
    }
}

// Set up event listeners
document.getElementById('prev-page').addEventListener('click', onPrevPage);
document.getElementById('next-page').addEventListener('click', onNextPage);
document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);
document.getElementById('download-pdf').addEventListener('click', function() {
    window.open(pdfUrl, '_blank');
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        onPrevPage();
    } else if (e.key === 'ArrowRight') {
        onNextPage();
    } else if (e.key === '+' || e.key === '=') {
        zoomIn();
    } else if (e.key === '-' || e.key === '_') {
        zoomOut();
    }
});