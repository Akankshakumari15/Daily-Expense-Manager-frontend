import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {

    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');

    const [expenses, setExpenses] = useState([]);
    const [todayTotal, setTodayTotal] = useState(0);
    const [yesterdayTotal, setYesterdayTotal] = useState(0);
    const [last7DaysTotal, setLast7DaysTotal] = useState(0);
    const [last30DaysTotal, setLast30DaysTotal] = useState(0);
    const [currentYearTotal, setCurrentYearTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    // pie chart
    const pieData = {
        labels: expenses.map(exp => exp.ExpenseItem),
        datasets: [{
            label: 'Expense Cost',
            data: expenses.map(exp => parseFloat(exp.ExpenseCost)),
            backgroundColor: ['yellow', 'blue', '#00ff00', 'rgba(255,99,45,0.9)', 'skyblue', 'magenta', 'black', 'peach', 'gold'],
            borderWidth: 1,
        },],
    };
    const fetchExpenses = useCallback(async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }
            const data = await response.json();
            setExpenses(data);
            calculateTotals(data);
        } catch (error) {
            console.error("Error fetching expenses!", error)
        }

    }, []);
    useEffect(() => {
        if (!userId) {
            navigate('/login')
        }
        fetchExpenses(userId);
    }, [navigate, userId, fetchExpenses]);



    const calculateTotals = (data) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 7);
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);
        const currentYear = today.getFullYear();

        let todaySum = 0, yesterdaySum = 0, last7Sum = 0, last30Sum = 0, yearSum = 0, grandTotal = 0;

        data.forEach(item => {
            const expenseDate = new Date(item.ExpenseDate);
            const amount = parseFloat(item.ExpenseCost) || 0;
            if (expenseDate.toDateString() === today.toDateString()) {
                todaySum += amount;
            }


            if (expenseDate.toDateString() === yesterday.toDateString()) {
                yesterdaySum += amount;
            }
            if (expenseDate >= last7Days) {
                last7Sum += amount;
            }
            if (expenseDate >= last30Days) {
                last30Sum += amount;
            }
            if (expenseDate.getFullYear() === currentYear) {
                yearSum += amount;
            }
            grandTotal = grandTotal + amount;
        })
        setTodayTotal(todaySum);
        setYesterdayTotal(yesterdaySum);
        setLast7DaysTotal(last7Sum);
        setLast30DaysTotal(last30Sum);
        setCurrentYearTotal(yearSum);
        setGrandTotal(grandTotal);

    }

    return (
        <div className='container-fluid pt-4' style={{ background: 'linear-gradient(135deg, #EAF4FF, #CFE8FF)', minHeight: '100vh' }} >
            <div className='text-center'>
                <h2 >Welcome, {userName}!</h2>
                <p className='text-muted'>Here's your expense overview</p>
            </div>

            <div className='row g-3'>
                <div className='col-md-4'>
                    <div className='card bg-primary text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-day me-2'></i>Today's expense</h5>
                            <p className='card-text fs-4'>₹{todayTotal}</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card bg-success text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-minus me-2'></i>Yesterday's expense</h5>
                            <p className='card-text fs-4'>₹{yesterdayTotal}</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card bg-warning text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-week me-2'></i>Last 7 days expense</h5>
                            <p className='card-text fs-4'>₹{last7DaysTotal}</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card bg-warning text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar-alt me-2'></i>Last 30 days expense</h5>
                            <p className='card-text fs-4'>₹{last30DaysTotal}</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card bg-secondary text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-calendar me-2'></i>Current Year</h5>
                            <p className='card-text fs-4'>₹{currentYearTotal}</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card bg-danger text-white text-center mb-3' style={{ height: '150px' }}>
                        <div className='card-body'>
                            <h5 className='card-title'><i className='fas fa-wallet me-2'></i>Grand Total</h5>
                            <p className='card-text fs-4'>₹{grandTotal}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* pie chart */}
            <div className='my-5 ' style={{ width: '400px', height: '400px', margin: 'auto' }}>
                <h4 className='text-center'>
                    Expense Distribution
                </h4>
                <Pie data={pieData} />
            </div>

        </div>
    )
}

export default Dashboard