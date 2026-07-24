const demoProducts = require('../data/demoData');
let localOrders = [];

exports.createOrder = (req, res) => {
    const { items, delivery_address, payment_method } = req.body;
    const order = {
        id: 'local-' + Date.now(),
        order_number: 'NL-' + Date.now(),
        status: 'confirmed',
        total: items.reduce((sum, item) => {
            const product = demoProducts.find(p => p.id === item.product_id);
            return sum + (product ? (product.price || 0) * item.quantity : 0);
        }, 0),
        items: items.map(item => {
            const product = demoProducts.find(p => p.id === item.product_id);
            return {
                product_name: product ? product.name_fr : 'Produit inconnu',
                quantity: item.quantity,
                total_price: product ? (product.price || 0) * item.quantity : 0
            };
        }),
        delivery_address,
        payment_method,
        created_at: new Date().toISOString()
    };
    localOrders.unshift(order);
    res.status(201).json({ data: order });
};

exports.getMyOrders = (req, res) => {
    res.json({ data: localOrders });
};

exports.getOrder = (req, res) => {
    const order = localOrders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json({ data: order });
};
