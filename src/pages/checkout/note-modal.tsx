import { Sheet, Input, Button } from "zmp-ui";

interface NoteModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function NoteModal({
  visible,
  onClose,
  title,
  value,
  placeholder,
  onChange,
}: NoteModalProps) {
  const handleSave = () => {
    onClose();
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      autoHeight
      mask
      handler
      swipeToClose
    >
      <div className="p-4 pb-8">
        <div className="text-lg font-medium">{title}</div>
        <div className="mt-4">
          <Input
            placeholder={placeholder}
            clearable={true}
            maxLength={1000}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border-gray-200 min-h-[120px]"
          />
        </div>
        <div className="mt-6">
          <Button
            className="w-full bg-primary text-white rounded-lg py-3"
            onClick={handleSave}
          >
            Lưu
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
