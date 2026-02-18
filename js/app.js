/**
 * Main Application
 * Stream Deck Icon Generator
 */

import { ButtonRenderer } from './canvas-renderer.js';
import { IconManager } from './icon-manager.js';
import { ImageExporter } from './export.js';

// Preview colors from the color palette
const PREVIEW_COLORS = {
  primary: '#3D5B58',
  secondary: '#373A36',
  positive: '#406B47',
  warning: '#892626',
  active: '#ebe717'
};

// Application state
const state = {
  buttonType: 'action',
  selectedIcon: null,
  text: 'Button',
  textConfig: {
    font: 'Roboto Condensed',
    size: 64,
    color: '#FFFFFF',
    alignment: 'center',
    bold: true
  },
  selectedPreviewColor: PREVIEW_COLORS.primary,
  iconLibrary: 'fontawesome'
};

// Global instances
let mainRenderer;
let thumbnailRenderers = [];
let iconManager;
let imageExporter;
let renderDebounceTimer;

/**
 * Initialize the application
 */
async function init() {
  // Wait for fonts to load
  await loadFonts();

  // Initialize components
  iconManager = new IconManager();
  imageExporter = new ImageExporter();

  // Set up main canvas renderer at 2x resolution
  const mainCanvas = document.getElementById('previewCanvas');
  mainRenderer = new ButtonRenderer(mainCanvas, 288, 2);

  // Set up thumbnail renderers at 2x resolution
  const thumbnailCanvases = document.querySelectorAll('.thumbnail');
  thumbnailCanvases.forEach(canvas => {
    const renderer = new ButtonRenderer(canvas, 96, 2);
    thumbnailRenderers.push({
      canvas: canvas,
      renderer: renderer,
      color: canvas.getAttribute('data-color')
    });
  });

  // Set default icon
  state.selectedIcon = iconManager.getDefaultIcon();

  // Set up event listeners
  setupEventListeners();

  // Populate icon grid
  populateIconGrid();

  // Initialize filename from default text
  updateFilenameFromText(state.text);

  // Initial render
  await renderAllPreviews();
}

/**
 * Load required fonts
 */
async function loadFonts() {
  try {
    await document.fonts.load('400 24px "Roboto Condensed"');
    await document.fonts.load('700 24px "Roboto Condensed"');
    await document.fonts.load('400 24px "Material Symbols Outlined"');
    await document.fonts.load('900 24px "Font Awesome 6 Free"');
    await document.fonts.ready;
  } catch (error) {
    console.warn('Font loading warning:', error);
  }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Button type toggle
  const buttonTypeButtons = document.querySelectorAll('#buttonTypeToggle button');
  buttonTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttonTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.buttonType = btn.getAttribute('data-type');
      debouncedRender();
    });
  });

  // Icon source toggle
  const iconSourceButtons = document.querySelectorAll('#iconSourceToggle button');
  iconSourceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      iconSourceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const source = btn.getAttribute('data-source');

      if (source === 'upload') {
        document.getElementById('iconLibrary').classList.add('hidden');
        document.getElementById('uploadArea').classList.remove('hidden');
      } else {
        document.getElementById('iconLibrary').classList.remove('hidden');
        document.getElementById('uploadArea').classList.add('hidden');

        state.iconLibrary = source;
        iconManager.setLibrary(source);
        populateIconGrid();

        // Set default icon for the new library
        state.selectedIcon = iconManager.getDefaultIcon();
        debouncedRender();
      }
    });
  });

  // Icon search
  const iconSearch = document.getElementById('iconSearch');
  iconSearch.addEventListener('input', (e) => {
    populateIconGrid(e.target.value);
  });

  // Icon upload
  const iconUpload = document.getElementById('iconUpload');
  iconUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        state.selectedIcon = {
          type: 'upload',
          dataURL: event.target.result,
          color: '#FFFFFF'
        };
        debouncedRender();
      };
      reader.readAsDataURL(file);
    }
  });

  // Text input
  const buttonText = document.getElementById('buttonText');
  buttonText.addEventListener('input', (e) => {
    state.text = e.target.value;
    updateFilenameFromText(state.text);
    debouncedRender();
  });

  // Text size
  const textSize = document.getElementById('textSize');
  const textSizeValue = document.getElementById('textSizeValue');
  textSize.addEventListener('input', (e) => {
    state.textConfig.size = parseInt(e.target.value);
    textSizeValue.textContent = e.target.value;
    debouncedRender();
  });

  // Color preview buttons
  const colorButtons = document.querySelectorAll('.color-btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedPreviewColor = btn.getAttribute('data-color');
      renderMainPreview();
    });
  });

  // Thumbnail click to change main preview color
  thumbnailRenderers.forEach(({ canvas, color }) => {
    canvas.addEventListener('click', () => {
      state.selectedPreviewColor = color;
      colorButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-color') === color);
      });
      renderMainPreview();
    });
  });

  // Export button
  const exportBtn = document.getElementById('exportBtn');
  exportBtn.addEventListener('click', async () => {
    const filename = document.getElementById('filename').value || 'streamdeck-button';
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';

    try {
      await imageExporter.export(state, filename);
      exportBtn.textContent = 'Exported!';
      setTimeout(() => {
        exportBtn.textContent = 'Export PNG (Transparent)';
        exportBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      exportBtn.textContent = 'Export Failed';
      setTimeout(() => {
        exportBtn.textContent = 'Export PNG (Transparent)';
        exportBtn.disabled = false;
      }, 2000);
    }
  });
}

/**
 * Update the filename input based on button text.
 */
function updateFilenameFromText(text) {
  const filenameInput = document.getElementById('filename');
  const sanitized = (text || '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim();

  if (!sanitized) {
    return;
  }

  const parts = sanitized.split(/\s+/);
  const camel = parts
    .map((part, index) => {
      const lower = part.toLowerCase();
      if (index === 0) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');

  filenameInput.value = `sd${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
}

/**
 * Populate the icon grid
 */
function populateIconGrid(searchQuery = '') {
  const iconGrid = document.getElementById('iconGrid');
  iconGrid.innerHTML = '';

  const icons = iconManager.searchIcons(searchQuery);

  icons.forEach(icon => {
    const iconItem = document.createElement('div');
    iconItem.className = 'icon-item';
    iconItem.title = icon.name;

    // Set icon content and styling based on library
    if (state.iconLibrary === 'fontawesome') {
      iconItem.innerHTML = icon.char;
      iconItem.classList.add('fa-icon');
    } else if (state.iconLibrary === 'material') {
      iconItem.textContent = icon.char;
      iconItem.classList.add('material-symbols-outlined');
    } else if (state.iconLibrary === 'lineicons') {
      iconItem.innerHTML = icon.char;
      iconItem.style.fontFamily = 'LineIcons';
    } else if (state.iconLibrary === 'bootstrap') {
      iconItem.innerHTML = icon.char;
      iconItem.style.fontFamily = 'bootstrap-icons';
    } else if (state.iconLibrary === 'ionicons') {
      iconItem.innerHTML = icon.char;
      iconItem.style.fontFamily = 'Ionicons';
    }

    // Highlight selected icon
    if (state.selectedIcon && state.selectedIcon.type === state.iconLibrary &&
        state.selectedIcon.character === icon.char) {
      iconItem.classList.add('selected');
    }

    iconItem.addEventListener('click', () => {
      state.selectedIcon = iconManager.getIconData(icon.name);
      if (state.selectedIcon) {
        state.selectedIcon.color = '#FFFFFF';
      }
      populateIconGrid(searchQuery); // Refresh to update selection
      debouncedRender();
    });

    iconGrid.appendChild(iconItem);
  });
}

/**
 * Render all preview canvases
 */
async function renderAllPreviews() {
  await renderMainPreview();
  await renderThumbnails();
}

/**
 * Render the main preview canvas
 */
async function renderMainPreview() {
  await mainRenderer.renderWithBackground({
    buttonType: state.buttonType,
    icon: state.selectedIcon,
    text: state.text,
    textConfig: state.textConfig
  }, state.selectedPreviewColor);
}

/**
 * Render all thumbnail previews
 */
async function renderThumbnails() {
  const renderPromises = thumbnailRenderers.map(async ({ renderer, color }) => {
    await renderer.renderWithBackground({
      buttonType: state.buttonType,
      icon: state.selectedIcon,
      text: state.text,
      textConfig: state.textConfig
    }, color);
  });

  await Promise.all(renderPromises);
}

/**
 * Debounced render - waits 150ms after last change
 */
function debouncedRender() {
  clearTimeout(renderDebounceTimer);
  renderDebounceTimer = setTimeout(() => {
    renderAllPreviews();
  }, 150);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
