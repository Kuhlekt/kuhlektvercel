import type React from "react"
import { Modal } from "antd"

const LoginModal: React.FC = () => {
  return (
    <Modal title="Login" visible={true} footer={null}>
      <img
        src="/images/kuhlekt-logo.jpg"
        alt="Kuhlekt Logo"
        className="h-12 w-auto mx-auto mb-4" // Increased size
      />
      {/* rest of code here */}
    </Modal>
  )
}

export default LoginModal
