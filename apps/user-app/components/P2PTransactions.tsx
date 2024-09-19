"use client";

import { useState } from "react";
import { Card } from "@repo/ui/card";

export const P2PTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    transactionType: string;
  }[];
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!transactions.length) {
    return (
      <Card title="P2P Transactions">
        <div className="text-center pb-8 pt-8">No transactions</div>
      </Card>
    );
  }

  return (
    <Card title="P2P Transactions">
      <div className="pt-2 flex flex-col gap-4">
        {paginatedTransactions.map((t, index) => (
          <div key={index} className="flex justify-between">
            <div>
              {t.transactionType === "Sent" ? (
                <div className="text-sm">Sent INR</div>
              ) : (
                <div className="text-sm">Received INR</div>
              )}
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {t.transactionType === "Sent" ? <>-</> : <>+</>} Rs{" "}
              {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Card>
  );
};
