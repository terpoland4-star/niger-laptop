const demoProducts = require('../data/demoData');

exports.getAllProducts = (req, res) => {
    let products = [...demoProducts];
    if (req.query.search) {
        const q = req.query.search.toLowerCase();
        products = products.filter(p =>
            (p.name_fr && p.name_fr.toLowerCase().includes(q)) ||
            (p.name_en && p.name_en.toLowerCase().includes(q)) ||
            (p.description_fr && p.description_fr.toLowerCase().includes(q)) ||
            (p.description_en && p.description_en.toLowerCase().includes(q))
        );
    }
    res.json({ data: products, pagination: { page: 1, totalPages: 1, total: products.length } });
};

exports.getProduct = (req, res) => {
    const product = demoProducts.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({ data: product });
};
