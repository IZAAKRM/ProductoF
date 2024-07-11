$(document).ready(function () {
    CargarCatalogoProductos();
    cargarCategorias();
});

function CargarCatalogoProductos() {
    fetch('https://localhost:7038/api/Products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Products:', data);
            TablaProductos(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    $('#exampleModal').on('shown.bs.modal', function () {
        $('#productForm').trigger('reset');
    });

    $('#saveProductBtn').click(function () {
        var formData = {
            name: $('#productName').val(),
            description: $('#productDescription').val(),
            price: parseFloat($('#productPrice').val()),
            imageUrl: $('#productImageUrl').val(),
            categoryId: parseInt($('#productCategoryId').val())
        };

        console.log('Nuevo Producto:', formData);

        $('#exampleModal').modal('hide');
    });
}

function TablaProductos(data) {
    $('#tblProductos').DataTable({
        data: data,
        columns: [
            { data: 'id', title: 'ID', orderable: true },
            { data: 'name', title: 'Nombre', orderable: true },
            { data: 'description', title: 'Descripción', orderable: true },
            { data: 'price', title: 'Precio', orderable: true },
            { data: 'categoryId', title: 'ID de Categoría', orderable: true },
            {
                data: 'imageUrl',
                title: 'Imagen',
                orderable: false,
                render: function (data) {
                    return `<img src="${data}" style="max-width: 100px;" alt="Producto">`;
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `<button type="button" class="btn btn-danger btn-sm" onclick="eliminarProducto(${row.id})">Eliminar</button>
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="editarProducto(${row.id})">Editar</button>
                    `;
                }
            }

        ],

        drawCallback: function () {
            $('#tblProductos_paginate').appendTo($('#tblProductos').parent());
        }
    });
}
function Alta() {
    $('#productName').val('');
    $('#productDescription').val('');
    $('#productPrice').val('');
    $('#productImageUrl').val('');
    $('#productCategoryId').val('');
    $('#btnGuardar')
        .text('Guardar')
        .off('click')
        .on('click', function () {
            guardarProducto();
        });
}


function guardarProducto() {
    var name = $('#productName').val();
    var description = $('#productDescription').val();
    var price = parseFloat($('#productPrice').val());
    var imageUrl = $('#productImageUrl').val();
    var categoryId = parseInt($('#productCategoryId').val());

    var url = `https://localhost:7038/api/Products?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}&price=${price}&image_url=${encodeURIComponent(imageUrl)}&category_id=${categoryId}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Nuevo producto creado:', data);
            $('#exampleModal').modal('hide');
            location.reload();
        })
        .catch(error => {
            console.error('Error al crear el producto:', error);
        });
}
function eliminarProducto(id) {
    fetch(`https://localhost:7038/api/Products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Producto eliminado correctamente');
            location.reload();
        })
        .catch(error => {
            console.error('Error eliminando producto:', error);
        });
}
function editarProducto(id) {
    fetch(`https://localhost:7038/api/Products/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(producto => {
            $('#exampleModalLabel').text('Editar Producto');
            $('#productName').val(producto.name);
            $('#productDescription').val(producto.description);
            $('#productPrice').val(producto.price);
            $('#productImageUrl').val(producto.imageUrl);
            $('#productCategoryId').val(producto.categoryId);

            $('#btnGuardar')
                .text('Guardar cambios')
                .off('click')
                .on('click', function () {
                    actualizarProducto(id);
                });

            $('#exampleModal').modal('show');
        })
        .catch(error => {
            console.error('Error obteniendo producto:', error);
        });
}
function cargarCategorias() {
    fetch('https://localhost:7038/api/Categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(categorias => {
            $('#productCategoryId').empty();

            categorias.forEach(categoria => {
                $('#productCategoryId').append(`<option value="${categoria.id}">${categoria.name}</option>`);
            });
        })
        .catch(error => {
            console.error('Error cargando categorías:', error);
        });
}

function actualizarProducto(id) {
    let nombreProducto = $('#productName').val();
    let descripcionProducto = $('#productDescription').val();
    let precioProducto = parseFloat($('#productPrice').val());
    let imagenProducto = $('#productImageUrl').val();
    let categoriaProducto = parseInt($('#productCategoryId').val());

    fetch(`https://localhost:7038/api/Products/${id}?name=${nombreProducto}&description=${descripcionProducto}&price=${precioProducto}&imageUrl=${imagenProducto}&categoryId=${categoriaProducto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Producto actualizado correctamente');

            $('#exampleModal').modal('hide');
            location.reload();
        })
        .catch(error => {
            console.error('Error actualizando producto:', error);
        });
}

