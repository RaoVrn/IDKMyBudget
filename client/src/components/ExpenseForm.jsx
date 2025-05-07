import { useState } from "react";
import expenseService from "../services/expenseService";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health & Medical",
  "Travel",
  "Education",
  "Other"
];

function ExpenseForm({ onExpenseAdded }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await expenseService.addExpense({ title, amount: Number(amount), category });
      toast.success("Expense added successfully!");
      setTitle("");
      setAmount("");
      setCategory("");
      onExpenseAdded();
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader
        variant="gradient"
        color="blue"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Add Expense
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Title"
            size="lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="number"
            label="Amount (₹)"
            size="lg"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Select
            label="Category"
            value={category}
            onChange={(val) => setCategory(val)}
            required
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
          <Button type="submit" className="mt-6" fullWidth>
            Add Expense
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default ExpenseForm;
