import fs from 'fs';
import __dirname from '../utils.js';

const PATH = `${__dirname}/db/products.json`;

class ProductsManager {
	constructor() {
		this.init();
	}

	async init() {
		if (fs.existsSync(PATH)) {
			console.log('El archivo products.json ya existe.');
		} else {
			try {
				await fs.promises.writeFile(PATH, JSON.stringify([], null, 2), 'utf-8');
				console.log('Se creó el archivo products.json.');
			} catch (error) {
				console.error('Error al crear el archivo:', error);
				process.exit(1);
			}
		}
	}

	async getProducts() {
		try {
			const data = await fs.promises.readFile(PATH, 'utf-8');
			return JSON.parse(data);
		} catch (error) {
			console.error('Error al leer el archivo products.json:', error);
			return null;
		}
	}

	async saveProducts(products) {
		try {
			await fs.promises.writeFile(PATH, JSON.stringify(products, null, 2), 'utf-8');
			return true;
		} catch (error) {
			console.error('Error al escribir en el archivo products.json:', error);
			return false;
		}
	}

	async createProduct(product) {
		const products = await this.getProducts();

		if (!products) {
			return -1;
		}

		const existingProduct = products.find(p => p.code === product.code);

		if (existingProduct) {
			return -2;
		}

		product.pid = products.length > 0 ? products[products.length - 1].pid + 1 : 1;
		products.push(product);

		const saved = await this.saveProducts(products);

		return saved ? product.pid : -1;
	}

	async getProductById(pid) {
		const products = await this.getProducts();
		return products ? products.find(p => p.pid === pid) : null;
	}

	async deleteProduct(pid) {
		let products = await this.getProducts();
		const filteredProducts = products.filter(p => p.pid !== pid);
		const saved = await this.saveProducts(filteredProducts);

		return saved ? filteredProducts : null;
	}

	async updateProduct(pid, updateData) {
		let products = await this.getProducts();
		const index = products.findIndex(p => p.pid === pid);

		if (index === -1) {
			return null;
		}

		products[index] = { ...products[index], ...updateData };
		const saved = await this.saveProducts(products);

		return saved ? products[index] : null;
	}
}

export default ProductsManager;