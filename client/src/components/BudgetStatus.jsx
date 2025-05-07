import { useState, useEffect } from "react";
import budgetService from "../services/budgetService";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  Typography,
  Progress,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

function BudgetStatus({ onEdit }) {
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const fetchBudgetStatus = async () => {
    try {
      const data = await budgetService.getBudgetStatus();
      setBudgetStatus(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch budget status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetStatus();
  }, []);

  const getProgressColor = (status) => {
    switch (status) {
      case 'exceeding':
        return 'red';
      case 'warning':
        return 'amber';
      default:
        return 'green';
    }
  };

  const handleDelete = async () => {
    try {
      await budgetService.deleteBudget(selectedBudget._id);
      toast.success("Budget deleted successfully");
      fetchBudgetStatus();
      setDeleteDialogOpen(false);
      setSelectedBudget(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete budget");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="flex justify-center items-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
        </CardBody>
      </Card>
    );
  }

  if (budgetStatus.length === 0) {
    return (
      <Card>
        <CardBody className="text-center p-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            No Budgets Set
          </Typography>
          <Typography color="gray" className="font-normal">
            Start by setting budgets for your expense categories!
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {budgetStatus.map((budget) => (
          <Card key={budget.category} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {budget.category}
                  </Typography>
                  <Typography color="gray" className="text-sm font-normal">
                    ₹{budget.spent.toLocaleString()} of ₹{budget.budgetAmount.toLocaleString()}
                  </Typography>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    size="sm"
                    onClick={() => onEdit(budget)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="red"
                    size="sm"
                    onClick={() => {
                      setSelectedBudget(budget);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </IconButton>
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <Typography variant="small" color={getProgressColor(budget.status)}>
                    {budget.percentage.toFixed(1)}% Used
                  </Typography>
                  {budget.alert.enabled && budget.status !== 'ok' && (
                    <Typography
                      variant="small"
                      color={budget.status === 'exceeding' ? 'red' : 'amber'}
                      className="flex items-center gap-1"
                    >
                      <span>⚠️</span>
                      {budget.status === 'exceeding'
                        ? 'Budget Exceeded!'
                        : `Near ${budget.alert.threshold}% threshold`}
                    </Typography>
                  )}
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  color={getProgressColor(budget.status)}
                  className="h-1"
                />
              </div>

              {budget.status !== 'exceeding' && (
                <Typography className="mt-2 text-sm" color="gray">
                  ₹{budget.remaining.toLocaleString()} remaining
                </Typography>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} handler={() => setDeleteDialogOpen(false)} size="xs">
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody divider>
          Are you sure you want to delete the budget for {selectedBudget?.category}?
          This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => setDeleteDialogOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default BudgetStatus;