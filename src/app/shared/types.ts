export type SuccessResult<T> = {
  data: T
  error: null
}

export type ErrorResult = {
  data: null
  error: {
    message: string
    httpStatusCode: number
  }
}

export type Result<T> = SuccessResult<T> | ErrorResult
