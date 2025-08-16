const express = require('express');
const { 
  getCauses, 
  getCauseById, 
  addCause, 
  updateCause, 
  deleteCause, 
  donateToCause 
} = require('../controllers/causeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCauses);
router.get('/:id', getCauseById);
router.post('/', protect, addCause);
router.put('/:id', protect, updateCause);
router.delete('/:id', protect, deleteCause);
router.post('/:id/donate', protect, donateToCause);

module.exports = router;