// DOM elements
const gallery = document.getElementById('gallery');
const loadingIndicator = document.getElementById('loading');

// File type icons
const fileIcons = {
  'pdf': 'far fa-file-pdf',
  'doc': 'far fa-file-word',
  'docx': 'far fa-file-word',
  'xls': 'far fa-file-excel',
  'xlsx': 'far fa-file-excel',
  'ppt': 'far fa-file-powerpoint',
  'pptx': 'far fa-file-powerpoint',
  'txt': 'far fa-file-alt',
  'zip': 'far fa-file-archive',
  'default': 'far fa-file'
};

// Initialize gallery
function initGallery() {
  loadAllItems();
  setupLightboxEvents();
}

// Load all items
function loadAllItems() {
  gallery.innerHTML = '';
  loadingIndicator.style.display = 'block';

  database.ref('galleryItems').once('value').then(snapshot => {
    loadingIndicator.style.display = 'none';
    
    if (!snapshot.exists()) {
      gallery.innerHTML = '<p class="no-items">No files uploaded yet.</p>';
      return;
    }

    // Convert to array
    const items = [];
    snapshot.forEach(childSnapshot => {
      items.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    // Sort by timestamp (newest first)
    items.sort((a, b) => b.timestamp - a.timestamp);

    // Display all items
    items.forEach(item => createGalleryItem(item));

  }).catch(error => {
    console.error("Error loading items:", error);
    loadingIndicator.style.display = 'none';
    gallery.innerHTML = '<p class="error">Error loading files. Please refresh.</p>';
  });
}

// Create gallery item
function createGalleryItem(item) {
  const itemElement = document.createElement('div');
  itemElement.className = `gallery-item ${item.type}-item`;
  
  if (item.type === 'image') {
    itemElement.innerHTML = `
      <img src="${item.url}" alt="${item.name}" loading="lazy">
      <div class="item-overlay">
        <i class="fas fa-expand"></i>
      </div>
    `;
    itemElement.addEventListener('click', () => openLightbox(item));
  } 
  else if (item.type === 'video') {
    itemElement.innerHTML = `
      <video muted loop>
        <source src="${item.url}" type="video/mp4">
      </video>
      <div class="item-overlay">
        <i class="fas fa-play"></i>
      </div>
    `;
    itemElement.addEventListener('click', () => openLightbox(item));
  } 
  else {
    const fileExt = item.name.split('.').pop().toLowerCase();
    const iconClass = fileIcons[fileExt] || fileIcons['default'];
    
    itemElement.innerHTML = `
      <div class="file-icon">
        <i class="${iconClass}"></i>
        <span>${item.name}</span>
      </div>
      <a href="${item.url}" target="_blank" class="download-btn">
        <i class="fas fa-download"></i>
      </a>
    `;
  }
  
  gallery.appendChild(itemElement);
}

// Lightbox functions
function openLightbox(item) {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  
  lightboxContent.innerHTML = '';
  
  if (item.type === 'image') {
    lightboxContent.innerHTML = `
      <img src="${item.url}" class="lightbox-media" alt="${item.name}">
    `;
  } 
  else if (item.type === 'video') {
    lightboxContent.innerHTML = `
      <video controls autoplay class="lightbox-media">
        <source src="${item.url}" type="video/mp4">
      </video>
    `;
  }
  
  lightbox.style.display = 'block';
}

function setupLightboxEvents() {
  // Close button
  document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('lightbox').style.display = 'none';
    const video = document.querySelector('.lightbox-content video');
    if (video) video.pause();
  });
  
  // Close when clicking outside
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.style.display = 'none';
      const video = document.querySelector('.lightbox-content video');
      if (video) video.pause();
    }
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGallery);