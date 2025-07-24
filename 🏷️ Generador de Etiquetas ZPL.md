# 🏷️ Generador de Etiquetas ZPL

Un mini sitio web estático que genera etiquetas ZPL de 100×150mm con texto y código QR para impresoras Zebra.

## 📋 Características

- **Etiquetas estándar**: 100×150mm (800×1200 dots a 203 DPI)
- **Distribución optimizada**: 
  - Texto: 20% superior, centrado
  - Código QR: 80% inferior
- **Interfaz moderna**: Diseño responsivo y fácil de usar
- **Funcionalidades**:
  - Vista previa de la etiqueta
  - Generación de código ZPL
  - Copiar código al portapapeles
  - Descargar archivo .zpl

## 🚀 Uso

1. **Abrir la aplicación**: Abre `index.html` en tu navegador web
2. **Ingresar texto**: Escribe el texto que aparecerá en la etiqueta (máximo 100 caracteres)
3. **Generar etiqueta**: Haz clic en "Generar Etiqueta ZPL"
4. **Usar el código**: 
   - Copia el código ZPL generado
   - O descarga el archivo .zpl
   - Envía el código a tu impresora Zebra

## 📐 Especificaciones Técnicas

### Dimensiones de la Etiqueta
- **Tamaño físico**: 100mm × 150mm
- **Resolución**: 203 DPI (8 dots/mm)
- **Dimensiones en dots**: 800 × 1200

### Distribución del Contenido
- **Área de texto**: 240 dots de altura (20%)
- **Área de QR**: 960 dots de altura (80%)
- **Márgenes**: 40 dots en todos los lados

### Código ZPL Generado
El código incluye:
- Configuración de página (`^XA`, `^XZ`)
- Dimensiones de etiqueta (`^PW`, `^LL`)
- Posicionamiento de texto (`^FO`, `^A`, `^FB`)
- Código QR (`^BQ`)

## 🖨️ Compatibilidad

Compatible con impresoras Zebra que soporten:
- ZPL II (Zebra Programming Language)
- Resolución 203 DPI
- Etiquetas de 100×150mm

## 📁 Archivos del Proyecto

- `index.html` - Página principal de la aplicación
- `styles.css` - Estilos y diseño
- `script.js` - Lógica de generación ZPL
- `README.md` - Esta documentación

## 🔧 Personalización

Para modificar las dimensiones o configuración:

1. Edita las constantes en `script.js`:
```javascript
const LABEL_CONFIG = {
    width: 800,    // Ancho en dots
    height: 1200,  // Alto en dots
    textHeight: 240,  // Altura del área de texto
    qrHeight: 960,    // Altura del área QR
    // ... más configuraciones
};
```

2. Ajusta los estilos en `styles.css` si es necesario

## 💡 Consejos de Uso

- **Texto corto**: Mantén el texto conciso para mejor legibilidad
- **Caracteres especiales**: La aplicación escapa automáticamente caracteres especiales de ZPL
- **Pruebas**: Siempre prueba el código ZPL en tu impresora antes de producción masiva
- **Calidad QR**: Los códigos QR más cortos se escanean mejor

## 🐛 Solución de Problemas

### La etiqueta no se imprime correctamente
- Verifica que tu impresora soporte ZPL II
- Confirma que las dimensiones de la etiqueta física coincidan (100×150mm)
- Ajusta la configuración DPI si es necesaria

### El código QR no se escanea
- Reduce la cantidad de texto para mejorar la calidad del QR
- Verifica que el código QR no esté cortado en la impresión

### Problemas de codificación
- Evita caracteres especiales complejos
- Usa texto en español/inglés estándar

## 📞 Soporte

Esta aplicación fue creada como una herramienta estática y autónoma. Para modificaciones avanzadas, consulta la documentación oficial de ZPL de Zebra Technologies.

---

**Versión**: 1.0  
**Compatibilidad**: Navegadores modernos (Chrome, Firefox, Safari, Edge)  
**Licencia**: Uso libre

