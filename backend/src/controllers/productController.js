import {getProducts, findPk, create, update} from "../services/product.service.js";


export const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // si no pasa de page, usa la 1
    const limit = 8; //cant productos por pag
    const category  = req.query.category || '';
    const search = req.query.search || '';
    const showOnlyActive = req.query.active === 'true';

    try {
        const data = await getProducts(page, limit, category, search, showOnlyActive);

        res.status(200).json({
            message: "Productos encontrados",
            payload: data.products,
            totalItems: data.totalItems,
            totalPages: data.totalPages
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, img, category, active} = req.body;
        if(!name || !description || !price || !img || !category || active === undefined){
            return res.status(400).json({message: "Completa todos los campos"});
        }
        await create({name, description, price, img, category, active});    
        res.redirect("/api/admin/products");

    console.log(req.body);
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export const findProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const productFound = await findPk(id)
        if(!productFound){
            return res.status(404).json({message: "Producto no encontrado"});
        }
        res.status(201).json({ message: "Producto encontrado con éxito", payload: productFound });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productFound = await findPk(id);
        if (!productFound) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        const { name, description, price, img, category, active } = req.body;
        if (!name || !description || !price || !img || !category || active === undefined) {
            return res.status(400).json({ message: "Completa todos los campos" });
        }
        await update(id, { name, description, price, img, category, active }); //un arreglo con el número de filas afectadas
        res.status(200).json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const productFound = await findPk(id);

        if (!productFound) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const newState = !productFound.active;

        await productFound.update({ active: newState });

        res.status(200).json({
            message: `Producto ${newState ? "activado" : "desactivado"} con éxito`,
            payload: productFound
        });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}