let datosCSVActuales = [];
let datosAñadidos = [];

function mostrarSeccion(idSeccion) {
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => seccion.style.display = 'none');
    document.getElementById(idSeccion).style.display = 'block';
}

function analizarCSV(datosCSV, idTabla) {
    const filas = datosCSV.split('\n');
    datosCSVActuales = filas.map(fila => fila.split(','));
    const cuerpoTabla = document.querySelector(`#${idTabla} tbody`);
    cuerpoTabla.innerHTML = ''; // Limpiar tabla antes de agregar nuevos datos
    datosCSVActuales.forEach((columnas, indice) => {
        if (columnas.length > 1) {
            const tr = document.createElement('tr');
            columnas.forEach(columna => {
                const td = document.createElement('td');
                td.textContent = columna;
                tr.appendChild(td);
            });
            if (idTabla === 'tablaBorrar') {
                const botonBorrar = document.createElement('button');
                botonBorrar.textContent = 'Borrar';
                botonBorrar.onclick = () => {
                    borrarFila(indice);
                };
                const tdAccion = document.createElement('td');
                tdAccion.appendChild(botonBorrar);
                tr.appendChild(tdAccion);
            }
            cuerpoTabla.appendChild(tr);
        }
    });
}

function leerCSV(archivo, idTabla) {
    const lector = new FileReader();
    lector.onload = function(e) {
        const datosCSV = e.target.result;
        analizarCSV(datosCSV, idTabla);
    };
    lector.readAsText(archivo);
}

function agregarFila(nombre, correo, edad) {
    const cuerpoTabla = document.querySelector('#tablaAgregar tbody');
    const tr = document.createElement('tr');
    [nombre, correo, edad].forEach(texto => {
        const td = document.createElement('td');
        td.textContent = texto;
        tr.appendChild(td);
    });
    cuerpoTabla.appendChild(tr);
    datosAñadidos.push([nombre, correo, edad]);
}

function borrarFila(indice) {
    datosCSVActuales.splice(indice, 1);
    analizarCSV(datosCSVActuales.map(fila => fila.join(',')).join('\n'), 'tablaBorrar');
}

function descargarCSV() {
    const datosCombinados = datosCSVActuales.concat(datosAñadidos);
    const contenidoCSV = datosCombinados.map(fila => fila.join(',')).join('\n');
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'datos_actualizados.csv';
    enlace.style.display = 'none';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

document.getElementById('csvFileInput').addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    leerCSV(archivo, 'tablaCSV');
    leerCSV(archivo, 'tablaBorrar');
});

document.getElementById('formularioAgregar').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const edad = document.getElementById('edad').value;
    agregarFila(nombre, correo, edad);
    this.reset();
});
