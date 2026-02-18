/**
 * ImageExporter - Handles PNG export with transparent background
 */

import { ButtonRenderer } from './canvas-renderer.js';

export class ImageExporter {
  /**
   * Export the current button as a transparent PNG
   */
  async export(state, filename = 'streamdeck-button') {
    // Create a temporary canvas for export at 2x resolution
    const exportCanvas = document.createElement('canvas');

    // Create a renderer for the export canvas at 2x (576x576 actual, 288x288 logical)
    const exportRenderer = new ButtonRenderer(exportCanvas, 288, 2);

    // Render with transparent background
    await exportRenderer.renderTransparent({
      buttonType: state.buttonType,
      icon: state.selectedIcon,
      text: state.text,
      textConfig: state.textConfig
    });

    // Convert to blob and download
    return new Promise((resolve, reject) => {
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = url;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          resolve();
        }, 100);
      }, 'image/png');
    });
  }

  /**
   * Generate a preview of the export (for debugging)
   */
  async getPreviewDataURL(state) {
    const exportCanvas = document.createElement('canvas');

    const exportRenderer = new ButtonRenderer(exportCanvas, 288, 2);

    await exportRenderer.renderTransparent({
      buttonType: state.buttonType,
      icon: state.selectedIcon,
      text: state.text,
      textConfig: state.textConfig
    });

    return exportCanvas.toDataURL('image/png');
  }
}
