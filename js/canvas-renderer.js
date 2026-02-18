/**
 * ButtonRenderer - Handles canvas rendering for Stream Deck buttons
 */
export class ButtonRenderer {
  constructor(canvasElement, size = 288, scale = 2) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.size = size;
    this.scale = scale;
    this.margin = 42; // Margin from edges
    this.textAreaStart = size * 2/3; // Lower third starts at 192px

    // Set canvas to double resolution
    this.canvas.width = size * scale;
    this.canvas.height = size * scale;
    this.ctx.scale(scale, scale);

    // Icon size will be calculated dynamically based on text
    this.iconSize = 0;

    // Cache for loaded images
    this.imageCache = new Map();
  }

  /**
   * Render button with background color (for preview)
   */
  async renderWithBackground(options, backgroundColor) {
    // Fill with background color
    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.size, this.size);

    // Render the button on top
    await this.renderButton(options);
  }

  /**
   * Render button with transparent background (for export)
   */
  async renderTransparent(options) {
    // Clear to transparent
    this.ctx.clearRect(0, 0, this.size, this.size);

    // Render the button
    await this.renderButton(options);
  }

  /**
   * Core rendering logic
   */
  async renderButton(options) {
    // 1. Draw button base (Action/Info gradient)
    await this.drawBase(options.buttonType);

    // 2. Calculate text layout to determine icon size
    let textHeight = 0;
    let textLayout = null;
    if (options.text && options.text.trim() !== '') {
      textLayout = this.calculateTextLayout(options.text, options.textConfig);
      textHeight = textLayout.totalHeight;
    }

    // 3. Calculate icon size based on available space
    this.calculateIconSize(textHeight);

    // 4. Draw icon if present
    if (options.icon && options.icon.type) {
      await this.drawIcon(options.icon);
    }

    // 5. Draw text if present
    if (options.text && options.text.trim() !== '') {
      this.drawText(options.text, options.textConfig, textLayout);
    }
  }

  /**
   * Draw the button base image (Action or Info)
   */
  async drawBase(type) {
    const imagePath = type === 'action'
      ? 'assets/backgrounds/action-base.png'
      : 'assets/backgrounds/info-base.png';

    const img = await this.loadImage(imagePath);
    this.ctx.drawImage(img, 0, 0, this.size, this.size);
  }

  /**
   * Draw the icon (font icon or uploaded image)
   */
  async drawIcon(iconOptions) {
    const centerX = this.size / 2;

    // Position icon at top with margin
    const iconTop = this.margin;
    const iconCenterY = iconTop + this.iconSize / 2;

    if (iconOptions.type === 'upload' && iconOptions.dataURL) {
      // Render uploaded image - scale proportionally, don't stretch
      const img = await this.loadImageFromDataURL(iconOptions.dataURL);

      // Calculate scaled dimensions maintaining aspect ratio
      const imgAspect = img.width / img.height;
      let drawWidth, drawHeight;

      if (imgAspect > 1) {
        // Wider than tall
        drawWidth = this.iconSize;
        drawHeight = this.iconSize / imgAspect;
      } else {
        // Taller than wide or square
        drawHeight = this.iconSize;
        drawWidth = this.iconSize * imgAspect;
      }

      // Center the image within the icon space
      const drawX = centerX - drawWidth / 2;
      const drawY = iconCenterY - drawHeight / 2;

      this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else if (iconOptions.type === 'image' && iconOptions.path) {
      // Render file-based image (PNG/SVG)
      const img = await this.loadImage(iconOptions.path);
      const isSvg = iconOptions.path.toLowerCase().endsWith('.svg');
      const preserveColor = iconOptions.preserveColor === true;

      const imgAspect = img.width / img.height;
      let drawWidth, drawHeight;

      if (imgAspect > 1) {
        drawWidth = this.iconSize;
        drawHeight = this.iconSize / imgAspect;
      } else {
        drawHeight = this.iconSize;
        drawWidth = this.iconSize * imgAspect;
      }

      const drawX = centerX - drawWidth / 2;
      const drawY = iconCenterY - drawHeight / 2;

      if (isSvg && !preserveColor) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.ceil(drawWidth);
        tempCanvas.height = Math.ceil(drawHeight);
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.drawImage(img, 0, 0, drawWidth, drawHeight);
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, drawWidth, drawHeight);

        this.ctx.drawImage(tempCanvas, drawX, drawY, drawWidth, drawHeight);
      } else {
        this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
    } else {
      // Render font icon (fontawesome, material, lineicons, bootstrap, ionicons)
      const fontWeight = iconOptions.weight || '400';
      this.ctx.font = `${fontWeight} ${this.iconSize}px "${iconOptions.fontFamily}"`;
      this.ctx.fillStyle = iconOptions.color;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(iconOptions.character, centerX, iconCenterY);
    }
  }

  /**
   * Calculate icon size based on text height
   */
  calculateIconSize(textHeight) {
    // Available width (minus left and right margins)
    const availableWidth = this.size - (this.margin * 2); // 204px for 288px canvas

    // Top margin
    const topMargin = this.margin; // 42px

    // Bottom margin (tighter than top)
    const bottomMargin = 20;

    // Gap between icon and text
    const gapBetweenIconAndText = 5;

    if (textHeight === 0) {
      // No text - icon fills from top margin to bottom margin
      const availableHeight = this.size - topMargin - bottomMargin;
      this.iconSize = Math.min(availableWidth, availableHeight);
    } else {
      // With text: total = topMargin + iconSize + gap + textHeight + bottomMargin
      // Solve for iconSize: iconSize = total - topMargin - gap - textHeight - bottomMargin
      const availableHeightForIcon = this.size - topMargin - gapBetweenIconAndText - textHeight - bottomMargin;

      // Icon size is constrained by both width and available height
      this.iconSize = Math.min(availableWidth, availableHeightForIcon);

      // Ensure minimum icon size
      this.iconSize = Math.max(this.iconSize, 30);
    }
  }

  /**
   * Calculate text layout (lines and dimensions)
   */
  calculateTextLayout(text, config) {
    const fontWeight = config.bold ? '700' : '400';
    this.ctx.font = `${fontWeight} ${config.size}px "${config.font}"`;

    // Calculate available width for text (with margin matching icon)
    const maxWidth = this.size - (this.margin * 2);

    // Split text into lines (handle manual line breaks)
    const paragraphs = text.split('\n');
    const lines = [];

    // Word wrap each paragraph
    paragraphs.forEach(paragraph => {
      if (paragraph.trim() === '') {
        lines.push('');
        return;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = this.ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }
    });

    // Calculate line height (tighter spacing)
    const lineHeight = config.size * 1.05;
    const totalHeight = lines.length * lineHeight;

    return { lines, lineHeight, totalHeight };
  }

  /**
   * Draw text in the lower third with multi-line support
   */
  drawText(text, config, textLayout) {
    const fontWeight = config.bold ? '700' : '400';
    this.ctx.font = `${fontWeight} ${config.size}px "${config.font}"`;
    this.ctx.fillStyle = config.color;
    this.ctx.textAlign = config.alignment;
    this.ctx.textBaseline = 'alphabetic';

    // Get text layout (use provided if available)
    const { lines, lineHeight } = textLayout || this.calculateTextLayout(text, config);

    // Position text directly below the icon with minimal gap
    const iconBottom = this.margin + this.iconSize;
    const gapBetweenIconAndText = 5; // Minimal gap
    const startY = iconBottom + gapBetweenIconAndText + lineHeight * 0.8; // Adjust for baseline

    // Calculate X position based on alignment (use margin)
    let textX;
    switch (config.alignment) {
      case 'left':
        textX = this.margin;
        break;
      case 'right':
        textX = this.size - this.margin;
        break;
      case 'center':
      default:
        textX = this.size / 2;
        break;
    }

    // Draw each line
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      this.ctx.fillText(line, textX, y);
    });
  }

  /**
   * Load an image from a path with caching
   */
  async loadImage(path) {
    if (this.imageCache.has(path)) {
      return this.imageCache.get(path);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(path, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = path;
    });
  }

  /**
   * Load an image from a data URL
   */
  async loadImageFromDataURL(dataURL) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataURL;
    });
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.size, this.size);
  }
}
