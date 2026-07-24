exports.sendOTP = (req, res) => {
    res.json({ message: 'Code envoyé (simulation)' });
};

exports.verifyOTP = (req, res) => {
    const { phone, code, first_name, last_name } = req.body;
    res.json({
        data: {
            id: 'demo-' + Date.now(),
            email: phone + '@demo.com',
            full_name: (first_name || '') + ' ' + (last_name || '')
        }
    });
};
