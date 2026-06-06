import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { Button, Card, Input, toast } from "../components"
import { loginSchema } from "../schemas/authSchemas"
import { login } from "../services/authService"

export function LoginPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data) {
    try {
      await login(data)
      toast.success("Welcome back")
      navigate("/dashboard")
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-slate-950">Login</h1>
      <p className="mt-2 text-sm text-slate-500">Enter your details to open your workspace.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input label="Password" type="password" {...register("password")} error={errors.password?.message} />
        <Button type="submit" className="w-full">Login</Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">New to StockWise? <Link className="font-semibold text-emerald-700" to="/signup">Create account</Link></p>
    </Card>
  )
}
