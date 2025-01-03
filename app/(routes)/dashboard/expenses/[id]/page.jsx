"use client";

import db from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpenses from "../_components/AddExpenses";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";

function ExpensesScreen({ params }) {
  const [resolvedParams, setResolvedParams] = useState(null);
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  // Resolve params
  useEffect(() => {
    if (params) {
      (async () => {
        const resolved = await params;
        setResolvedParams(resolved);
      })();
    }
  }, [params]);

  useEffect(() => {
    if (user && resolvedParams) {
      getBudgetInfo();
      getExpensesList();
    }
  }, [user, resolvedParams]);

  /**
   * Get Budget Information
   */
  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, resolvedParams.id)) // Use resolvedParams here
        .groupBy(Budgets.id);

      setBudgetInfo(result[0]);
    } catch (error) {
      console.error("Error fetching budget info:", error);
      toast.error("Failed to load budget information.");
    }
  };

  /**
   * Get Latest Expenses
   */
  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, resolvedParams.id))
        .orderBy(desc(Expenses.id));
      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses list:", error);
      toast.error("Failed to load expenses.");
    }
  };

  /**
   * Delete Budget
   */
  const deleteBudget = async () => {
    try {
      const deleteExpenseResult = await db
        .delete(Expenses)
        .where(eq(Expenses.budgetId, resolvedParams.id))
        .returning();

      if (deleteExpenseResult) {
        await db
          .delete(Budgets)
          .where(eq(Budgets.id, resolvedParams.id))
          .returning();
      }

      toast("Budget Deleted!");
      route.replace("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget. Please try again.");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          <EditBudget
            budgetInfo={budgetInfo} // Pass budgetInfo here
            refreshData={() => getBudgetInfo()}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive">
                <Trash /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpenses
          budgetId={resolvedParams?.id}
          user={user}
          refreshData={() => {
            getBudgetInfo();
            getExpensesList();
          }}
        />
      </div>
      <div>
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getExpensesList()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
