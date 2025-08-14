"use server"

export interface DemoFormState {
  success: boolean
  message: string
  shouldClearForm?: boolean
  errors: {}
}

export async function submitDemoRequest(prevState: DemoFormState, formData: FormData): Promise<DemoFormState> {
  return {
    success: true,
    message: "Demo request received successfully!",
    shouldClearForm: true,
    errors: {},
  }
}
