
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ManageExpense from './components/ManageExpense';
import ExpenseReport from './components/ExpenseReport';
import ChangePassword from './components/ChangePassword';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar> </Navbar>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/add-expense" element={<AddExpense></AddExpense>}></Route>
          <Route path="/manage-expense" element={<ManageExpense></ManageExpense>}></Route>
          <Route path='/expense-report' element={<ExpenseReport></ExpenseReport>}></Route>
          <Route path='/change-password' element={<ChangePassword></ChangePassword>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
