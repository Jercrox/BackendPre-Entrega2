const socket = io();

socket.on('ProductsIo', (data) => {
  updateProductsList(data);
})

function updateProductsList(productsIo) {
  const productsContainer = document.getElementById('productsContainer');

  productsContainer.innerHTML = '';

  productsIo.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
    <div class="card">
    <h2>${product.title}</h2>
    <p>Descripción: ${product.description}</p>
    <p>Código: ${product.code}</p>
    <p>Precio: ${product.price}</p>
    <p>Status: ${product.status}</p>
    <p>Stock: ${product.stock}</p>
    <p>Categoría: ${product.category}</p>
    <button type="button" class="btn-secundary" onclick="deleteProduct(${product.pid})">
    Eliminar
    </button>
    </div>`;
    productsContainer.appendChild(productDiv);
  });
};


 const form = document.getElementById('formProduct');
 form.addEventListener('submit', function(event) {
     event.preventDefault();



     const formData = {
      title: form.elements.title.value.trim(),
      description: form.elements.description.value.trim(),
      price: Number(form.elements.price.value),
      code: form.elements.code.value.trim(),
      status: true,
      stock: Number(form.elements.stock.value),
      category: form.elements.category.value.trim(),
      tumbnails: []
  };


  if (!formData.title || !formData.description || isNaN(formData.price) || !formData.code || isNaN(formData.stock) || !formData.category) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
  }

     socket.emit('createProduct', formData);
     form.reset();

 });

 function deleteProduct(productId){
  socket.emit('deleteProduct', productId);
 }