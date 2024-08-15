type MessageProps = {
  message: string;
};

const ModalMessage = ({ message }: MessageProps) => {
  console.log(message);
  return (
    <div className="w-1/2 h-auto text-center bg-white p-8 mx-auto">
      <h1 className="text-2xl">{message}</h1>
    </div>
  );
};

export default ModalMessage;
