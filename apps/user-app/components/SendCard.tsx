"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSendMoney = async () => {
    try {
      const result = await p2pTransfer(number, amount * 100);
      if (result.success) {
        toast.success(result.message);
        setNumber("");
        setAmount(0);
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="h-[90vh]">
      <Card title="Send">
        <div className="w-full">
          <TextInput
            label={"Number"}
            placeholder={"Number"}
            // value={number}
            onChange={(value) => {
              setNumber(value);
            }}
          />

          <TextInput
            label={"Amount"}
            placeholder={"Amount"}
            // value={amount}
            onChange={(value) => {
              setAmount(Number(value));
            }}
          />

          <div className="flex justify-center pt-4">
            <Button onClick={handleSendMoney}>Send Money</Button>
          </div>
        </div>
      </Card>
      <ToastContainer />
    </div>
  );
}
