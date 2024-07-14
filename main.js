#!/bin/env node;
import inquirer from 'inquirer';
import chalk from 'chalk';
class Account {
    accountNumber;
    owner;
    balance;
    constructor(accountNumber, owner) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = 0;
    }
    deposit(amount) {
        this.balance += amount;
    }
    withdraw(amount) {
        if (amount > this.balance) {
            return false;
        }
        this.balance -= amount;
        return true;
    }
    getBalance() {
        return this.balance;
    }
}
class Bank {
    accounts = [];
    createAccount(owner) {
        const accountNumber = `ACC${this.accounts.length + 1}`;
        const account = new Account(accountNumber, owner);
        this.accounts.push(account);
        return account;
    }
    findAccount(accountNumber) {
        return this.accounts.find(account => account.accountNumber === accountNumber);
    }
    getAllAccounts() {
        return this.accounts;
    }
}
const bank = new Bank();
async function main() {
    console.log(chalk.blueBright('****************************************'));
    console.log(chalk.blueBright('*                                      *'));
    console.log(chalk.blueBright('*        Welcome to MyBank App         *'));
    console.log(chalk.blueBright('*                                      *'));
    console.log(chalk.blueBright('****************************************'));
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: ['Create Account', 'Select Account', 'Exit']
            }
        ]);
        switch (action) {
            case 'Create Account':
                await createAccount();
                break;
            case 'Select Account':
                await selectAccount();
                break;
            case 'Exit':
                process.exit(0);
        }
    }
}
async function createAccount() {
    const { owner } = await inquirer.prompt([
        {
            type: 'input',
            name: 'owner',
            message: 'Enter account owner name:'
        }
    ]);
    const account = bank.createAccount(owner);
    console.log(`Account created. Account number: ${account.accountNumber}`);
}
async function selectAccount() {
    const accounts = bank.getAllAccounts();
    if (accounts.length === 0) {
        console.log(chalk.red('No accounts available. Please create an account first.'));
        return;
    }
    const { accountNumber } = await inquirer.prompt([
        {
            type: 'list',
            name: 'accountNumber',
            message: 'Select an account:',
            choices: accounts.map(account => ({
                name: `${account.owner} (Account Number: ${account.accountNumber})`,
                value: account.accountNumber
            }))
        }
    ]);
    const userAccount = bank.findAccount(accountNumber);
    if (userAccount) {
        await accountMenu(userAccount);
    }
    else {
        console.log(chalk.red('Account not found.'));
    }
}
async function accountMenu(account) {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: `What would you like to do for account ${account.accountNumber} (${account.owner})?`,
                choices: ['Deposit', 'Withdraw', 'Check Balance', 'Back to Main Menu']
            }
        ]);
        switch (action) {
            case 'Deposit':
                await deposit(account);
                break;
            case 'Withdraw':
                await withdraw(account);
                break;
            case 'Check Balance':
                await checkBalance(account);
                break;
            case 'Back to Main Menu':
                return;
        }
    }
}
async function deposit(account) {
    const { amount } = await inquirer.prompt([
        {
            type: 'input',
            name: 'amount',
            message: 'Enter amount to deposit:',
            validate: (value) => !isNaN(Number(value)) && Number(value) > 0 || 'Amount must be a positive number'
        }
    ]);
    account.deposit(Number(amount));
    console.log(`Deposited ${amount}. New balance: ${account.getBalance()}`);
}
async function withdraw(account) {
    const { amount } = await inquirer.prompt([
        {
            type: 'input',
            name: 'amount',
            message: 'Enter amount to withdraw:',
            validate: (value) => !isNaN(Number(value)) && Number(value) > 0 || 'Amount must be a positive number'
        }
    ]);
    const success = account.withdraw(Number(amount));
    if (success) {
        console.log(`Withdrew ${amount}. New balance: ${account.getBalance()}`);
    }
    else {
        console.log('Insufficient funds.');
    }
}
async function checkBalance(account) {
    console.log(`Current balance: ${account.getBalance()}`);
}
main();
