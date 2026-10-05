"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
  onUploadBegin?: () => void;
}

function ImageUpload({
  endpoint,
  onChange,
  value,
  onUploadBegin,
}: ImageUploadProps) {
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="Upload"
          className="rounded-md size-40 object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      config={{ mode: "auto" }}
      onUploadBegin={() => {
        onUploadBegin?.();
        toast.loading("Uploading image...", { id: "image-upload" });
      }}
      onClientUploadComplete={(res) => {
        toast.dismiss("image-upload");
        console.log("Upload completed, res:", res);
        const url = res?.[0]?.url || res?.[0]?.ufsUrl;
        if (url) {
          onChange(url);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Failed to get uploaded image URL");
        }
      }}
      onUploadError={(error: Error) => {
        toast.dismiss("image-upload");
        console.error("Upload error:", error);
        toast.error(`Upload failed: ${error.message}`);
      }}
    />
  );
}
export default ImageUpload;
