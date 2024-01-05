const express = require('express');
const router = express.Router();
const Booking = require('../model/booking');

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user').populate('item');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Confirm booking
router.patch('/confirm/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'confirmed' }, { new: true });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Reject booking
router.patch('/reject/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
