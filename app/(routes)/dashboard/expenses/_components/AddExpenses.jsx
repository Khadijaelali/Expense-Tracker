import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import React, { useState } from "react";
import { toast } from "sonner";
import moment from "moment";

function AddExpenses({ budgetId, refreshData }) {
  const [amount, setAmount] = useState(""); // Default to empty string
  const [name, setName] = useState(""); // Default to empty string

  const handleAmountChange = (value) => {
    // Validate input: Allow only numeric values
    if (!/^\d*\.?\d*$/.test(value)) {
      toast.error("Please enter a valid numeric amount.");
      return;
    }
    setAmount(value); // Update state only if input is valid
  };

  const addNewExpense = async () => {
    if (!name || !amount) {
      toast.error("Please fill in all fields.");
      return;
    }

    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: Number(amount), // Ensure amount is a number
        budgetId: budgetId,
        createdAt: moment().format("YYYY-MM-DD"), // Use ISO format
      })
      .returning();

    if (result.length > 0) {
      toast.success("New Expense Added!");
      refreshData(); // Re-fetch the data to update the table
      setName(""); // Reset the form
      setAmount("");
    }
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name} // Controlled input
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="text" // Keep as text to handle numeric validation manually
          placeholder="e.g. 1000$"
          value={amount} // Controlled input
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={addNewExpense}
        className="mt-3 w-full"
      >
        Add New Expense
      </Button>
    </div>
  );
}

export default AddExpenses;
