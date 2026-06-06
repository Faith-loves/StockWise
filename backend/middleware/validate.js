function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400)
      const error = new Error("Validation failed")
      error.errors = result.error.flatten().fieldErrors
      return next(error)
    }
    req.body = result.data
    next()
  }
}

module.exports = validate
