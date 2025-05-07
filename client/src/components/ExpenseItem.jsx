import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";

const getCategoryIcon = (category) => {
  const icons = {
    "Food & Dining": "🍽️",
    "Transportation": "🚗",
    "Shopping": "🛍️",
    "Entertainment": "🎮",
    "Bills & Utilities": "📱",
    "Health & Medical": "🏥",
    "Travel": "✈️",
    "Education": "📚",
    "Other": "📦",
  };
  return icons[category] || "📝";
};

const getCategoryColor = (category) => {
  const colors = {
    "Food & Dining": "blue",
    "Transportation": "green",
    "Shopping": "red",
    "Entertainment": "amber",
    "Bills & Utilities": "purple",
    "Health & Medical": "pink",
    "Travel": "indigo",
    "Education": "cyan",
    "Other": "gray",
  };
  return colors[category] || "blue-gray";
};

function ExpenseItem({ expense, onDelete }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(expense._id);
      setOpenDialog(false);
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardBody className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
            <div>
              <Typography variant="h6" color="blue-gray">
                {expense.title}
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <Chip
                  size="sm"
                  variant="ghost"
                  color={getCategoryColor(expense.category)}
                  value={expense.category}
                />
                <Typography color="gray" className="font-normal text-sm">
                  {new Date(expense.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Typography variant="h6" color="blue" className="font-medium">
              ₹{Number(expense.amount).toLocaleString()}
            </Typography>
            <IconButton
              variant="text"
              color="red"
              onClick={() => setOpenDialog(true)}
              disabled={isDeleting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </IconButton>
          </div>
        </CardBody>
      </Card>

      <Dialog open={openDialog} handler={() => !isDeleting && setOpenDialog(false)} size="xs">
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody divider className="text-gray-700">
          <p>Are you sure you want to delete this expense?</p>
          <div className="mt-4 p-4 bg-blue-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{expense.title}</span>
              <span className="font-bold text-blue-600">₹{Number(expense.amount).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {expense.category} • {new Date(expense.date).toLocaleDateString()}
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <p className="mt-4 text-red-500 text-sm">This action cannot be undone.</p>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button 
            variant="outlined" 
            color="blue-gray" 
            onClick={() => {
              setOpenDialog(false);
              setError(null);
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="gradient" 
            color="red" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default ExpenseItem;