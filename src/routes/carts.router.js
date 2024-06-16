import { Router } from "express";
import CartsManagers from '../managers/cartsManagers.js';
import ProductsManagers from '../managers/productsManagers.js';

const router = Router();
const managerCarts = new CartsManagers();
const managerProducts = new ProductsManagers();


router.post('/', async (req, res) => {
	const cart = req.body;

	const result = await managerCarts.createCart(cart);
      if (result === -1) {
      return res.status(500).send({ status:"error", error: 'Error al crear el producto'});
    }
    res.send({ status:"success", message: `Producto creado id: ${result}`, data: result }); 
   })


router.get('/:cid', async (req, res) => {
	const cid = req.params.cid;

    if (isNaN(cid)) {
	  return res.status(400).send({ status:"error", error: 'El id proporcionado no es un número'});
    }

	const carts = await managerCarts.getCarts();
	const cart = carts.find(cart => cart.cid == cid);
	const ProductToCart = cart.products
	
	if (cart === undefined) {
		return res.status(500).send({ status:"error", error: ' No se encuentra el producto id:' });
	}
	res.send({ status:"success", data: ProductToCart })
})


router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).send({ status: "error", error: 'El cid o el pid proporcionado no es numérico' });
    }

    const carts = await managerCarts.getCarts();
    const cart = carts.find(cart => cart.cid == cid);

    if (!cart) {
        return res.status(404).send({ status: "error", error: 'Carrito no encontrado' });
    }

    const products = await managerProducts.getProducts();
    const product = products.find(product => product.pid == pid);

    if (!product) {
        return res.status(404).send({ status: "error", error: 'Producto no encontrado con id: ' + pid});
    }

    let quantity = parseInt(req.body.quantity) || 1;

    const productIndex = cart.products.findIndex(p => p.product === pid);

    if (productIndex !== -1) {

        cart.products[productIndex].quantity += quantity;
    } else {

        cart.products.push({
            product: pid,
            quantity: quantity
        });
    }

    const updateResult = await managerCarts.updateCart(cid, cart);
    if (updateResult === -1) {
        return res.status(500).send({ status: "error", error: 'Error al actualizar el carrito' });
    }

    res.send({ status: "success", message: 'Producto agregado/actualizado en el carrito', data: cart });
});

export default router
