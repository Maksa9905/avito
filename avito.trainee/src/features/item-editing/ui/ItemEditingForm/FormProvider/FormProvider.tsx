import FormContext, { type FormContextType } from './FormContext'

type FormProviderProps = {
  children: React.ReactNode
  value: FormContextType | null
}

const FormProvider = ({ children, value }: FormProviderProps) => {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export default FormProvider
