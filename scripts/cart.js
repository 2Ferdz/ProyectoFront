document.addEventListener('DOMContentLoaded', () => {
    cargarProductosCarrito();
    escucharFinalizar();
});

function cargarProductosCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    document.querySelector('#cart-items').innerHTML = '';

    let subtotalCalculado = 0;

    if (carrito.length === 0) {
        document.querySelector('#cart-items').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tu carrito está vacío. Agrega productos desde la <a href="index.html">tienda</a>.</td></tr>';
    } else {
        carrito.forEach(producto => {
            const filaHTML = crearFilaProducto(producto);
            document.querySelector('#cart-items').innerHTML += filaHTML;
            subtotalCalculado += producto.price * producto.cantidad;
        });
    }

    actualizarTotalCarrito(subtotalCalculado);

    eventosFila();
}


function crearFilaProducto(producto) {
    const productoSubtotal = (producto.price * producto.cantidad).toFixed(2);
    const displayTitle = producto.title.substring(0, 50) + '...';
    return `
        <tr>
            <td><img src="https://images.weserv.nl/?url=${producto.image.replace('https://', '')}" alt="${producto.title}" style="height: 80px; width: auto; object-fit: contain;"></td>
            <td>${displayTitle}</td>
            <td>$${producto.price.toFixed(2)}</td>
            <td><input type="number" value="${producto.cantidad}" min="1" id="${producto.id}" class="cantidad"></td>
            <td>$${productoSubtotal}</td>
            <td><button id="${producto.id}" class="eliminar"><i class="fas fa-trash-alt"></i></button></td>
        </tr>
    `
}

function actualizarTotalCarrito(subtotal) {
    document.querySelectorAll('#total').forEach(elemento => elemento.innerHTML = subtotal.toFixed(2))
}


function eventosFila() {

    document.querySelectorAll('.eliminar').forEach(boton => {
        boton.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const productId = parseInt(boton.id);
            const indiceProducto = carrito.findIndex(producto => producto.id === productId);
            if (indiceProducto !== -1) {
                carrito.splice(indiceProducto, 1);

                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));

                cargarProductosCarrito();

                console.log(`Producto con ID ${productId} eliminado del carrito`);
            }

        });
    });



    document.querySelectorAll('.cantidad').forEach(input => {
        input.addEventListener('input', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const input = document.activeElement;
            const productId = parseInt(input.id);
            const nuevaCantidad = parseInt(input.value);

            if (nuevaCantidad < 1) {
                input.value = 1;
                return;
            }

            const producto = carrito.find(item => item.id === productId);

            if (producto) {
                producto.cantidad = nuevaCantidad;

                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));

                actualizarTotales();

                console.log(`Cantidad del producto ID ${productId} actualizada a ${nuevaCantidad}`);
            }
        });
    });

}

function actualizarTotales() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    let subtotalCalculado = 0;

    carrito.forEach(producto => {
        subtotalCalculado += producto.price * producto.cantidad;
    });

    const filas = document.querySelectorAll('#cart-items tr');
    filas.forEach(fila => {
        const input = fila.querySelector('.cantidad');
        if (input) {
            const productId = parseInt(input.id);
            const producto = carrito.find(item => item.id === productId);
            if (producto) {
                const subtotalCelda = fila.cells[4];
                const subtotalProducto = (producto.price * producto.cantidad).toFixed(2);
                subtotalCelda.textContent = `$${subtotalProducto}`;
            }
        }
    });

    actualizarTotalCarrito(subtotalCalculado);
}

function escucharFinalizar() {
    const btnFinalizar = document.querySelector('#finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
}

function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }

    const confirmar = confirm('¿Estás seguro de que querés finalizar la compra?');

    if (confirmar) {
        localStorage.removeItem('carritoDeCompras');
        cargarProductosCarrito();

        alert('¡Gracias por tu compra! Tu pedido está siendo procesado.');
    }
}