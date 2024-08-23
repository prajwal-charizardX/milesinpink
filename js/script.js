function updateCountdown(elementId, targetDate) {
    const countdownElement = document.getElementById(elementId);
    const targetDateTime = new Date(targetDate).getTime();

    function calculateTimeRemaining() {
        const now = new Date().getTime();
        const distance = targetDateTime - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    function displayCountdown() {
        const { days, hours, minutes, seconds } = calculateTimeRemaining();
        countdownElement.innerHTML = `
            <span>${days}d</span> 
            <span>${hours}h</span> 
            <span>${minutes}m</span> 
            <span>${seconds}s</span>
        `;
    }

    // Update countdown every second
    setInterval(displayCountdown, 1000);
}

// Call the function for each countdown element
updateCountdown('countdown1', '2024-10-26T06:00:00'); // Example target date
updateCountdown('countdown2', '2024-10-26T06:00:00'); // Example target date

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        });

        card.addEventListener('mouseout', () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mousedown', () => {
            card.style.transform = 'translateY(-5px) scale(1)';
        });

        card.addEventListener('mouseup', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
    });
});


const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Replace with your Stripe secret key

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    const { name, mobile, email, pan, address, idCard } = req.body;

    // Process payment
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // Amount in cents
        currency: 'usd',
        payment_method: req.body.payment_method_id,
        confirm: true,
    });

    // Send ticket via email
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'YOUR_EMAIL@gmail.com',
            pass: 'YOUR_EMAIL_PASSWORD',
        },
    });

    let info = await transporter.sendMail({
        from: '"Event Tickets" <YOUR_EMAIL@gmail.com>',
        to: email,
        subject: 'Your Ticket for Rotaractor Run: Miles in Pink',
        text: `Dear ${name},\n\nThank you for registering. Your ticket is attached.\n\nRegards,\nRotaract Club of Aagneya`,
        attachments: [
            {
                filename: 'ticket.pdf',
                path: 'path/to/ticket.pdf'
            }
        ]
    });

    res.send('Registration successful and ticket sent!');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
