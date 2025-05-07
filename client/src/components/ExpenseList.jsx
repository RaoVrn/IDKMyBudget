import ExpenseItem from "./ExpenseItem";
import { Card, CardHeader, CardBody, Typography, Spinner } from "@material-tailwind/react";

function ExpenseList({ expenses, onDelete }) {
  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  if (!expenses) {
    return (
      <Card className="w-full">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Recent Expenses
          </Typography>
        </CardHeader>
        <CardBody className="flex justify-center items-center p-8">
          <Spinner className="h-12 w-12" />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader
        variant="gradient"
        color="blue"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Recent Expenses
        </Typography>
      </CardHeader>
      <CardBody className="p-4">
        {Object.keys(groupedExpenses).length === 0 ? (
          <div className="text-center py-8">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              No Expenses Yet
            </Typography>
            <Typography color="gray" className="font-normal">
              Start adding your expenses to track your spending!
            </Typography>
          </div>
        ) : (
          Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
            <div key={date} className="mb-6">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                {date}
              </Typography>
              <div className="space-y-3">
                {dayExpenses.map((expense) => (
                  <ExpenseItem
                    key={expense._id}
                    expense={expense}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

export default ExpenseList;
