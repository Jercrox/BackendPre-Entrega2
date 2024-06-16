import { Router } from "express";
import ProductsManagers from '../managers/productsManagers.js';

const router = Router();
const managerProducts = new ProductsManagers();

router.get('/', async (req, res) => {
	const limit = parseInt(req.query.limit);
	let products = await managerProducts.getProducts();
  
	if (products === null) {
	  return res.status(500).send({ status:"error", error: 'Error al leer los productos'});
	}
  
	if (limit) {
	  products = products.slice(0, limit);
	}
  
	res.send({ status:"success", data: products });
  });


router.get('/:pid', async (req, res) => {
	const pid = req.params.pid;

    if (isNaN(pid)) {
	  return res.status(400).send({ status:"error", error: 'El id proporcionado no es numérico'});
    }

	const products = await managerProducts.getProducts();
	const product = products.find(product => product.pid == pid);
	
	if (product === undefined) {
		return res.status(500).send({ status:"error", error: ' No se encontro el producto id:' + pid});
	}
	res.send({ status:"success", data: product })
})

  

router.post('/', async (req, res) => { 
	const product = req.body; 
	console.log('Coneté con router de Productos :) ');
    console.log(req.body);
  
	if (!product.title || !product.description || !product.code || !product.price || !product.category || !product.stock ) {
	  return res.status(400).send({ status:"error", error: 'Faltan datos para crear el producto'});
	} 
  
	try {
	const newProduct = {
		title: product.title,
		description: product.description,
		price: Number(product.price),
		code: product.code,
		status: true,
		stock: Number(product.stock),
		category: product.category,
		thumbnails: []
	   }

	const result = await managerProducts.createProduct(newProduct);
  
	if (result === -1) {
	  return res.status(500).send({ status:"error", error: 'Error al crear el producto'});
	}
	
	res.send({ status:"success", message: 'Producto creado' , payload: result });

    } catch (error) {
	  console.log (error);
	  res.status(500).send({status:'error', error: error});
     }
  });
  


router.delete('/:pid', async (req, res) => {
	
	const pid = req.params.pid;
	const product = await managerProducts.deleteProduct(pid);
	
	if (product === -1) {
		return res.status(500).send({ status:"error", error: 'Error al borrar el producto x'});
	}
	res.send({ status:"success", data: product })
})


router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updateData = req.body;


    if (updateData.pid) {
        delete updateData.pid;
    }

    const result = await managerProducts.updateProduct(pid, updateData);

    if (result === -1) {
        return res.status(500).send({ status: "error", error: 'Error al actualizar el producto' });
    }
    res.send({ status: "success", message: `Producto actualizado id: ${pid}`, data: result })
})


export default router