import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Loader2, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReceiptScanner({ onItemsExtracted }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    await processReceipt(file);
  };

  const processReceipt = async (file) => {
    setIsProcessing(true);
    setError(null);

    // SIMULATION MODE: Since we don't have a backend to process images yet.
    try {
      // 1. Fake a loading delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Return dummy data to prove the UI works
      const dummyItems = [
        { name: "Apples", quantity: 6, unit: "pieces", category: "fruits" },
        { name: "Milk", quantity: 2, unit: "l", category: "dairy" },
        { name: "Sourdough Bread", quantity: 1, unit: "pieces", category: "grains" }
      ];

      onItemsExtracted(dummyItems);
      
    } catch (err) {
      console.error("Error (Mock):", err);
      setError("Simulation failed.");
    }

    setIsProcessing(false);
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <Card className="border-2 border-dashed border-green-200 bg-green-50/50">
      <CardContent className="p-6">
        <div className="text-center">
          <Receipt className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">Scan Receipt</h3>
          <p className="text-sm text-gray-500 mb-4">
            Take a photo or upload a receipt to auto-add items
          </p>

          <AnimatePresence>
            {previewUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative mb-4"
              >
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="max-h-48 mx-auto rounded-lg shadow-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={clearPreview}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {isProcessing ? (
            <div className="flex items-center justify-center gap-2 text-green-600 py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Extracting items from receipt...</span>
            </div>
          ) : (
            <div className="flex gap-3 justify-center">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="border-green-300 hover:bg-green-100"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-green-300 hover:bg-green-100"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 mt-3">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}