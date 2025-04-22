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
      <div className="p-3 pb-6">
        <div className="text-base font-medium">{title}</div>
        <div className="mt-3">
          <Input
            placeholder={placeholder}
            clearable={true}
            maxLength={1000}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border-gray-200 min-h-[100px]"
          />
        </div>
        <div className="mt-4">
          <Button
            className="w-full bg-primary text-white rounded-lg py-2 text-sm"
            onClick={handleSave}
          >
            Lưu
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
