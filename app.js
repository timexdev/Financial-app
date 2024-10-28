
function hashPassword(password) {
    return btoa(password); 
}

// Funtion to register a new user
function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists.');
        return;
    }

    const newUser = {
        username: username,
        password: hashPassword(password),
        balance: 0,
        transactions: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    window.location.href = 'login.html';
}

// Function to login the user
function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = hashPassword(password);

    const user = users.find(user => user.username === username && user.password === hashedPassword);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password.');
    }
}

// Function to display dashboard after successful login
function showDashboard(user) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');

    document.getElementById('username-display').textContent = user.username;
    document.getElementById('balance-display').textContent = user.balance;
    loadTransactionHistory(user);
}

// Funtion to deposit money
function deposit() {
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    user.balance += amount;
    user.transactions.push({ type: 'deposit', amount, date: new Date().toLocaleDateString() });

    updateUserInStorage(user);
    alert('Deposit successful.');
    updateDashboard(user);
}

// Funtion to withdraw money
function withdraw() {
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (isNaN(amount) || amount <= 0 || amount > user.balance) {
        alert('Please enter a valid amount or insufficient balance.');
        return;
    }

    user.balance -= amount;
    user.transactions.push({ type: 'withdraw', amount, date: new Date().toLocaleDateString() });

    updateUserInStorage(user);
    alert('Withdraw successful.');
    updateDashboard(user);
}

// Function to transfer funds
function transferFunds() {
    const recipientUsername = document.getElementById('transfer-username').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const recipient = users.find(u => u.username === recipientUsername);

    if (!recipient || recipient.username === user.username) {
        alert('Invalid recipient.');
        return;
    }

    if (isNaN(amount) || amount <= 0 || amount > user.balance) {
        alert('Invalid amount or insufficient balance.');
        return;
    }

    // Update sender and recipient balances
    user.balance -= amount;
    recipient.balance += amount;

    // Add transactions for both users
    user.transactions.push({ type: 'transfer sent', amount, date: new Date().toLocaleDateString(), to: recipientUsername });
    recipient.transactions.push({ type: 'transfer received', amount, date: new Date().toLocaleDateString(), from: user.username });

    updateUserInStorage(user);
    updateUserInStorage(recipient);
    alert('Transfer successful.');
    updateDashboard(user);
}

// Function to load transaction history for the user
function loadTransactionHistory(user) {
    const historyElement = document.getElementById('transaction-history');
    historyElement.innerHTML = '';

    user.transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `${transaction.type} of $${transaction.amount} on ${transaction.date}`;
        if (transaction.to) li.textContent += ` to ${transaction.to}`;
        if (transaction.from) li.textContent += ` from ${transaction.from}`;
        historyElement.appendChild(li);
    });
}

// Function to update the user's data in localStorage and the dashboard
function updateUserInStorage(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === updatedUser.username);

    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    }
}

function updateDashboard(user) {
    document.getElementById('balance-display').textContent = user.balance;
    loadTransactionHistory(user);
}

// Funtion to Logout the user
function logout() {
    // localStorage.removeItem('loggedInUser');
    // location.reload(); // Refresh the page to show login/register again
    window.location.href = 'index.html';
}

// Funtion to automatically check if the user is already logged in
window.onload = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        showDashboard(loggedInUser);
    }
};



// Show dashboard after successful login
function showDashboard() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
  
    // Redirect to login page if no user is logged in
    if (!user) {
      window.location.href = 'login.html';  // Redirect to login if no logged-in user
      return;
    }
  
    // Update the username and balance in the dashboard
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('balance-display').textContent = user.balance;
  
    // Load the user's transaction history
    loadTransactionHistory(user);
  }
  
  // Load transaction history for the user
  function loadTransactionHistory(user) {
    const historyElement = document.getElementById('transaction-history');
    historyElement.innerHTML = ''; // Clear previous history
  
    user.transactions.forEach(transaction => {
      const li = document.createElement('li');
      li.textContent = `${transaction.type} of $${transaction.amount} on ${transaction.date}`;
      if (transaction.to) li.textContent += ` to ${transaction.to}`;
      if (transaction.from) li.textContent += ` from ${transaction.from}`;
      historyElement.appendChild(li);
    });
  }
  