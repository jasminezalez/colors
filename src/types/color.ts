// API Response Types
// Based on https://www.thecolorapi.com/docs
export interface ColorAPIResponse {
  hex: {
    value: string
    clean: string
  }
  rgb: {
    fraction: {
      r: number
      g: number
      b: number
    }
    r: number // 0-255
    g: number // 0-255
    b: number // 0-255
    value: string
  }
  hsl: {
    fraction: {
      h: number
      s: number
      l: number
    }
    h: number // 0-360
    s: number // 0-100
    l: number // 0-100
    value: string
  }
  name: {
    value: string // e.g., "Red", "Scarlet", "Green"
    closest_named_hex: string
    exact_match_name: boolean
    distance: number
  }
}

// Simplified color swatch type for our UI
export interface ColorSwatch {
  name: string
  rgb: {
    r: number
    g: number
    b: number
  }
  hue: number
}
