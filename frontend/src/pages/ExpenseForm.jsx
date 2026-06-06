import { Button, Card, Input, Select, Textarea } from "../components"
import { expenseCategories, paymentMethods } from "../constants/expenses"

export function ExpenseForm({ form, setForm, onSubmit, submitLabel }) {
  return (
    <Card className="p-5">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Input label="Expense title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        <Select label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
          {expenseCategories.map((category) => <option key={category}>{category}</option>)}
        </Select>
        <Input label="Amount" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required />
        <Input label="Date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
        <Select label="Payment method" value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}>
          {paymentMethods.map((method) => <option key={method}>{method}</option>)}
        </Select>
        <Input label="Receipt image" value={form.receiptImage} onChange={(event) => setForm({ ...form, receiptImage: event.target.value })} placeholder="Receipt image URL for now" />
        <div className="md:col-span-2">
          <Textarea label="Notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </div>
        <div className="flex justify-end md:col-span-2">
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Card>
  )
}
