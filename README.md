# 🏷️ Generador de Etiquetas ZPL

Un generador web completo para crear etiquetas ZPL con texto y códigos QR, compatible con impresoras Zebra.

## ✨ Características

- **Generación de etiquetas ZPL**: Código ZPL listo para imprimir en impresoras Zebra
- **Códigos QR reales**: Generación de códigos QR escaneables
- **Procesamiento de CSV**: Importa datos desde archivos CSV
- **Exportación a PDF**: Genera PDFs con etiquetas visuales
- **Tamaño adaptativo**: Los códigos QR se ajustan según la longitud del texto
- **Interfaz moderna**: Diseño responsive y fácil de usar

## 📋 Especificaciones

- **Tamaño de etiqueta**: 100×150mm (800×1200 dots a 203 DPI)
- **Formato de texto**: 20% superior, centrado
- **Código QR**: 80% inferior, centrado
- **Compatibilidad**: Impresoras Zebra ZPL

## 🚀 Cómo usar

### 1. Generación manual
1. Abre `index.html` en tu navegador
2. Ingresa el texto en el campo de entrada
3. Haz clic en "Generar Etiqueta ZPL"
4. Descarga el archivo .zpl o exporta a PDF

### 2. Procesamiento de CSV
1. Haz clic en "Seleccionar archivo CSV"
2. Elige tu archivo CSV con formato: `Texto;Código_QR`
3. Marca/desmarca "Ignorar primera fila" según corresponda
4. Haz clic en "Generar desde CSV"

### 3. Exportación a PDF
1. Genera las etiquetas (manual o CSV)
2. Haz clic en "Exportar a PDF"
3. Descarga el PDF con etiquetas visuales

## 📁 Estructura del proyecto

```
├── index.html              # Interfaz principal
├── script.js               # Lógica de la aplicación
├── styles.css              # Estilos CSS
├── jsPDF.umd.min.js        # Librería PDF (local)
├── jspdf.plugin.autotable.min.js  # Plugin de tablas (local)
├── qrcode.min.js           # Librería QR (local)
├── README.md               # Este archivo
└── Ubicaciones de inventario.csv  # Ejemplo de CSV
```

## 📊 Formato CSV

El archivo CSV debe tener el siguiente formato:
```csv
Nombre completo de la ubicación;Código de barras
Aisle-01/Rack-01;Aisle-01/Rack-01
FD/Stock/Scrap;S-CRAP
```

- **Columna 1**: Texto visible en la etiqueta
- **Columna 2**: Valor del código QR (si no existe, usa la columna 1)

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura de la interfaz
- **CSS3**: Estilos y diseño responsive
- **JavaScript ES6+**: Lógica de la aplicación
- **jsPDF**: Generación de PDFs
- **QRCode.js**: Generación de códigos QR
- **ZPL**: Lenguaje de programación Zebra

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/ropu/zpl-qr-generator.git
cd zpl-qr-generator
```

2. Abre `index.html` en tu navegador web

No se requieren dependencias adicionales - todas las librerías están incluidas localmente.

## 🔧 Configuración

### Tamaños de QR adaptativos
Los códigos QR se ajustan automáticamente según la longitud del texto:

| Longitud del texto | Tamaño del QR | Nombre |
|-------------------|---------------|---------|
| 0-10 caracteres   | 35            | Extra Extra Grande |
| 10-20 caracteres  | 30            | Extra Grande |
| 20-30 caracteres  | 25            | Muy Grande |
| 30-50 caracteres  | 20            | Grande |
| 50-80 caracteres  | 17            | Mediano |
| 80-100 caracteres | 15            | Pequeño |

## 📝 Ejemplos de uso

### Etiqueta simple
```
Texto: "FD/Stock/Scrap"
QR: "S-CRAP"
```

### Múltiples etiquetas desde CSV
```
Aisle-01/Rack-01;Aisle-01/Rack-01
FD/Stock/Scrap;S-CRAP
FD/Input;WHINPUT
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [jsPDF](https://github.com/parallax/jsPDF) - Generación de PDFs
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - Códigos QR
- [Zebra Technologies](https://www.zebra.com/) - Lenguaje ZPL

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa los [Issues](https://github.com/ropu/zpl-qr-generator/issues)
2. Crea un nuevo Issue con detalles del problema
3. Incluye información sobre tu navegador y sistema operativo

---

**Desarrollado con ❤️ para la gestión de inventarios** 