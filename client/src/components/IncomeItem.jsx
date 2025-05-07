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
  Tooltip,
} from "@material-tailwind/react";

const getCategoryIcon = (category) => {
  const icons = {
    "Salary": "💼",
    "Freelance": "💻",
    "Investments": "📈",
    "Business": "🏢",
    "Rental": "🏠",
    "Other": "💰",
  };
  return icons[category] || "💰";
};

const getCategoryColor = (category) => {
  const colors = {
    "Salary": "green",
    "Freelance": "blue",
    "Investments": "purple",
    "Business": "indigo",
    "Rental": "amber",
    "Other": "gray",
  };
  return colors[category] || "blue-gray";
};

const getRecurringIcon = (frequency) => {
  const icons = {
    "weekly": "🔄",
    "monthly": "📅",
    "yearly": "📆",
  };
  return icons[frequency] || "🔄";
};

function IncomeItem({ income, onDelete, onEdit }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete(income._id);
      setOpenDialog(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardBody className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl">{getCategoryIcon(income.category)}</div>
            <div>
              <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                {income.title}
                {income.recurring && (
                  <Tooltip content={`Recurring ${income.recurringFrequency}`}>
                    <span className="text-lg">
                      {getRecurringIcon(income.recurringFrequency)}
                    </span>
                  </Tooltip>
                )}
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <Chip
                  size="sm"
                  variant="ghost"
                  color={getCategoryColor(income.category)}
                  value={income.category}
                />
                <Typography color="gray" className="font-normal text-sm">
                  {new Date(income.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Typography variant="h6" color="green" className="font-medium">
              ₹{Number(income.amount).toLocaleString()}
            </Typography>
            <IconButton
              variant="text"
              color="blue"
              onClick={() => onEdit(income)}
              size="sm"
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </IconButton>
            <IconButton
              variant="text"
              color="red"
              onClick={() => setOpenDialog(true)}
              size="sm"
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
          <p>Are you sure you want to delete this income entry?</p>
          <div className="mt-4 p-4 bg-blue-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{income.title}</span>
              <span className="font-bold text-green-600">₹{Number(income.amount).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {income.category} • {new Date(income.date).toLocaleDateString()}
              {income.recurring && ` • Recurring ${income.recurringFrequency}`}
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

export default IncomeItem;