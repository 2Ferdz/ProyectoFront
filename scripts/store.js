let productosGlobales = [];
const API_URL = 'https://api.escuelajs.co/api/v1/products';

async function llamarAPI(API) {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        productosGlobales = await response.json();
        return productosGlobales;
    } catch (error) {
        console.error('Error al obtener los productos de la API:', error);
        return [];
    }
}

function Producto(producto) {
    const displayTitle = producto.title.substring(0, 40) + '...';
    return `
    <div class="producto">
        <img src="https://images.weserv.nl/?url=${producto.images[0].replace('https://', '')}" alt="">
        <h3>${displayTitle}</h3>
        <p class="precio">$${producto.price.toFixed(2)}</p>
        <button id="btn-agregar-${producto.id}">Agregar</button>
    </div>
    `;
}

function dibujarDatos(json) {
    const filas = json.map(obj => Producto(obj));
    document.querySelector('.productos-grid').innerHTML = filas.join('');

    adjuntarEventosCarrito();
}

function adjuntarEventosCarrito() {
    
    productosGlobales.forEach(producto => {
        const boton = document.getElementById(`btn-agregar-${producto.id}`);
        if (boton) {
            boton.addEventListener('click', () => {

                agregarProductoAlCarrito(producto);
            });
        }
    });
}

function agregarProductoAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    const indiceProductoExistente = carrito.findIndex(item => item.id === producto.id);

    if (indiceProductoExistente !== -1) {
        carrito[indiceProductoExistente].cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            image: producto.images[0],
            cantidad: 1
        });
    }

    localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
    alert(`${producto.title} agregado al carrito!`);
}

document.addEventListener('DOMContentLoaded', async () => {
    await llamarAPI(API_URL);
    if (productosGlobales.length > 0) {
        console.log(productosGlobales)
        dibujarDatos(productosGlobales);
    }
});