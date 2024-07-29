/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/PQtgGPYs6Nt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { IconProps } from "@radix-ui/react-icons/dist/types";

const MAX_WIDTH = 960;
const MAX_HEIGHT = 1280;

const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: file.type }));
        }
      }, file.type);
    };
  });
};

export function Upload() {
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files?.[0];
      const file = await resizeImage(uploadedFile);
      setFile(file);
    }
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      setUploading(true);
      setMessage("Uploading...");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`/api/upload?filename=${file.name}`, {
          method: "PUT",
          body: formData,
        });

        const result = (await res.json()) as { status: string };
        console.log(result);
        result.status === "ok"
          ? setMessage("File Upload Successful")
          : setMessage("File Upload Failed");
      } catch (error) {
        setMessage("An error occured");
      } finally {
        setUploading(false);
      }
    } else {
      setMessage("Please select a file");
    }
  };
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-3xl p-6 md:p-8 lg:p-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 md:p-8 lg:p-10">
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-200">
              Upload Image
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center items-center h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6">
                <label
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  htmlFor="image-upload"
                >
                  <UploadIcon className="w-8 h-8" />
                  {file ? (
                    <span>{file.name}</span>
                  ) : (
                    <span>Drag and drop or click to upload</span>
                  )}
                </label>
                <input
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
              >
                Upload
              </button>
            </form>

            <div className="mt-2">
              <p className="text-gray-200 dark:text-gray-500">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function UploadIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
