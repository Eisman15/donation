const express = require('express');
const { createCause, getCauses, updateCause, deleteCause } = require('../controllers/causeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createCause);
router.get('/', getCauses);
router.put('/:id', protect, updateCause);
router.delete('/:id', protect, deleteCause);

module.exports = router;