// Configuración de la etiqueta
let LABEL_CONFIG = {
    // Dimensiones en dots para 203 DPI (8 dots/mm)
    width: 800,    // 100mm × 8 dots/mm
    height: 1200,  // 150mm × 8 dots/mm
    
    // Áreas de la etiqueta
    textHeight: 240,  // 20% de 1200 dots
    qrHeight: 960,    // 80% de 1200 dots
    
    // Márgenes
    margin: 40,
    
    // Configuración de fuente para el texto
    fontSize: 60,
    
    // Configuración adaptativa del QR (Tabla específica del usuario)
    qrSizes: [
        { minChars: 0, maxChars: 10, magnification: 35, name: 'Extra Extra Grande' },
        { minChars: 10, maxChars: 20, magnification: 30, name: 'Extra Grande' },
        { minChars: 20, maxChars: 30, magnification: 25, name: 'Muy Grande' },
        { minChars: 30, maxChars: 50, magnification: 20, name: 'Grande' },
        { minChars: 50, maxChars: 80, magnification: 17, name: 'Mediano' },
        { minChars: 80, maxChars: 100, magnification: 15, name: 'Pequeño' }
    ]
};

// Función para calcular el tamaño adaptativo del QR (Nueva tabla específica)
function calculateQRSize(textLength) {
    const sizes = LABEL_CONFIG.qrSizes;
    
    // Buscar el rango apropiado según la longitud del texto
    for (let i = 0; i < sizes.length; i++) {
        const range = sizes[i];
        if (textLength >= range.minChars && textLength < range.maxChars) {
            return range;
        }
    }
    
    // Si no encuentra rango, usar el último (más pequeño)
    return sizes[sizes.length - 1];
}

// Referencias a elementos del DOM
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const outputSection = document.getElementById('outputSection');
const zplOutput = document.getElementById('zplOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Referencias para configuración de tamaño
const labelWidth = document.getElementById('labelWidth');
const labelHeight = document.getElementById('labelHeight');
const dpiSetting = document.getElementById('dpiSetting');
const sizeInfo = document.getElementById('sizeInfo');
const footerSize = document.getElementById('footerSize');

// Referencias para CSV
const csvFile = document.getElementById('csvFile');
const selectCsvBtn = document.getElementById('selectCsvBtn');
const csvFileName = document.getElementById('csvFileName');
const csvOptions = document.getElementById('csvOptions');
const skipHeader = document.getElementById('skipHeader');
const csvPreview = document.getElementById('csvPreview');
const generateCsvBtn = document.getElementById('generateCsvBtn');

// Variables globales para CSV
let csvData = null;

// Variables globales
let currentZplCode = '';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateLabelConfig(); // Inicializar configuración de tamaño
    updateCharCounter();
});

function setupEventListeners() {
    // Contador de caracteres
    textInput.addEventListener('input', updateCharCounter);
    
    // Generar etiqueta
    generateBtn.addEventListener('click', generateLabel);
    
    // Copiar código
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Descargar archivo
    downloadBtn.addEventListener('click', downloadZplFile);
    
    // Exportar a PDF
    exportPdfBtn.addEventListener('click', exportToPdf);
    
    // Generar al presionar Enter (con Ctrl)
    textInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateLabel();
        }
    });
    
    // Event listeners para configuración de tamaño
    labelWidth.addEventListener('input', updateLabelConfig);
    labelHeight.addEventListener('input', updateLabelConfig);
    dpiSetting.addEventListener('change', updateLabelConfig);
    
    // Event listeners para CSV
    selectCsvBtn.addEventListener('click', () => csvFile.click());
    csvFile.addEventListener('change', handleCsvFileSelect);
    skipHeader.addEventListener('change', updateCsvPreview);
    generateCsvBtn.addEventListener('click', generateFromCsv);
}

function updateLabelConfig() {
    const width = parseInt(labelWidth.value);
    const height = parseInt(labelHeight.value);
    const dpi = parseInt(dpiSetting.value);
    
    // Calcular dots por mm
    const dotsPerMm = dpi / 25.4; // 25.4 mm = 1 inch
    
    // Actualizar configuración
    LABEL_CONFIG.width = Math.round(width * dotsPerMm);
    LABEL_CONFIG.height = Math.round(height * dotsPerMm);
    LABEL_CONFIG.textHeight = Math.round(LABEL_CONFIG.height * 0.2); // 20% superior
    LABEL_CONFIG.qrHeight = LABEL_CONFIG.height - LABEL_CONFIG.textHeight; // 80% inferior
    
    // Ajustar margen según el tamaño
    LABEL_CONFIG.margin = Math.round(Math.min(width, height) * dotsPerMm * 0.05); // 5% del lado más pequeño
    
    // Ajustar tamaño de fuente según el ancho
    LABEL_CONFIG.fontSize = Math.round(LABEL_CONFIG.width * 0.075); // 7.5% del ancho
    
    // Actualizar información visual
    updateSizeInfo();
}

function updateSizeInfo() {
    const width = parseInt(labelWidth.value);
    const height = parseInt(labelHeight.value);
    const dpi = parseInt(dpiSetting.value);
    
    const sizeText = `Tamaño en dots: ${LABEL_CONFIG.width}×${LABEL_CONFIG.height}`;
    const footerText = `${width}×${height}mm (${LABEL_CONFIG.width}×${LABEL_CONFIG.height} dots a ${dpi} DPI)`;
    
    sizeInfo.textContent = sizeText;
    footerSize.textContent = footerText;
}

function updateCharCounter() {
    const text = textInput.value;
    const lines = text.split('\n');
    
    // Encontrar la línea más larga
    const longestLine = lines.reduce((longest, current) => 
        current.length > longest.length ? current : longest, '');
    
    const totalLength = text.length;
    const longestLineLength = longestLine.length;
    const qrConfig = calculateQRSize(longestLineLength);
    
    // Usar el nombre directamente de la configuración
    const sizeName = qrConfig.name;
    
    charCount.innerHTML = `${totalLength}/100 caracteres total<br><small>QR: ${sizeName} (línea más larga: ${longestLineLength} chars)</small>`;
    
    // Cambiar color según la proximidad al límite (basado en la línea más larga)
    if (longestLineLength > 80) {
        charCount.style.color = '#e53e3e';
    } else if (longestLineLength > 60) {
        charCount.style.color = '#dd6b20';
    } else {
        charCount.style.color = '#666';
    }
}

function generateLabel() {
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Por favor, ingresa un texto para la etiqueta.');
        textInput.focus();
        return;
    }
    
    // Mostrar indicador de carga
    generateBtn.innerHTML = '<span class="btn-icon">⏳</span>Generando...';
    generateBtn.disabled = true;
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
        try {
            // Dividir el texto por líneas y generar una etiqueta por cada línea
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length === 0) {
                alert('Por favor, ingresa un texto válido para la etiqueta.');
                generateBtn.innerHTML = '<span class="btn-icon">⚡</span>Generar Etiqueta ZPL';
                generateBtn.disabled = false;
                return;
            }
            
            // Generar código ZPL para todas las líneas
            currentZplCode = generateMultipleLabels(lines);
            
            // Mostrar código generado
            showOutput(currentZplCode);
            
            // Restaurar botón
            generateBtn.innerHTML = '<span class="btn-icon">⚡</span>Generar Etiqueta ZPL';
            generateBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generando etiqueta:', error);
            alert('Error al generar la etiqueta. Por favor, inténtalo de nuevo.');
            
            // Restaurar botón
            generateBtn.innerHTML = '<span class="btn-icon">⚡</span>Generar Etiqueta ZPL';
            generateBtn.disabled = false;
        }
    }, 500);
}

function generateZplCode(text) {
    // Escapar caracteres especiales para ZPL
    const escapedText = escapeZplText(text);
    
    // Calcular tamaño adaptativo del QR basado en la longitud del texto
    const qrConfig = calculateQRSize(text.length);
    
    // Calcular posiciones para centrar correctamente
    const textX = LABEL_CONFIG.margin; // Empezar desde el margen izquierdo
    const textY = LABEL_CONFIG.margin;
    
    // Posición del QR usando el mismo formato que el texto
    const qrX = LABEL_CONFIG.margin; // Empezar desde el margen izquierdo
    const qrY = LABEL_CONFIG.textHeight + 60; // Posición vertical en área QR
    
    // Generar código ZPL
    const zplCode = `^XA
^MMT
^PW${LABEL_CONFIG.width}
^LL${LABEL_CONFIG.height}
^LS0

~SD15
^LH0,0
^FO${textX},${textY}^A0,${LABEL_CONFIG.fontSize},${LABEL_CONFIG.fontSize}^FB${LABEL_CONFIG.width - (LABEL_CONFIG.margin * 2)},3,0,C,0^FD${escapedText}^FS

^FO${qrX},${qrY}^BQN,2,${qrConfig.magnification}^FB${LABEL_CONFIG.width - (LABEL_CONFIG.margin * 2)},1,0,C,0^FDQA,${escapedText}^FS

^XZ`;

    return zplCode;
}

function generateMultipleLabels(lines) {
    // Generar una etiqueta ZPL por cada línea
    const labels = lines.map(line => generateZplCode(line));
    
    // Unir todas las etiquetas con saltos de línea
    return labels.join('\n\n');
}

function handleCsvFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    csvFileName.textContent = file.name;
    csvOptions.style.display = 'block';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        csvData = parseCsv(content);
        updateCsvPreview();
        generateCsvBtn.style.display = 'inline-flex';
    };
    reader.readAsText(file);
}

function parseCsv(content) {
    // Parsear CSV con separador ';' (como en tu archivo)
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
        const columns = line.split(';');
        return {
            text: (columns[0] || '').trim(),
            qrValue: (columns[1] || columns[0] || '').trim()
        };
    });
}

function updateCsvPreview() {
    if (!csvData) return;
    
    const skipFirst = skipHeader.checked;
    const displayData = skipFirst ? csvData.slice(1) : csvData;
    
    if (displayData.length === 0) {
        csvPreview.innerHTML = '<p style="color: #666; text-align: center;">No hay datos para mostrar</p>';
        return;
    }
    
    // Mostrar solo las primeras 5 filas como preview
    const previewData = displayData.slice(0, 5);
    const hasMore = displayData.length > 5;
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Texto (Columna 1)</th>
                    <th>Valor QR (Columna 2)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    previewData.forEach(row => {
        html += `
            <tr>
                <td>${escapeHtml(row.text)}</td>
                <td>${escapeHtml(row.qrValue)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    if (hasMore) {
        html += `<p style="color: #666; text-align: center; margin-top: 10px;">
            ... y ${displayData.length - 5} filas más
        </p>`;
    }
    
    csvPreview.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateFromCsv() {
    if (!csvData) {
        alert('Por favor, selecciona un archivo CSV primero.');
        return;
    }
    
    const skipFirst = skipHeader.checked;
    const dataToProcess = skipFirst ? csvData.slice(1) : csvData;
    
    if (dataToProcess.length === 0) {
        alert('No hay datos para procesar.');
        return;
    }
    
    // Mostrar indicador de carga
    generateCsvBtn.innerHTML = '<span class="btn-icon">⏳</span>Generando...';
    generateCsvBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // Generar etiquetas usando el valor QR como contenido del QR
            currentZplCode = generateLabelsFromCsvData(dataToProcess);
            
            // Mostrar código generado
            showOutput(currentZplCode);
            
            // Restaurar botón
            generateCsvBtn.innerHTML = '<span class="btn-icon">📊</span>Generar desde CSV';
            generateCsvBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generando etiquetas desde CSV:', error);
            alert('Error al generar las etiquetas. Por favor, inténtalo de nuevo.');
            
            // Restaurar botón
            generateCsvBtn.innerHTML = '<span class="btn-icon">📊</span>Generar desde CSV';
            generateCsvBtn.disabled = false;
        }
    }, 500);
}

function generateLabelsFromCsvData(data) {
    // Generar una etiqueta por cada fila del CSV
    const labels = data.map((row, index) => {
        console.log(`Fila ${index + 1}:`, {
            text: `"${row.text}"`,
            qrValue: `"${row.qrValue}"`,
            textLength: row.text.length,
            qrValueLength: row.qrValue.length
        });
        
        // Usar el texto de la primera columna como texto visible
        // y el valor de la segunda columna como contenido del QR
        return generateZplCodeWithCustomQR(row.text, row.qrValue);
    });
    
    // Unir todas las etiquetas con saltos de línea
    return labels.join('\n\n');
}

function generateZplCodeWithCustomQR(text, qrValue) {
    // Escapar caracteres especiales para ZPL
    const escapedText = escapeZplText(text);
    const escapedQrValue = escapeZplText(qrValue);
    
    // Calcular tamaño adaptativo del QR basado en la longitud del valor QR
    const qrConfig = calculateQRSize(qrValue.length);
    
    // Calcular posiciones para centrar correctamente
    const textX = LABEL_CONFIG.margin;
    const textY = LABEL_CONFIG.margin;
    
    // Posición del QR usando el mismo formato que el texto
    const qrX = LABEL_CONFIG.margin;
    const qrY = LABEL_CONFIG.textHeight + 60;
    
    // Generar código ZPL
    const zplCode = `^XA
^MMT
^PW${LABEL_CONFIG.width}
^LL${LABEL_CONFIG.height}
^LS0

~SD15
^LH0,0
^FO${textX},${textY}^A0,${LABEL_CONFIG.fontSize},${LABEL_CONFIG.fontSize}^FB${LABEL_CONFIG.width - (LABEL_CONFIG.margin * 2)},3,0,C,0^FD${escapedText}^FS

^FO${qrX},${qrY}^BQN,2,${qrConfig.magnification}^FB${LABEL_CONFIG.width - (LABEL_CONFIG.margin * 2)},1,0,C,0^FDQA,${escapedQrValue}^FS

^XZ`;

    return zplCode;
}

function exportToPdf() {
    if (!currentZplCode) {
        alert('No hay código ZPL para exportar a PDF.');
        return;
    }
    
    // Mostrar indicador de carga
    const originalText = exportPdfBtn.innerHTML;
    exportPdfBtn.innerHTML = '<span class="btn-icon">⏳</span>Generando PDF...';
    exportPdfBtn.disabled = true;
    
    setTimeout(() => {
        try {
            generatePdfReport();
            
            // Restaurar botón
            exportPdfBtn.innerHTML = originalText;
            exportPdfBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
            
            // Restaurar botón
            exportPdfBtn.innerHTML = originalText;
            exportPdfBtn.disabled = false;
        }
    }, 500);
}

function generatePdfReport() {
    try {
                    // Verificar que jsPDF esté disponible
            console.log('Verificando librerías...');
            console.log('window.jsPDF:', typeof window.jsPDF);
            console.log('window.jspdf:', typeof window.jspdf);
            console.log('QRCode disponible:', typeof window.QRCode !== 'undefined');
            
            let jsPDF;
            if (typeof window.jsPDF !== 'undefined') {
                jsPDF = window.jsPDF.jsPDF;
                console.log('jsPDF encontrado en window.jsPDF');
            } else if (typeof window.jspdf !== 'undefined') {
                jsPDF = window.jspdf.jsPDF;
                console.log('jsPDF encontrado en window.jspdf');
            } else {
                alert('Error: La librería PDF no está cargada. Por favor, recarga la página.');
                return;
            }
            
            if (typeof window.QRCode === 'undefined') {
                console.warn('QRCode no está disponible, usando placeholder');
            } else {
                console.log('QRCode está disponible y listo para usar');
            }
        
        // Crear documento con tamaño de página 100x150mm
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [100, 150]
        });
        
        // Continuar con la generación del PDF
        generatePdfContent(doc);
        
    } catch (error) {
        console.error('Error inicializando PDF:', error);
        alert('Error al inicializar la librería PDF. Por favor, recarga la página.');
    }
}

async function generatePdfContent(doc) {
    // Obtener los datos de las etiquetas
    let labelsData = [];
    if (csvData && csvFileName.textContent) {
        const skipFirst = skipHeader.checked;
        const dataToProcess = skipFirst ? csvData.slice(1) : csvData;
        labelsData = dataToProcess.map(row => ({
            text: row.text,
            qrValue: row.qrValue
        }));
    } else {
        const text = textInput.value.trim();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        labelsData = lines.map(line => ({
            text: line,
            qrValue: line
        }));
    }

    if (labelsData.length === 0) {
        alert('No hay datos para generar etiquetas.');
        return;
    }

    for (let i = 0; i < labelsData.length; i++) {
        if (i > 0) doc.addPage();
        
        // Debug: mostrar los valores que se están procesando
        console.log(`PDF - Etiqueta ${i + 1}:`, {
            text: `"${labelsData[i].text}"`,
            qrValue: `"${labelsData[i].qrValue}"`
        });
        
        // Texto centrado arriba
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(labelsData[i].text, 50, 20, { align: 'center' });

        // Generar QR y agregarlo centrado
        const qrCanvas = document.createElement('canvas');
        
        try {
            // Limpiar el valor del QR para asegurar que no tenga caracteres extra
            const qrValue = labelsData[i].qrValue.trim();
            console.log('Intentando generar QR para:', qrValue);
            console.log('QRCode disponible:', typeof window.QRCode !== 'undefined');
            
            if (typeof window.QRCode !== 'undefined') {
                console.log('Generando QR real...');
                await new Promise((resolve, reject) => {
                    window.QRCode.toCanvas(qrCanvas, qrValue, {
                        width: 80,
                        margin: 1
                    }, function (error) {
                        if (error) {
                            console.error('Error en QRCode.toCanvas:', error);
                            reject(error);
                        } else {
                            console.log('QR generado exitosamente para:', qrValue);
                            resolve();
                        }
                    });
                });
            } else {
                console.log('QRCode no disponible, usando placeholder');
                // Fallback si QRCode no está disponible
                drawQRPlaceholder(qrCanvas, 80, qrValue);
            }
        } catch (error) {
            console.error('Error generando QR:', error);
            // Fallback si hay error
            drawQRPlaceholder(qrCanvas, 80, labelsData[i].qrValue.trim());
        }
        
        const imgData = qrCanvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 35, 80, 80); // centrado en la página
    }

    // Generar nombre del archivo
    let filename = 'etiquetas.pdf';
    if (csvData && csvFileName.textContent) {
        const csvName = csvFileName.textContent.replace('.csv', '');
        filename = `etiquetas_${csvName}_${labelsData.length}_elementos.pdf`;
    } else {
        const text = textInput.value.trim();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 1) {
            const sanitizedText = lines[0]
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .replace(/\s+/g, '_')
                .substring(0, 20);
            filename = `etiqueta_${sanitizedText}.pdf`;
        } else {
            filename = `etiquetas_${lines.length}_elementos.pdf`;
        }
    }

    doc.save(filename);

    // Mostrar feedback visual
    const originalText = exportPdfBtn.innerHTML;
    exportPdfBtn.innerHTML = '<span class="btn-icon">✓</span>¡PDF Generado!';
    exportPdfBtn.classList.add('success');
    setTimeout(() => {
        exportPdfBtn.innerHTML = originalText;
        exportPdfBtn.classList.remove('success');
    }, 2000);
}

function drawQRPlaceholder(canvas, size, text) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, size - 10, size - 10);
    
    // Agregar texto en el centro
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR', size / 2, size / 2 + 4);
    
    // Agregar texto pequeño abajo
    ctx.font = '8px Arial';
    const shortText = text.length > 15 ? text.substring(0, 15) + '...' : text;
    ctx.fillText(shortText, size / 2, size - 5);
}

function escapeZplText(text) {
    // Escapar caracteres especiales en ZPL
    return text
        .replace(/\\/g, '\\\\')  // Escapar backslashes
        .replace(/\^/g, '\\^')   // Escapar carets
        .replace(/~/g, '\\~')    // Escapar tildes
        .replace(/"/g, '\\"');   // Escapar comillas
}



function showOutput(zplCode) {
    zplOutput.textContent = zplCode;
    outputSection.style.display = 'block';
    
    // Scroll suave hacia el output
    setTimeout(() => {
        outputSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }, 300);
}

function copyToClipboard() {
    if (!currentZplCode) {
        alert('No hay código ZPL para copiar.');
        return;
    }
    
    // Usar la API moderna de clipboard si está disponible
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(currentZplCode).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('Error copiando al portapapeles:', err);
            fallbackCopyToClipboard(currentZplCode);
        });
    } else {
        fallbackCopyToClipboard(currentZplCode);
    }
}

function fallbackCopyToClipboard(text) {
    // Método de respaldo para navegadores más antiguos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Error copiando al portapapeles:', err);
        alert('No se pudo copiar al portapapeles. Por favor, selecciona y copia manualmente.');
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span class="btn-icon">✓</span>¡Copiado!';
    copyBtn.classList.add('success');
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('success');
    }, 2000);
}

function downloadZplFile() {
    if (!currentZplCode) {
        alert('No hay código ZPL para descargar.');
        return;
    }
    
    let filename;
    
    // Si hay datos CSV, usar nombre del archivo CSV
    if (csvData && csvFileName.textContent) {
        const csvName = csvFileName.textContent.replace('.csv', '');
        const skipFirst = skipHeader.checked;
        const dataToProcess = skipFirst ? csvData.slice(1) : csvData;
        filename = `etiquetas_${csvName}_${dataToProcess.length}_elementos.zpl`;
    } else {
        // Crear nombre de archivo basado en el texto (sanitizado)
        const text = textInput.value.trim();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 1) {
            // Una sola etiqueta
            const sanitizedText = lines[0]
                .replace(/[^a-zA-Z0-9\s]/g, '')  // Remover caracteres especiales
                .replace(/\s+/g, '_')            // Reemplazar espacios con guiones bajos
                .substring(0, 30);               // Limitar longitud
            
            filename = sanitizedText ? `etiqueta_${sanitizedText}.zpl` : 'etiqueta.zpl';
        } else {
            // Múltiples etiquetas
            filename = `etiquetas_${lines.length}_elementos.zpl`;
        }
    }
    
    // Crear y descargar archivo
    const blob = new Blob([currentZplCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Mostrar feedback visual
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="btn-icon">✓</span>¡Descargado!';
    downloadBtn.classList.add('success');
    
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.classList.remove('success');
    }, 2000);
}

// Funciones de utilidad adicionales
function validateInput(text) {
    // Validaciones adicionales si son necesarias
    if (text.length > 100) {
        throw new Error('El texto es demasiado largo');
    }
    
    return true;
}

// Exportar funciones para testing (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateZplCode,
        escapeZplText,
        LABEL_CONFIG
    };
}

