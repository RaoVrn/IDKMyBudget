import { useState, useEffect } from "react";
import incomeService from "../services/incomeService";
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
  Switch,
} from "@material-tailwind/react";

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investments",
  "Business",
  "Rental",
  "Other"
];

function IncomeForm({ onIncomeAdded, editingIncome, onCancelEdit }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    recurring: false,
    recurringFrequency: "monthly",
  });

  useEffect(() => {
    if (editingIncome) {
      setFormData({
        title: editingIncome.title,
        amount: editingIncome.amount,
        category: editingIncome.category,
        recurring: editingIncome.recurring || false,
        recurringFrequency: editingIncome.recurringFrequency || "monthly",
      });
    }
  }, [editingIncome]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (editingIncome) {
        await incomeService.updateIncome(editingIncome._id, formData);
        toast.success("Income updated successfully!");
      } else {
        await incomeService.addIncome(formData);
        toast.success("Income added successfully!");
      }
      
      setFormData({
        title: "",
        amount: "",
        category: "",
        recurring: false,
        recurringFrequency: "monthly",
      });
      onIncomeAdded();
      if (editingIncome) onCancelEdit();
    } catch (error) {
      toast.error(error.message || "Failed to save income");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader
        variant="gradient"
        color="green"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          {editingIncome ? "Edit Income" : "Add Income"}
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            type="number"
            label="Amount (₹)"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
            required
          >
            {INCOME_CATEGORIES.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.recurring}
              onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              label="Recurring Income"
            />
            {formData.recurring && (
              <Select
                value={formData.recurringFrequency}
                onChange={(val) => setFormData({ ...formData, recurringFrequency: val })}
                className="ml-4"
              >
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="mt-6" fullWidth color="green">
              {editingIncome ? "Update Income" : "Add Income"}
            </Button>
            {editingIncome && (
              <Button
                className="mt-6"
                fullWidth
                color="red"
                variant="outlined"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default IncomeForm;