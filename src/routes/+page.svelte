<script lang="js">
  // @ts-nocheck

  import { round, uuid } from "$src/utils";
  class Person {
    constructor(id, name, salary, ratio, expenses, paid, balance) {
      this.id = id;
      this.name = name;
      this.salary = salary;
      this.ratio = ratio;
      this.expenses = expenses;
      this.paid = paid;
      this.balance = balance;
      this.balanceBfrRatio = balance;
    }
  }

  // declare array of person
  let persons = [
    new Person(uuid(), "John", 1000),
    new Person(uuid(), "Mary", 2000),
    new Person(uuid(), "Bob", 3000),
    new Person(uuid(), "Alice", 2300),
    new Person(uuid(), "Eve", 1500),
    new Person(uuid(), "Mallory", 1200),
  ];

  // declare total salary
  let totalSalary = 0;

  // calculate total salary
  for (let person of persons) {
    totalSalary += person.salary;
  }

  // declare average salary
  let averageSalary = totalSalary / persons.length;

  class Expense {
    constructor(id, name, amount, payedBy, sharedBy) {
      this.id = id;
      this.name = name;
      this.amount = amount;
      this.payedBy = payedBy;
      this.sharedBy = sharedBy;
    }
  }

  // declare array of expense
  let expenses = [
    new Expense(uuid(), "Food", 100, "John", ["John", "Mary"]),
    new Expense(uuid(), "Rent", 300, "Mary", ["John", "Mary", "Bob"]),
    new Expense(uuid(), "Transport", 200, "Bob", ["Bob", "Mary"]),
    new Expense(uuid(), "Food", 100, "Alice", ["Alice", "Eve"]),
    new Expense(uuid(), "Rent", 300, "Eve", ["Alice", "Eve", "Mallory"]),
    new Expense(uuid(), "Transport", 200, "Mallory", ["Mallory", "Eve"]),
    new Expense(uuid(), "Food", 50, "John", ["John", "Mary"]),
  ];

  // declare total expense
  let totalExpense = 0;

  // calculate total expense
  for (let expense of expenses) {
    totalExpense += expense.amount;
  }

  // calculate ratio of individual salary to total salary and assign to person
  for (let person of persons) {
    person.ratio = person.salary / totalSalary;
  }

  // calculate expenses of individual person
  for (let person of persons) {
    person.expenses = 0;
    for (let expense of expenses) {
      if (expense.sharedBy.includes(person.name)) {
        person.expenses += expense.amount / expense.sharedBy.length;
      }
    }
  }

  // calculate paid by individual person
  for (let person of persons) {
    person.paid = 0;
    for (let expense of expenses) {
      if (expense.payedBy === person.name) {
        person.paid += expense.amount;
      }
    }
  }

  // calculate balance of individual person
  for (let person of persons) {
    person.balance = person.paid - person.expenses;
    person.balanceBfrRatio = person.balance;
  }

  // determine who should pay whom
  let payers = [];
  let payees = [];
  for (let person of persons) {
    if (person.balance > 0) {
      payers.push(person);
    } else if (person.balance < 0) {
      payees.push(person);
    }
  }

  // determine transactions to be made
  let transactions = [];
  for (let payer of payers) {
    for (let payee of payees) {
      if (payer.balance > 0 && payee.balance < 0) {
        let transaction = {
          toPay: payer.name,
          toReceive: payee.name,
          amount: Math.min(payer.balance, -payee.balance),
        };
        transactions.push(transaction);
        payer.balance -= transaction.amount;
        payee.balance += transaction.amount;
      }
    }
  }

  console.log(persons);
  console.log(transactions);
</script>

<h1>Persons</h1>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Salary</th>
      <th>Ratio</th>
      <th>Expenses</th>
      <th>Paid</th>
      <th>Balance</th>
    </tr>
  </thead>
  <tbody>
    {#each persons as person}
      <tr>
        <td>{person.name}</td>
        <td>{person.salary}</td>
        <td>{round(person.ratio)}%</td>
        <td>{person.expenses}</td>
        <td>{person.paid}</td>
        <td>{person.balanceBfrRatio}</td>
      </tr>
    {/each}
    <!-- add a person -->
    <tr>
      <form method="POST" action="/persons">
        <td><input type="text" name="name" placeholder="Name" /></td>
        <td><input type="number" name="salary" placeholder="Salary" /></td>
        <td />
        <td />
        <td />
        <td />
        <td><button type="submit">Add</button></td>
      </form></tr
    >
    <tr>
      <td>Total</td>
      <td>{totalSalary} (avg: {round(averageSalary)})</td>
      <td />
    </tr>
  </tbody>
</table>
<h1>Expenses</h1>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Amount</th>
      <th>Payed by</th>
      <th>Shared by</th>
    </tr>
  </thead>
  <tbody>
    {#each expenses as expense}
      <tr>
        <td>{expense.name}</td>
        <td>{expense.amount}</td>
        <td>{expense.payedBy}</td>
        <td>{expense.sharedBy.join(", ")}</td>
      </tr>
    {/each}
    <!-- add an expense -->
    <tr>
      <td><input type="text" placeholder="Name" /></td>
      <td><input type="number" placeholder="Amount" /></td>
      <td><input type="text" placeholder="Shared by" /></td>
      <td><button>Add</button></td>
    </tr>
    <tr>
      <td>Total</td>
      <td>{totalExpense}</td>
      <td />
    </tr></tbody
  >
</table>

<h1>Transactions</h1>

<table>
  <thead>
    <tr>
      <th>From</th>
      <th>To</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    {#each transactions as transaction}
      <tr>
        <td>{transaction.toReceive}</td>
        <td>{transaction.toPay}</td>
        <td>{transaction.amount}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
  }

  table,
  th,
  td {
    border: 1px solid black;
  }

  th,
  td {
    padding: 5px;
  }

  th {
    text-align: left;
  }
</style>
