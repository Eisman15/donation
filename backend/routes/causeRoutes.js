const express = require('express');
const { createCause, getCauses } = require('../controllers/causeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createCause);
router.get('/', getCauses);

module.exports = router;