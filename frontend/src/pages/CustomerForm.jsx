import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, Card, Input, Select, Textarea } from "../components"
import { customerSchema } from "../schemas/customerSchema"

export function CustomerForm({ defaultValues, submitLabel, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues || {
      name: "",
      phone: "",
      email: "",
      address: "",
      customerType: "Retailer",
      notes: "",
    },
  })

  return (
    <Card className="p-5">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" {...register("name")} error={errors.name?.message} />
        <Input label="Phone" {...register("phone")} error={errors.phone?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Select label="Customer type" {...register("customerType")} error={errors.customerType?.message}>
          <option>Retailer</option>
          <option>Wholesaler</option>
          <option>Walk-in</option>
          <option>Distributor</option>
        </Select>
        <div className="md:col-span-2">
          <Textarea label="Address" {...register("address")} error={errors.address?.message} />
        </div>
        <div className="md:col-span-2">
          <Textarea label="Notes" {...register("notes")} error={errors.notes?.message} />
        </div>
        <div className="flex justify-end md:col-span-2">
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Card>
  )
}
