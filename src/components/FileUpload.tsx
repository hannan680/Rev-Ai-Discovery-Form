
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in MB
  description?: string;
}

const FileUpload = ({ 
  files, 
  onFilesChange, 
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.mp3', '.wav', '.mp4'],
  maxFiles = 10,
  maxSize = 10,
  description 
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name} is larger than ${maxSize}MB`,
        variant: "destructive",
      });
      return false;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not an accepted file type`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles: File[] = [];
    Array.from(newFiles).forEach(file => {
      if (validateFile(file) && files.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
      toast({
        title: "Files uploaded",
        description: `${validFiles.length} file(s) added successfully`,
      });
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-4">
      <Card 
        className={`p-6 border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Drag and drop files here, or{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                browse to upload
              </Button>
            </p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
            <p className="text-xs text-gray-400">
              Accepted: {acceptedTypes.join(', ')} • Max size: {maxSize}MB • Max files: {maxFiles}
            </p>
          </div>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
