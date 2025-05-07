import { useState } from "react";
import IncomeItem from "./IncomeItem";
import IncomeForm from "./IncomeForm";
import { Card, CardHeader, CardBody, Typography, Spinner } from "@material-tailwind/react";

function IncomeList({ incomes, onDelete, onRefresh }) {
  const [editingIncome, setEditingIncome] = useState(null);

  // Group incomes by month and year
  const groupedIncomes = incomes?.reduce((groups, income) => {
    const date = new Date(income.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) {
      groups[key] = {
        monthYear: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        items: []
      };
    }
    groups[key].items.push(income);
    return groups;
  }, {}) || {};

  if (!incomes) {
    return (
      <Card className="w-full">
        <CardHeader
          variant="gradient"
          color="green"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Income History
          </Typography>
        </CardHeader>
        <CardBody className="flex justify-center items-center p-8">
          <Spinner className="h-12 w-12" />
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {editingIncome && (
        <IncomeForm
          editingIncome={editingIncome}
          onIncomeAdded={() => {
            setEditingIncome(null);
            onRefresh();
          }}
          onCancelEdit={() => setEditingIncome(null)}
        />
      )}

      <Card className="w-full">
        <CardHeader
          variant="gradient"
          color="green"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Income History
          </Typography>
        </CardHeader>
        <CardBody className="p-4">
          {Object.keys(groupedIncomes).length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="h5" color="blue-gray" className="mb-2">
                No Income Entries Yet
              </Typography>
              <Typography color="gray" className="font-normal">
                Start adding your income to track your earnings!
              </Typography>
            </div>
          ) : (
            Object.entries(groupedIncomes)
              .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
              .map(([key, { monthYear, items }]) => (
                <div key={key} className="mb-6">
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    {monthYear}
                  </Typography>
                  <div className="space-y-3">
                    {items
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((income) => (
                        <IncomeItem
                          key={income._id}
                          income={income}
                          onDelete={onDelete}
                          onEdit={setEditingIncome}
                        />
                      ))}
                  </div>
                </div>
              )))}
        </CardBody>
      </Card>
    </div>
  );
}

export default IncomeList;