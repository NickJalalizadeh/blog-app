import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ImagePreviewProps = {
  url: string,
  onReplace?: () => void,
  onRemove?: () => void,
};

export default function ImagePreview({ url, onReplace, onRemove } : ImagePreviewProps) {
  return (
    <div className="relative max-w-xs rounded-md shadow-md group">
      <Image 
        src={url} 
        alt="Preview" 
        width={1600}
        height={900}
        className="rounded-md cursor-pointer"
        onClick={onReplace}
      />
      <div className="transition-opacity opacity-0 group-hover:opacity-100">
        <div className="absolute inset-0 flex items-center justify-center rounded-md text-white bg-black/30  pointer-events-none">
          <Upload className="size-5" />
        </div>
        {/* Remove button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onRemove}
          className="absolute -top-3 -right-3 rounded-full bg-gray-100 hover:bg-gray-300"
          title="Remove image"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
