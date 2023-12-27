var express = require('express')
const router = express.Router()

const warehouse = require('../App/controllers/Warehouse.js');
router.get('/add-warehouse', warehouse.addWarehouse);
router.patch('/update-warehouse', warehouse.updateWarehouse);
router.delete('/delete-warehouse/:id', warehouse.deleteWarehouse);

module.exports = router