import React, { useEffect, useState } from 'react';
import { useJwt } from "./UserStore";
//import { useFlashMessage } from './FlashMessageStore';
import axios from 'axios';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
               const response = await axios.get(import.meta.env.VITE_API_URL + "/api/users/history", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
                setTransactions(response.data);
            } catch (err) {
                setError('Failed to fetch transaction history');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Transaction History</h3>
            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Points Change</th>
                            <th>Transaction Type</th>
                            <th>Order ID</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.transaction_id}>
                                <td>{transaction.transaction_id}</td>
                                <td>{transaction.points_change}</td>
                                <td>{transaction.transaction_type}</td>
                                <td>{transaction.order_id}</td>
                                <td>{transaction.updated_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TransactionHistory;
