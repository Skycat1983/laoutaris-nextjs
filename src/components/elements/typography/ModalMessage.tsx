interface MessageProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

const ModalMessage = ({ message, type = "info" }: MessageProps) => {
  const bgColor = {
    success: "bg-green-50",
    error: "bg-red-50",
    warning: "bg-yellow-50",
    info: "bg-blue-50",
  }[type];

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  }[type];

  const iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  }[type];

  return (
    <div
      className={`w-full max-w-md mx-auto rounded-lg shadow-lg ${bgColor} p-6`}
    >
      <div className="flex items-center gap-4">
        <span className={`text-2xl ${textColor}`}>{iconMap}</span>
        <h2 className={`text-lg font-medium ${textColor}`}>{message}</h2>
      </div>
    </div>
  );
};

export default ModalMessage;
