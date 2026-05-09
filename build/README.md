# Build resources

`electron-builder` reads platform icons and installer assets from this folder.

## Required files

| File          | Purpose                                  | Size                   |
| ------------- | ---------------------------------------- | ---------------------- |
| `icon.ico`    | Windows app icon + NSIS installer icon   | 256×256 multi-res .ico |
| `icon.png`    | (optional) Linux fallback                | 512×512                |

`icon.svg` is included as a master source — convert it to `icon.ico` before
building a release.

## Generating `icon.ico` from `icon.svg`

Pick whichever route is easiest:

### Online (zero dependencies)

1. Open https://convertio.co/svg-ico/ or https://cloudconvert.com/svg-to-ico
2. Upload `build/icon.svg`
3. Download the resulting `icon.ico` and drop it in this folder

### Local (Node)

```bash
npm i -D sharp png-to-ico
node -e "const sharp=require('sharp'),pti=require('png-to-ico'),fs=require('fs');\
sharp('build/icon.svg').resize(256,256).png().toBuffer()\
.then(b=>pti(b)).then(b=>fs.writeFileSync('build/icon.ico',b))"
```

### ImageMagick

```bash
magick convert -background none -resize 256x256 build/icon.svg build/icon.ico
```

## Behaviour without an icon

If `build/icon.ico` is missing, `electron-builder` falls back to its bundled
default icon. The app will still build and run; only the executable's icon
in Explorer / the taskbar will be generic.
