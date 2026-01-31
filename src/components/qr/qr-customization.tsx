'use client'

import { useState } from 'react'
import Image from 'next/image'
import { QRCodeOptions } from '@/types/qr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Palette, Settings, ImageIcon, Shapes } from 'lucide-react'

interface QRCustomizationProps {
  readonly options: QRCodeOptions
  readonly onChange: (options: QRCodeOptions) => void
}

export function QRCustomization({ options, onChange }: QRCustomizationProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'style' | 'logo' | 'pattern'>('colors')

  const updateOptions = (updates: Partial<QRCodeOptions>) => {
    onChange({ ...options, ...updates })
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string
        updateOptions({ 
          logoUrl,
          logoSize: options.logoSize || options.size * 0.2 
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const presetColors = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Inverted', fg: '#ffffff', bg: '#000000' },
    { name: 'Blue', fg: '#1e40af', bg: '#dbeafe' },
    { name: 'Green', fg: '#16a34a', bg: '#dcfce7' },
    { name: 'Purple', fg: '#7c3aed', bg: '#ede9fe' },
    { name: 'Orange', fg: '#ea580c', bg: '#fed7aa' },
    { name: 'Ocean', fg: '#0891b2', bg: '#e0f2fe' },
    { name: 'Sunset', fg: '#be185d', bg: '#ffe4e6' },
    { name: 'Forest', fg: '#166534', bg: '#d1fae5' },
    { name: 'Midnight', fg: '#312e81', bg: '#e0e7ff' },
  ]

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'style', label: 'Style', icon: Settings },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'pattern', label: 'Pattern', icon: Shapes },
  ] as const

  return (
    <div className="space-y-3">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      <Card>
        <CardContent className="pt-4 px-3">
          {activeTab === 'colors' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium mb-1">Solid Colors</h4>
              <div className="grid grid-cols-3 gap-1">
                {presetColors.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    className="h-auto p-1 flex flex-col items-center gap-1"
                    onClick={() => updateOptions({
                      foregroundColor: preset.fg,
                      backgroundColor: preset.bg,
                      gradient: undefined
                    })}
                  >
                    <div className="flex">
                      <div 
                        className="w-4 h-4 border"
                        style={{ backgroundColor: preset.fg }}
                      />
                      <div 
                        className="w-4 h-4 border"
                        style={{ backgroundColor: preset.bg }}
                      />
                    </div>
                    <span className="text-xs">{preset.name}</span>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="fg-color" className="text-sm font-medium block mb-2">Foreground Color</label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={options.foregroundColor}
                      onChange={(e) => updateOptions({ foregroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={options.foregroundColor}
                      onChange={(e) => updateOptions({ foregroundColor: e.target.value })}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bg-color" className="text-sm font-medium block mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={options.backgroundColor}
                      onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={options.backgroundColor}
                      onChange={(e) => updateOptions({ backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
              
              {options.gradient && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateOptions({ gradient: undefined })}
                  className="mt-2"
                >
                  Remove Gradient
                </Button>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="qr-size" className="text-sm font-medium block mb-2">Size (px)</label>
                  <Input
                    id="qr-size"
                    type="range"
                    min="100"
                    max="800"
                    value={options.size}
                    onChange={(e) => updateOptions({ size: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">
                    {options.size}px
                  </div>
                </div>

                <div>
                  <label htmlFor="qr-margin" className="text-sm font-medium block mb-2">Margin</label>
                  <Input
                    id="qr-margin"
                    type="range"
                    min="0"
                    max="10"
                    value={options.margin}
                    onChange={(e) => updateOptions({ margin: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">
                    {options.margin}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="error-correction" className="text-sm font-medium block mb-2">Error Correction Level</label>
                <select
                  id="error-correction"
                  value={options.errorCorrectionLevel}
                  onChange={(e) => updateOptions({ 
                    errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' 
                  })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="logo-upload" className="text-sm font-medium block mb-2">Upload Logo</label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a logo to place in the center of your QR code
                </p>
              </div>

              {options.logoUrl && (
                <div>
                  <label htmlFor="logo-size" className="text-sm font-medium block mb-2">Logo Size</label>
                  <Input
                    id="logo-size"
                    type="range"
                    min="20"
                    max={options.size * 0.4}
                    value={options.logoSize || options.size * 0.2}
                    onChange={(e) => updateOptions({ logoSize: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-1">
                    {options.logoSize || Math.round(options.size * 0.2)}px
                  </div>
                </div>
              )}

              {options.logoUrl && (
                <div className="text-center">
                  <Image
                    src={options.logoUrl}
                    alt="Logo preview"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain border rounded mx-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateOptions({ logoUrl: undefined, logoSize: undefined })}
                    className="mt-2"
                  >
                    Remove Logo
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pattern' && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium block mb-2">QR Code Pattern Style</div>
                <p className="text-xs text-muted-foreground mb-3">
                  Choose the shape of QR code dots/modules
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'square', label: 'Square', desc: 'Classic' },
                    { value: 'rounded', label: 'Rounded', desc: 'Modern' },
                    { value: 'circle', label: 'Circle', desc: 'Organic' }
                  ].map((style) => (
                    <Button
                      key={style.value}
                      variant={options.pattern?.style === style.value || (!options.pattern && style.value === 'square') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateOptions({ 
                        pattern: style.value === 'square' ? undefined : { 
                          style: style.value as 'square' | 'rounded' | 'circle'
                        }
                      })}
                      className="flex flex-col h-auto py-3"
                    >
                      <span className="font-medium">{style.label}</span>
                      <span className="text-xs opacity-70">{style.desc}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  )
}
