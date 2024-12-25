"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import db from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { DialogClose } from "@radix-ui/react-dialog";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

function CreateBudget({refreshData}) {
  const [emojiIcon, setEmojiIcon] = useState("😊");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name,setName] =useState(); 
  const[amount,setAmount]=useState(); 
  const {user}=useUser(); 
  const onCreateBudget=async()=>{
    const result =await db.insert(Budgets)
    .values({
        name:name,
        amount:amount,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        icon:emojiIcon
    }).returning({insertedId:Budgets.id})
    if(result)
    {
      refreshData()
        toast('New Budget Created !')
    }


  }  
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-gray-100 p-10 rounded-md flex flex-col items-center border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2 className="text-lg font-medium">Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <div className="text-sm text-muted-foreground">
              <div className="mt-5">
                <Button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-lg rounded flex items-center "
                  variant="outline"
                  
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                {openEmojiPicker && (
                  <div className="absolute mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg">
                    <EmojiPicker
                      onEmojiClick={(e) => {setEmojiIcon(e.emoji)
                        setOpenEmojiPicker(false)
                      }}
                    />
                  </div>
                  
                )}
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <Input 

                placeholder="e.g Home Decor"
                onChange={(e)=>setName(e.target.value)} />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input 
                type="number"
                placeholder="e.g 500$"
                onChange={(e)=>setAmount(e.target.value)} />
              </div>
              

            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
          <Button 
              disabled={!(name&&amount)}
              onClick={()=>onCreateBudget()}
              className="mt-5 w-full">Create Budget</Button>
          </DialogClose>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
