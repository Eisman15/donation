const express = require('express');
const { createCause, getCauses, updateCause, deleteCause } = require('../controllers/causeController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getCauses);
router.post('/', protect, adminOnly, createCause);
router.put('/:id', protect, adminOnly, updateCause);
router.delete('/:id', protect, adminOnly, deleteCause);

module.exports = router;