"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import db from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";

// Dynamically import EmojiPicker to avoid server-side rendering issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon || "😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(budgetInfo?.name || "");
  const [amount, setAmount] = useState(budgetInfo?.amount || 0);
  const { user } = useUser();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo.icon || "😊");
      setName(budgetInfo.name || "");
      setAmount(budgetInfo.amount || 0);
    }
  }, [budgetInfo]);

  const onUpdateBudget = async () => {
    if (!budgetInfo?.id) {
      toast.error("Budget information is incomplete. Please refresh and try again.");
      return;
    }
  
    try {
      const result = await db
        .update(Budgets)
        .set({
          name,
          amount,
          icon: emojiIcon,
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();
  
      if (result) {
        refreshData(); // Refresh the data after update
        toast("Budget Updated!");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget. Please try again.");
    }
  };
  

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PenBox /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <div className="text-sm text-muted-foreground">
              <div className="mt-5">
                <Button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg rounded flex items-center"
                  variant="outline"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setEmojiIcon(e.emoji);
                        setOpenEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <Input
                  placeholder="e.g. Home Decor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input
                  type="number"
                  placeholder="e.g. 5000$"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
