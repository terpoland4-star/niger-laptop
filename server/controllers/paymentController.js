exports.initiatePayment = (req, res) => {
    res.json({
        success: true,
        gatewayReference: 'DEMO-' + Date.now(),
        message: 'Paiement simulé réussi'
    });
};

exports.checkPaymentStatus = (req, res) => {
    res.json({ status: 'completed' });
};
