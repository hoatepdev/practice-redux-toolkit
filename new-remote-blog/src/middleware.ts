import { AnyAction, isRejected, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { isEntityError } from './utils/helpers'

function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  console.log(action)
  if (isRejected(action)) {
    console.log(action)
    if (action.error.name === 'CustomerError') {
      toast.warn(action.error.message)
    }
  }
  if (isRejectedWithValue(action)) {
    if (isPayloadErrorMessage(action.payload)) {
      toast.warn(action.payload.data.error)
    }
  }

  return next(action)
}
