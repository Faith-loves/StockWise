import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Input, toast } from "../components"
import { signupSchema } from "../schemas/authSchemas"
import { signup } from "../services/authService"

export function SignupPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) })

  async function onSubmit(data) {
    try {
      await signup(data)
      toast.success("Account created")
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed")
    }
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-slate-950">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">Set up StockWise for your business.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full name" {...register("fullName")} error={errors.fullName?.message} />
        <Input label="Business name" {...register("businessName")} error={errors.businessName?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <Input label="Confirm password" type="password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
        <Button type="submit" className="w-full">Create account</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-emerald-700" to="/login">Login</Link></p>
    </Card>
  )
}
