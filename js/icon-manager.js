/**
 * IconManager - Manages icon libraries (Font Awesome & Material Symbols)
 */

/**
 * Font Awesome icon data
 * Curated list of commonly used icons
 */
const FONT_AWESOME_ICONS = [
  { name: 'home', char: '\uf015', keywords: 'house main menu' },
  { name: 'microphone', char: '\uf130', keywords: 'audio voice record' },
  { name: 'microphone-slash', char: '\uf131', keywords: 'mute audio off' },
  { name: 'music', char: '\uf001', keywords: 'song audio note' },
  { name: 'play', char: '\uf04b', keywords: 'start media video' },
  { name: 'pause', char: '\uf04c', keywords: 'stop media video' },
  { name: 'stop', char: '\uf04d', keywords: 'halt media video' },
  { name: 'video', char: '\uf03d', keywords: 'camera film' },
  { name: 'video-slash', char: '\uf4e2', keywords: 'camera off' },
  { name: 'camera', char: '\uf030', keywords: 'photo picture' },
  { name: 'image', char: '\uf03e', keywords: 'photo picture' },
  { name: 'volume-up', char: '\uf028', keywords: 'sound audio speaker' },
  { name: 'volume-down', char: '\uf027', keywords: 'sound audio quiet' },
  { name: 'volume-off', char: '\uf026', keywords: 'mute silent' },
  { name: 'volume-mute', char: '\uf6a9', keywords: 'silent sound off' },
  { name: 'cog', char: '\uf013', keywords: 'settings gear config' },
  { name: 'sliders', char: '\uf1de', keywords: 'controls settings adjust' },
  { name: 'power-off', char: '\uf011', keywords: 'shutdown off' },
  { name: 'wifi', char: '\uf1eb', keywords: 'network internet connection' },
  { name: 'signal', char: '\uf012', keywords: 'network bars connection' },
  { name: 'lightbulb', char: '\uf0eb', keywords: 'light idea lamp' },
  { name: 'sun', char: '\uf185', keywords: 'bright day light' },
  { name: 'moon', char: '\uf186', keywords: 'night dark' },
  { name: 'star', char: '\uf005', keywords: 'favorite rating' },
  { name: 'heart', char: '\uf004', keywords: 'love like favorite' },
  { name: 'bell', char: '\uf0f3', keywords: 'notification alert' },
  { name: 'bell-slash', char: '\uf1f6', keywords: 'mute notifications off' },
  { name: 'envelope', char: '\uf0e0', keywords: 'mail email message' },
  { name: 'comment', char: '\uf075', keywords: 'chat message bubble' },
  { name: 'comments', char: '\uf086', keywords: 'chat messages conversation' },
  { name: 'phone', char: '\uf095', keywords: 'call telephone' },
  { name: 'user', char: '\uf007', keywords: 'person profile account' },
  { name: 'users', char: '\uf0c0', keywords: 'people group team' },
  { name: 'user-plus', char: '\uf234', keywords: 'add person invite' },
  { name: 'search', char: '\uf002', keywords: 'find magnify lookup' },
  { name: 'check', char: '\uf00c', keywords: 'tick confirm yes ok' },
  { name: 'times', char: '\uf00d', keywords: 'close cancel x delete' },
  { name: 'plus', char: '\uf067', keywords: 'add create new' },
  { name: 'minus', char: '\uf068', keywords: 'remove subtract' },
  { name: 'arrow-up', char: '\uf062', keywords: 'direction navigate' },
  { name: 'arrow-down', char: '\uf063', keywords: 'direction navigate' },
  { name: 'arrow-left', char: '\uf060', keywords: 'direction back navigate' },
  { name: 'arrow-right', char: '\uf061', keywords: 'direction forward navigate' },
  { name: 'chevron-up', char: '\uf077', keywords: 'collapse up' },
  { name: 'chevron-down', char: '\uf078', keywords: 'expand down' },
  { name: 'chevron-left', char: '\uf053', keywords: 'back previous' },
  { name: 'chevron-right', char: '\uf054', keywords: 'next forward' },
  { name: 'bars', char: '\uf0c9', keywords: 'menu hamburger' },
  { name: 'ellipsis-v', char: '\uf142', keywords: 'more options menu' },
  { name: 'trash', char: '\uf1f8', keywords: 'delete remove bin' },
  { name: 'edit', char: '\uf044', keywords: 'pencil modify write' },
  { name: 'save', char: '\uf0c7', keywords: 'disk floppy' },
  { name: 'folder', char: '\uf07b', keywords: 'directory files' },
  { name: 'folder-open', char: '\uf07c', keywords: 'directory files' },
  { name: 'file', char: '\uf15b', keywords: 'document page' },
  { name: 'download', char: '\uf019', keywords: 'save arrow' },
  { name: 'upload', char: '\uf093', keywords: 'share arrow' },
  { name: 'share', char: '\uf064', keywords: 'send distribute' },
  { name: 'link', char: '\uf0c1', keywords: 'chain url hyperlink' },
  { name: 'lock', char: '\uf023', keywords: 'secure private password' },
  { name: 'unlock', char: '\uf09c', keywords: 'open access' },
  { name: 'eye', char: '\uf06e', keywords: 'view show visible' },
  { name: 'eye-slash', char: '\uf070', keywords: 'hide invisible' },
  { name: 'cloud', char: '\uf0c2', keywords: 'storage weather' },
  { name: 'calendar', char: '\uf133', keywords: 'date schedule event' },
  { name: 'clock', char: '\uf017', keywords: 'time watch' },
  { name: 'database', char: '\uf1c0', keywords: 'data storage' },
  { name: 'desktop', char: '\uf108', keywords: 'computer monitor screen' },
  { name: 'laptop', char: '\uf109', keywords: 'computer notebook' },
  { name: 'mobile', char: '\uf10b', keywords: 'phone smartphone' },
  { name: 'tablet', char: '\uf10a', keywords: 'ipad device' },
  { name: 'keyboard', char: '\uf11c', keywords: 'type input' },
  { name: 'mouse', char: '\uf8cc', keywords: 'pointer click' },
  { name: 'gamepad', char: '\uf11b', keywords: 'controller game' },
  { name: 'film', char: '\uf008', keywords: 'movie video reel' },
  { name: 'tv', char: '\uf26c', keywords: 'television screen' },
  { name: 'headphones', char: '\uf025', keywords: 'audio listen music' },
  { name: 'print', char: '\uf02f', keywords: 'printer output' },
  { name: 'chart-bar', char: '\uf080', keywords: 'graph statistics' },
  { name: 'chart-line', char: '\uf201', keywords: 'graph analytics' },
  { name: 'chart-pie', char: '\uf200', keywords: 'graph donut' },
  { name: 'fire', char: '\uf06d', keywords: 'flame hot burn' },
  { name: 'bolt', char: '\uf0e7', keywords: 'lightning flash electricity' },
  { name: 'rocket', char: '\uf135', keywords: 'launch spaceship' },
  { name: 'gift', char: '\uf06b', keywords: 'present box' },
  { name: 'trophy', char: '\uf091', keywords: 'award prize winner' },
  { name: 'flag', char: '\uf024', keywords: 'banner marker' },
  { name: 'map-marker', char: '\uf041', keywords: 'location pin' },
  { name: 'map', char: '\uf279', keywords: 'navigation location' },
  { name: 'compass', char: '\uf14e', keywords: 'direction navigation' },
];

/**
 * Material Symbols icon data
 * Curated list of commonly used icons
 */
const MATERIAL_SYMBOLS = [
  { name: 'home', char: 'home', keywords: 'house main menu' },
  { name: 'mic', char: 'mic', keywords: 'microphone audio voice' },
  { name: 'mic_off', char: 'mic_off', keywords: 'mute microphone audio' },
  { name: 'music_note', char: 'music_note', keywords: 'song audio sound' },
  { name: 'play_arrow', char: 'play_arrow', keywords: 'start media video' },
  { name: 'pause', char: 'pause', keywords: 'stop media video' },
  { name: 'stop', char: 'stop', keywords: 'halt media video' },
  { name: 'videocam', char: 'videocam', keywords: 'camera video record' },
  { name: 'videocam_off', char: 'videocam_off', keywords: 'camera video off' },
  { name: 'photo_camera', char: 'photo_camera', keywords: 'camera photo picture' },
  { name: 'image', char: 'image', keywords: 'photo picture' },
  { name: 'volume_up', char: 'volume_up', keywords: 'sound audio speaker' },
  { name: 'volume_down', char: 'volume_down', keywords: 'sound audio quiet' },
  { name: 'volume_off', char: 'volume_off', keywords: 'mute silent' },
  { name: 'volume_mute', char: 'volume_mute', keywords: 'silent sound off' },
  { name: 'settings', char: 'settings', keywords: 'config gear options' },
  { name: 'tune', char: 'tune', keywords: 'controls adjust sliders' },
  { name: 'power_settings_new', char: 'power_settings_new', keywords: 'shutdown off' },
  { name: 'wifi', char: 'wifi', keywords: 'network internet connection' },
  { name: 'signal_cellular', char: 'signal_cellular_alt', keywords: 'network bars connection' },
  { name: 'lightbulb', char: 'lightbulb', keywords: 'light idea lamp' },
  { name: 'wb_sunny', char: 'wb_sunny', keywords: 'sun bright day' },
  { name: 'nightlight', char: 'nightlight', keywords: 'moon night dark' },
  { name: 'star', char: 'star', keywords: 'favorite rating' },
  { name: 'favorite', char: 'favorite', keywords: 'heart love like' },
  { name: 'notifications', char: 'notifications', keywords: 'bell alert' },
  { name: 'notifications_off', char: 'notifications_off', keywords: 'bell mute off' },
  { name: 'mail', char: 'mail', keywords: 'email envelope message' },
  { name: 'chat', char: 'chat', keywords: 'message comment bubble' },
  { name: 'forum', char: 'forum', keywords: 'chat messages conversation' },
  { name: 'call', char: 'call', keywords: 'phone telephone' },
  { name: 'person', char: 'person', keywords: 'user profile account' },
  { name: 'group', char: 'group', keywords: 'people users team' },
  { name: 'person_add', char: 'person_add', keywords: 'add user invite' },
  { name: 'search', char: 'search', keywords: 'find magnify lookup' },
  { name: 'check', char: 'check', keywords: 'tick confirm yes ok' },
  { name: 'close', char: 'close', keywords: 'cancel x delete times' },
  { name: 'add', char: 'add', keywords: 'plus create new' },
  { name: 'remove', char: 'remove', keywords: 'minus subtract' },
  { name: 'arrow_upward', char: 'arrow_upward', keywords: 'up direction navigate' },
  { name: 'arrow_downward', char: 'arrow_downward', keywords: 'down direction navigate' },
  { name: 'arrow_back', char: 'arrow_back', keywords: 'left back navigate' },
  { name: 'arrow_forward', char: 'arrow_forward', keywords: 'right forward navigate' },
  { name: 'expand_less', char: 'expand_less', keywords: 'chevron up collapse' },
  { name: 'expand_more', char: 'expand_more', keywords: 'chevron down expand' },
  { name: 'chevron_left', char: 'chevron_left', keywords: 'back previous' },
  { name: 'chevron_right', char: 'chevron_right', keywords: 'next forward' },
  { name: 'menu', char: 'menu', keywords: 'hamburger bars' },
  { name: 'more_vert', char: 'more_vert', keywords: 'options menu dots' },
  { name: 'delete', char: 'delete', keywords: 'trash remove bin' },
  { name: 'edit', char: 'edit', keywords: 'pencil modify write' },
  { name: 'save', char: 'save', keywords: 'disk floppy' },
  { name: 'folder', char: 'folder', keywords: 'directory files' },
  { name: 'folder_open', char: 'folder_open', keywords: 'directory files open' },
  { name: 'description', char: 'description', keywords: 'file document page' },
  { name: 'download', char: 'download', keywords: 'save arrow' },
  { name: 'upload', char: 'upload', keywords: 'share arrow' },
  { name: 'share', char: 'share', keywords: 'send distribute' },
  { name: 'link', char: 'link', keywords: 'chain url hyperlink' },
  { name: 'lock', char: 'lock', keywords: 'secure private password' },
  { name: 'lock_open', char: 'lock_open', keywords: 'unlock access' },
  { name: 'visibility', char: 'visibility', keywords: 'eye view show' },
  { name: 'visibility_off', char: 'visibility_off', keywords: 'eye hide invisible' },
  { name: 'cloud', char: 'cloud', keywords: 'storage weather' },
  { name: 'calendar_today', char: 'calendar_today', keywords: 'date schedule event' },
  { name: 'schedule', char: 'schedule', keywords: 'clock time watch' },
  { name: 'storage', char: 'storage', keywords: 'database data' },
  { name: 'computer', char: 'computer', keywords: 'desktop monitor screen' },
  { name: 'laptop', char: 'laptop', keywords: 'computer notebook' },
  { name: 'smartphone', char: 'smartphone', keywords: 'mobile phone' },
  { name: 'tablet', char: 'tablet', keywords: 'ipad device' },
  { name: 'keyboard', char: 'keyboard', keywords: 'type input' },
  { name: 'mouse', char: 'mouse', keywords: 'pointer click' },
  { name: 'gamepad', char: 'gamepad', keywords: 'controller game' },
  { name: 'movie', char: 'movie', keywords: 'film video reel' },
  { name: 'tv', char: 'tv', keywords: 'television screen' },
  { name: 'headphones', char: 'headphones', keywords: 'audio listen music' },
  { name: 'print', char: 'print', keywords: 'printer output' },
  { name: 'bar_chart', char: 'bar_chart', keywords: 'graph statistics' },
  { name: 'show_chart', char: 'show_chart', keywords: 'graph analytics line' },
  { name: 'pie_chart', char: 'pie_chart', keywords: 'graph donut' },
  { name: 'local_fire_department', char: 'local_fire_department', keywords: 'fire flame hot' },
  { name: 'bolt', char: 'bolt', keywords: 'lightning flash electricity' },
  { name: 'rocket_launch', char: 'rocket_launch', keywords: 'rocket spaceship' },
  { name: 'card_giftcard', char: 'card_giftcard', keywords: 'gift present box' },
  { name: 'emoji_events', char: 'emoji_events', keywords: 'trophy award prize' },
  { name: 'flag', char: 'flag', keywords: 'banner marker' },
  { name: 'place', char: 'place', keywords: 'location pin marker' },
  { name: 'map', char: 'map', keywords: 'navigation location' },
  { name: 'explore', char: 'explore', keywords: 'compass direction navigation' },
];

export class IconManager {
  constructor() {
    this.currentLibrary = 'fontawesome';
    this.icons = FONT_AWESOME_ICONS;
  }

  /**
   * Switch between icon libraries
   */
  setLibrary(library) {
    this.currentLibrary = library;
    if (library === 'fontawesome') {
      this.icons = FONT_AWESOME_ICONS;
    } else if (library === 'material') {
      this.icons = MATERIAL_SYMBOLS;
    }
  }

  /**
   * Get all icons for current library
   */
  getAllIcons() {
    return this.icons;
  }

  /**
   * Search icons by name or keywords
   */
  searchIcons(query) {
    if (!query || query.trim() === '') {
      return this.icons;
    }

    const searchTerm = query.toLowerCase().trim();
    return this.icons.filter(icon => {
      return icon.name.toLowerCase().includes(searchTerm) ||
             icon.keywords.toLowerCase().includes(searchTerm);
    });
  }

  /**
   * Get icon data for rendering
   */
  getIconData(iconName) {
    const icon = this.icons.find(i => i.name === iconName);
    if (!icon) return null;

    if (this.currentLibrary === 'fontawesome') {
      return {
        type: 'fontawesome',
        fontFamily: 'Font Awesome 6 Free',
        character: icon.char,
        color: '#FFFFFF'
      };
    } else if (this.currentLibrary === 'material') {
      return {
        type: 'material',
        fontFamily: 'Material Symbols Outlined',
        character: icon.char,
        color: '#FFFFFF'
      };
    }
  }

  /**
   * Get default icon
   */
  getDefaultIcon() {
    return this.getIconData('home');
  }
}
