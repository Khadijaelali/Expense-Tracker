"use client";

import React, { useEffect, useState } from "react";
import db from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import ExpenseListTable from "./_components/ExpenseListTable";
import { toast } from "sonner";

function ExpensesPage() {
  const [expensesList, setExpensesList] = useState([]);

  // Fetch expenses from the database
  const fetchExpenses = async () => {
    try {
      const result = await db.select().from(Expenses).orderBy(Expenses.id);
      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses.");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-primary">Expenses</h1>

      {/* Expense Table Wrapper */}
      <div className="border border-gray-200 rounded-lg bg-white shadow-md p-6">
        <ExpenseListTable expensesList={expensesList} refreshData={fetchExpenses} />
      </div>
    </div>
  );
}

export default ExpensesPage;
