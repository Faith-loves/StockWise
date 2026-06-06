import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, Card, Input, Select, Textarea } from "../components"
import { productSchema } from "../schemas/productSchema"

export function ProductForm({ defaultValues, submitLabel, onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      name: "",
      sku: "",
      category: "",
      description: "",
      costPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      lowStockThreshold: 5,
      supplierName: "",
      image: "",
    },
  })

  return (
    <Card className="p-5">
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Product name" {...register("name")} error={errors.name?.message} />
        <Input label="SKU" {...register("sku")} error={errors.sku?.message} />
        <Input label="Category" {...register("category")} error={errors.category?.message} />
        <Input label="Supplier name" {...register("supplierName")} error={errors.supplierName?.message} />
        <Input label="Cost price" type="number" {...register("costPrice")} error={errors.costPrice?.message} />
        <Input label="Selling price" type="number" {...register("sellingPrice")} error={errors.sellingPrice?.message} />
        <Input label="Quantity" type="number" {...register("quantity")} error={errors.quantity?.message} />
        <Input label="Low-stock threshold" type="number" {...register("lowStockThreshold")} error={errors.lowStockThreshold?.message} />
        <Select label="Product image" {...register("image")}>
          <option value="">Use default product image</option>
          <option value="food">Food product</option>
          <option value="drink">Drink product</option>
          <option value="retail">Retail item</option>
        </Select>
        <div className="md:col-span-2">
          <Textarea label="Description" {...register("description")} error={errors.description?.message} />
        </div>
        <div className="flex justify-end md:col-span-2">
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Card>
  )
}
