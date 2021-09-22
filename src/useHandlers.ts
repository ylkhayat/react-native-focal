import { createContext, useRef, useContext, useCallback } from 'react'

const HandlerContext = createContext<ReturnType<typeof useHandlers>>({} as any)

const useHandlersContext = () => {
  return useContext(HandlerContext)
}

const useHandlers = () => {
  const { current: refs } = useRef<any[]>([])
  const subscribeNode = useCallback((ref: any) => {
    refs.push(ref)
  }, [])
  return { refs, subscribeNode }
}

export { useHandlers, useHandlersContext, HandlerContext }
