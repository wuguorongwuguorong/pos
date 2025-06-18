const express = require('express');
const router = express.Router();
const userData = require('../data/userData');
const bcrypt = require('bcrypt');

async function registerUser({ User_name, email, phone, password}) {
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    const existingUser = await userData.getUserByEmail(email);
    if (existingUser) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await userData.createUser({
        User_name,
        email,
        phone,
        password: hashedPassword
        
    });
}

async function loginUser(email, password) {
    const user = await userData.getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return user;
}

// // POST login a user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await userService.loginUser(email, password);
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign(
//       { userId: user.customer_id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ message: 'Login successful', token });
//   } catch (e) {
//     console.error('Login error:', e);
//     res.status(500).json({ message: 'Server error during login', error: e.message });
//   }
// });


async function getUserDetailsById(id) {
    return await userData.getUserById(id);
  }

async function updateUserDetails(id, userDetails) {
    return await userData.updateUser(id, userDetails);
}

async function deleteUserAccount(id) {
    return await userData.deleteUser(id);
  }

async function getUserHistoryById(customer_id) {
    if (!customer_id || typeof customer_id !== 'number') {
        throw new Error('Invalid Customer ID');
    }

    // SQL query to fetch the user's transaction history
    const [transactions] = await pool.getUserTransactionById(`
        SELECT 
            ct.transaction_id, 
            ct.points_change, 
            ct.transaction_type, 
            ct.updated_at, 
            o.order_id
        FROM customer_transactions ct
        LEFT JOIN order_transaction o ON ct.order_id = o.order_id
        WHERE ct.customer_id = ?
        ORDER BY ct.updated_at DESC;
    `, [customer_id]);

    return transactions;
}

module.exports = {
    registerUser,
    loginUser,
    getUserDetailsById,
    updateUserDetails,
    deleteUserAccount,
    getUserHistoryById
};


