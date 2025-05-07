import { useState, useEffect } from "react";
import budgetService from "../services/budgetService";
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
  Slider,
} from "@material-tailwind/react";

const EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Other"
];

function BudgetForm({ onBudgetAdded, editingBudget, onCancelEdit }) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly",
    alert: {
      enabled: true,
      threshold: 80
    }
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category,
        amount: editingBudget.amount,
        period: editingBudget.period,
        alert: {
          enabled: editingBudget.alert.enabled,
          threshold: editingBudget.alert.threshold
        }
      });
    }
  }, [editingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      toast.error("Category and amount are required!");
      return;
    }

    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget._id, formData);
        toast.success("Budget updated successfully!");
      } else {
        await budgetService.addBudget(formData);
        toast.success("Budget added successfully!");
      }
      
      setFormData({
        category: "",
        amount: "",
        period: "monthly",
        alert: {
          enabled: true,
          threshold: 80
        }
      });
      onBudgetAdded();
      if (editingBudget) onCancelEdit();
    } catch (error) {
      toast.error(error.message || "Failed to save budget");
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
          {editingBudget ? "Edit Budget" : "Set Budget"}
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
            disabled={editingBudget}
            required
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
          
          <Input
            type="number"
            label="Monthly Budget Amount (₹)"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray">
                Budget Alerts
              </Typography>
              <Switch
                checked={formData.alert.enabled}
                onChange={(e) => 
                  setFormData({
                    ...formData,
                    alert: { ...formData.alert, enabled: e.target.checked }
                  })
                }
                label="Enable Alerts"
              />
            </div>
            
            {formData.alert.enabled && (
              <div className="mt-2">
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Alert Threshold: {formData.alert.threshold}%
                </Typography>
                <Slider
                  value={formData.alert.threshold}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      alert: { ...formData.alert, threshold: val }
                    })
                  }
                  min={50}
                  max={100}
                  step={5}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="mt-6" fullWidth>
              {editingBudget ? "Update Budget" : "Set Budget"}
            </Button>
            {editingBudget && (
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

export default BudgetForm;