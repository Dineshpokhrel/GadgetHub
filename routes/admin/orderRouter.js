const { Router } = require('express');
const orderController = require('../../controllers/admin/ordercontroller');
const router = Router();

router.get('/orders', orderController.getOrders);
router.get('/order/invoice/:id', orderController.getOrderInvoice);
router.patch('/order/:id', orderController.updateOrder);
router.delete('/order/:id', orderController.deleteOrder);

module.exports = router;
