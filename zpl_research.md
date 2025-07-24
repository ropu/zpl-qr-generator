# Investigación ZPL para Generador de Etiquetas

## Comandos ZPL Básicos
- `^XA` - Inicio de formato de etiqueta
- `^XZ` - Fin de formato de etiqueta
- `^FO x,y` - Posición del campo (Field Origin) en dots
- `^A font,height,width` - Configuración de fuente
- `^FD texto ^FS` - Datos del campo (Field Data)
- `^BQ` - Código QR

## Dimensiones y Conversiones
- Las impresoras Zebra típicamente usan 203 DPI (8 dots/mm) o 300 DPI (12 dots/mm)
- Para 203 DPI: 1mm = 8 dots
- Para etiqueta 100x150mm en 203 DPI:
  - Ancho: 100mm × 8 = 800 dots
  - Alto: 150mm × 8 = 1200 dots

## Especificaciones del Proyecto
- Etiqueta: 100×150mm (800×1200 dots a 203 DPI)
- Texto superior: 20% altura = 240 dots
- QR inferior: 80% altura = 960 dots
- Texto centrado en todo el ancho

## Comando QR Code (^BQ)
Formato: ^BQ orientation,model,magnification
- orientation: N (normal), R (90°), I (180°), B (270°)
- model: 1 o 2 (recomendado modelo 2)
- magnification: factor de escala (1-10)

## Estructura ZPL Base
```
^XA
^FO x,y ^A font,size ^FD texto ^FS
^FO x,y ^BQ N,2,magnification ^FD datos_qr ^FS
^XZ
```

