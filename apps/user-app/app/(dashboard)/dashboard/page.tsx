import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { SentTransactions } from "../../../components/SentTransactions";
import prisma from "@repo/db/client";
import { OnRampStatus } from "@prisma/client";

async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getOnRampTransactions(status: OnRampStatus) {
  const session = await getServerSession(authOptions);
  const transactions = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
      status: status,
    },
  });
  return transactions.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const sentTransactions = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
  });
  const receivedTransactions = await prisma.p2pTransfer.findMany({
    where: {
      toUserId: Number(session?.user?.id),
    },
  });
  return {
    sent: sentTransactions.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      status: "Sent", // Add a default status
      provider: "P2P", // Add a default provider
      transactionType: "Sent",
    })),
    received: receivedTransactions.map((t) => ({
      time: t.timestamp,
      amount: t.amount,
      status: "Received", // Add a default status
      provider: "P2P", // Add a default provider
      transactionType: "Received",
    })),
  };
}

export default async function Dashboard() {
  const balance = await getBalance();
  const successTransactions = await getOnRampTransactions(OnRampStatus.Success);
  const processingTransactions = await getOnRampTransactions(
    OnRampStatus.Processing
  );
  const failureTransactions = await getOnRampTransactions(OnRampStatus.Failure);
  const p2pTransactions = await getP2PTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Dashboard
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <BalanceCard amount={balance.amount} locked={balance.locked} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Recent P2P Transactions</h2>
          <P2PTransactions
            transactions={[
              ...p2pTransactions.sent,
              ...p2pTransactions.received,
            ]}
          />
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-bold">Wallet Transactions</h2>
          <OnRampTransactions
            title="Successful Transactions"
            transactions={successTransactions}
          />
          <OnRampTransactions
            title="Processing Transactions"
            transactions={processingTransactions}
          />
          <OnRampTransactions
            title="Failed Transactions"
            transactions={failureTransactions}
          />
        </div>
        <div className="col-span-2">
          <h2 className="text-2xl font-bold">Sent Transactions</h2>
          <SentTransactions transactions={p2pTransactions.sent} />
        </div>
      </div>
    </div>
  );
}
