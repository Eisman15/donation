
const express = require('express');
const router = express.Router();
const { createCause, getCauses, updateCause, deleteCause, archiveCause } = require('../controllers/causeController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');


router.get('/', getCauses);

// admin actions
router.post('/', protect, adminOnly, createCause);
router.put('/:id', protect, adminOnly, updateCause);
router.delete('/:id', protect, adminOnly, deleteCause);      

module.exports = router;
