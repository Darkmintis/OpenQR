import QRCodeLib from 'qrcode'
import { QRCodeOptions, ExportOptions } from '@/types/qr'

// Define proper TypeScript types for the QRCodeLib methods
type QRLibOptions = Record<string, unknown>;

export class QRCodeGenerator {
  // Maximum capacity in characters (approximate) for different modes
  static readonly CAPACITY_MAP = {
    L: { // Low error correction
      numeric: 7089,
      alphanumeric: 4296,
      byte: 2953,
    },
    M: { // Medium error correction
      numeric: 5596,
      alphanumeric: 3391,
      byte: 2331,
    },
    Q: { // Quartile error correction
      numeric: 3993,
      alphanumeric: 2420,
      byte: 1663,
    },
    H: { // High error correction
      numeric: 3057,
      alphanumeric: 1852,
      byte: 1273,
    }
  }

  // Check if input is purely numeric
  static isNumeric(text: string): boolean {
    return /^\d+$/.test(text)
  }

  // Check if input is alphanumeric according to QR code spec
  static isAlphanumeric(text: string): boolean {
    return /^[0-9A-Z $%*+\-./:]+$/i.test(text)
  }

  // Get the most appropriate encoding mode for the given text
  static getEncodingMode(text: string): 'numeric' | 'alphanumeric' | 'byte' {
    if (this.isNumeric(text)) return 'numeric'
    if (this.isAlphanumeric(text)) return 'alphanumeric'
    return 'byte'
  }

  // Estimate remaining capacity as a percentage
  static estimateCapacityUsage(text: string, errorLevel: 'L' | 'M' | 'Q' | 'H'): number {
    const mode = this.getEncodingMode(text)
    const maxCapacity = this.CAPACITY_MAP[errorLevel][mode]
    return Math.min(100, (text.length / maxCapacity) * 100)
  }

  // Get minimum required version for the given text and error correction level
  static getMinimumVersion(text: string, errorLevel: 'L' | 'M' | 'Q' | 'H'): number {
    const mode = this.getEncodingMode(text)
    const textLength = text.length
    
    // Capacity per version (approximate) for different error correction levels
    const capacityTable: Record<'L' | 'M' | 'Q' | 'H', Record<'numeric' | 'alphanumeric' | 'byte', number[]>> = {
      L: {
        numeric: [41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6153, 6479, 6743, 7089],
        alphanumeric: [25, 47, 77, 114, 154, 195, 224, 279, 335, 395, 468, 535, 619, 667, 758, 854, 938, 1046, 1153, 1249, 1352, 1460, 1588, 1704, 1853, 1990, 2132, 2223, 2369, 2520, 2677, 2840, 3009, 3183, 3351, 3537, 3729, 3927, 4087, 4296],
        byte: [17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718, 792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068, 2188, 2303, 2431, 2563, 2699, 2809, 2953]
      },
      M: {
        numeric: [34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596],
        alphanumeric: [20, 38, 61, 90, 122, 154, 178, 221, 262, 311, 366, 419, 483, 528, 600, 656, 734, 816, 909, 970, 1035, 1134, 1248, 1326, 1451, 1542, 1637, 1732, 1839, 1994, 2113, 2238, 2369, 2506, 2632, 2780, 2894, 3054, 3220, 3391],
        byte: [14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722, 1809, 1911, 1989, 2099, 2213, 2331]
      },
      Q: {
        numeric: [27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1063, 1159, 1224, 1358, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993],
        alphanumeric: [16, 29, 47, 67, 87, 108, 125, 157, 189, 221, 259, 296, 352, 376, 426, 470, 531, 574, 644, 702, 742, 823, 890, 963, 1041, 1094, 1172, 1263, 1322, 1429, 1499, 1618, 1700, 1787, 1867, 1966, 2071, 2181, 2298, 2420],
        byte: [11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442, 482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228, 1283, 1351, 1423, 1499, 1579, 1663]
      },
      H: {
        numeric: [17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1782, 1897, 2022, 2157, 2301, 2361, 2524, 2625, 2735, 2927, 3057],
        alphanumeric: [10, 20, 35, 50, 64, 84, 93, 122, 143, 174, 200, 227, 259, 283, 321, 365, 408, 452, 493, 557, 587, 640, 672, 744, 779, 864, 910, 958, 1016, 1080, 1150, 1226, 1307, 1394, 1431, 1530, 1591, 1658, 1774, 1852],
        byte: [7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338, 382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051, 1093, 1139, 1219, 1273]
      }
    }
    
    const capacities = capacityTable[errorLevel][mode]
    
    // Find the minimum version that can contain the text
    // Add 1 to the result as buffer since library is more conservative
    for (let i = 0; i < capacities.length; i++) {
      if (textLength <= capacities[i]) {
        // Add 1 version as safety margin since library calculations can differ
        return Math.min(i + 2, 40) // Version is 1-indexed, add 1 for safety
      }
    }
    
    // If text is too large for any version, return max version
    return 40
  }

  // Apply rounded/circular styling to QR modules
  static applyModuleStyle(canvas: HTMLCanvasElement, patternStyle?: 'square' | 'rounded' | 'circle'): HTMLCanvasElement {
    if (!patternStyle || patternStyle === 'square') {
      return canvas // No style changes needed
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return canvas

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Create a new canvas for styled output
    const styledCanvas = document.createElement('canvas')
    styledCanvas.width = canvas.width
    styledCanvas.height = canvas.height
    const styledCtx = styledCanvas.getContext('2d')
    if (!styledCtx) return canvas

    // Fill background
    const bgColor = ctx.getImageData(0, 0, 1, 1).data
    styledCtx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`
    styledCtx.fillRect(0, 0, canvas.width, canvas.height)

    // Detect module size (approximate)
    const moduleSize = Math.floor(canvas.width / 45) // Rough estimate for QR modules
    const radius = patternStyle === 'circle' ? moduleSize / 2 : moduleSize / 4

    // Draw styled modules
    for (let y = 0; y < canvas.height; y += moduleSize) {
      for (let x = 0; x < canvas.width; x += moduleSize) {
        const i = (y * canvas.width + x) * 4
        const isDark = data[i] < 128 // Check if pixel is dark
        
        if (isDark) {
          styledCtx.fillStyle = `rgb(${data[i]}, ${data[i + 1]}, ${data[i + 2]})`
          
          if (patternStyle === 'circle') {
            // Draw circular modules
            styledCtx.beginPath()
            styledCtx.arc(x + moduleSize / 2, y + moduleSize / 2, radius, 0, Math.PI * 2)
            styledCtx.fill()
          } else if (patternStyle === 'rounded') {
            // Draw rounded square modules
            styledCtx.beginPath()
            styledCtx.roundRect(x, y, moduleSize, moduleSize, radius)
            styledCtx.fill()
          }
        }
      }
    }

    return styledCanvas
  }

  static async generateQRCode(options: QRCodeOptions): Promise<string> {
    interface QROptions {
      errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
      margin: number;
      width: number;
      color: {
        dark: string;
        light: string;
      };
      version?: number;
    }
    
    const qrOptions: QROptions = {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.size,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor,
      },
    }
    
    // Validate and set version
    const minRequiredVersion = this.getMinimumVersion(options.text, options.errorCorrectionLevel)
    
    if (options.version) {
      if (options.version < minRequiredVersion) {
        throw new Error(`The chosen QR Code version (${options.version}) cannot contain this amount of data. Minimum version required: ${minRequiredVersion}`)
      }
      qrOptions.version = options.version
    } else {
      // Auto-select appropriate version
      qrOptions.version = minRequiredVersion
    }

    console.log('QR Generation:', { 
      textLength: options.text.length, 
      minVersion: minRequiredVersion, 
      selectedVersion: qrOptions.version,
      errorLevel: options.errorCorrectionLevel 
    })

    try {
      // Generate QR code as data URL
      let dataURL = await QRCodeLib.toDataURL(options.text, qrOptions as unknown as QRLibOptions)
      
      if (!dataURL) {
        throw new Error('QR generation returned empty result')
      }

      // Apply module styling for patterns
      if (options.pattern?.style && (options.pattern.style === 'circle' || options.pattern.style === 'rounded')) {
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCanvas.width = options.size
          tempCanvas.height = options.size
          
          const img = new Image()
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              tempCtx.drawImage(img, 0, 0)
              const styledCanvas = this.applyModuleStyle(tempCanvas, options.pattern?.style)
              dataURL = styledCanvas.toDataURL()
              resolve()
            }
            img.onerror = reject
            img.src = dataURL
          })
        }
      }
      
      // If no gradient is set, return the QR code (with styling applied)
      if (!options.gradient) {
        return dataURL
      }
      
      // For gradient QR codes, we need to apply via canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return dataURL // Fallback if canvas is not supported
      
      canvas.width = options.size
      canvas.height = options.size
      
      // Create gradient if specified
      if (options.gradient) {
        let gradient
        if (options.gradient.type === 'linear') {
          const angle = options.gradient.rotation * Math.PI / 180
          const x0 = options.size / 2 - Math.cos(angle) * options.size / 2
          const y0 = options.size / 2 - Math.sin(angle) * options.size / 2
          const x1 = options.size / 2 + Math.cos(angle) * options.size / 2
          const y1 = options.size / 2 + Math.sin(angle) * options.size / 2
          
          gradient = ctx.createLinearGradient(x0, y0, x1, y1)
        } else {
          // Radial gradient
          gradient = ctx.createRadialGradient(
            options.size / 2, options.size / 2, 0,
            options.size / 2, options.size / 2, options.size / 2
          )
        }
        
        // Add color stops
        options.gradient.colorStops.forEach(stop => {
          gradient.addColorStop(stop.offset, stop.color)
        })
        
        // Load the QR code as an image
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            ctx.fillStyle = options.backgroundColor
            ctx.fillRect(0, 0, options.size, options.size)
            
            // Draw QR code
            ctx.drawImage(img, 0, 0, options.size, options.size)
            
            // Apply gradient to QR code (only where QR code is drawn)
            ctx.globalCompositeOperation = 'source-in'
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, options.size, options.size)
            
            // Reset composite operation
            ctx.globalCompositeOperation = 'source-over'
            
            resolve(canvas.toDataURL())
          }
          img.onerror = reject
          img.src = dataURL
        })
      } else {
        return dataURL
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate QR code'
      
      // If in auto mode and library says version is too small, retry with higher version
      if (!options.version && errorMessage.includes('Minimum version required')) {
        const versionMatch = /Minimum version required.*?(\d+)/.exec(errorMessage)
        if (versionMatch) {
          const requiredVersion = Number.parseInt(versionMatch[1], 10)
          console.log(`Auto-retry with version ${requiredVersion} (library-suggested)`)
          // Retry with the library's suggested version
          return this.generateQRCode({ ...options, version: requiredVersion })
        }
      }
      
      throw new Error(errorMessage)
    }
  }

  static async generateWithLogo(options: QRCodeOptions): Promise<string> {
    // Force high error correction for logo
    const highErrorOptions = { ...options, errorCorrectionLevel: 'H' as const }
    
    // First generate QR code with patterns and other styling
    const qrDataURL = await this.generateQRCode(highErrorOptions)

    // Then add the logo on top
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')

    canvas.width = options.size
    canvas.height = options.size

    return new Promise<string>((resolve, reject) => {
      const qrImage = new Image()
      qrImage.crossOrigin = 'anonymous'
      
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0, options.size, options.size)

        if (options.logoUrl && options.logoSize) {
          const logo = new Image()
          logo.crossOrigin = 'anonymous'
          logo.onload = () => {
            const logoSize = Math.min(options.logoSize || options.size * 0.2, options.size * 0.3)
            const x = (options.size - logoSize) / 2
            const y = (options.size - logoSize) / 2

            // Create proper space for logo with better padding
            const padding = logoSize * 0.15
            const bgSize = logoSize + (padding * 2)
            const bgX = (options.size - bgSize) / 2
            const bgY = (options.size - bgSize) / 2
            const cornerRadius = bgSize * 0.15

            // Draw rounded white background for logo
            ctx.fillStyle = options.backgroundColor || '#ffffff'
            ctx.beginPath()
            ctx.roundRect(bgX, bgY, bgSize, bgSize, cornerRadius)
            ctx.fill()

            // Add subtle shadow for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
            ctx.shadowBlur = 8
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 2

            // Draw logo with rounded corners
            ctx.save()
            ctx.beginPath()
            ctx.roundRect(x, y, logoSize, logoSize, logoSize * 0.1)
            ctx.clip()
            ctx.drawImage(logo, x, y, logoSize, logoSize)
            ctx.restore()

            // Reset shadow
            ctx.shadowColor = 'transparent'
            ctx.shadowBlur = 0

            resolve(canvas.toDataURL('image/png'))
          }
          logo.onerror = () => resolve(canvas.toDataURL('image/png'))
          logo.src = options.logoUrl
        } else {
          resolve(canvas.toDataURL('image/png'))
        }
      }
      qrImage.onerror = reject
      qrImage.src = qrDataURL
    })
  }

  static async exportQRCode(
    dataURL: string, 
    exportOptions: ExportOptions,
    filename: string
  ): Promise<void> {
    // For PNG/JPG exports, use the canvas approach
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    const img = new Image();
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => {
        canvas.width = exportOptions.size;
        canvas.height = exportOptions.size;

        // Fill background with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportOptions.size, exportOptions.size);

        ctx.drawImage(img, 0, 0, exportOptions.size, exportOptions.size);

        const mimeType = exportOptions.format === 'jpg' ? 'image/jpeg' : 'image/png';
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            this.downloadFile(url, `${filename}.${exportOptions.format}`);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, mimeType, exportOptions.quality || 0.9);
      };
      img.onerror = reject;
      img.src = dataURL;
    });
  }

  private static downloadFile(url: string, filename: string) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
