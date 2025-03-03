import { useState } from "react";
import { Card, Modal, Button } from "@rewind-ui/core";
import { Visualization } from "../types";

interface VisualizationGalleryProps {
  visualizations: Visualization[];
}

const VisualizationGallery = ({ visualizations }: VisualizationGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<Visualization | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (visualizations.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500">No visualizations available for this alarm</p>
      </Card>
    );
  }

  const handleImageClick = (visualization: Visualization, index: number) => {
    setSelectedImage(visualization);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedImage(visualizations[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < visualizations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedImage(visualizations[currentIndex + 1]);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Visualizations ({visualizations.length})</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visualizations.map((visualization, index) => (
          <div
            key={visualization.id}
            className="cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            onClick={() => handleImageClick(visualization, index)}
          >
            <img
              src={visualization.imageBase64 || "/placeholder.svg"}
              alt={`Visualization ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 text-sm text-gray-600">
              {new Date(visualization.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedImage} onClose={handleClose} size="lg">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-medium">
              Visualization {currentIndex + 1} of {visualizations.length}
            </h3>
            <Button color="white" size="sm" onClick={handleClose} className="p-1">
              <span className="h-5 w-5">X</span>
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            {selectedImage && (
              <div className="flex flex-col items-center">
                <img
                  src={selectedImage.imageBase64 || "/placeholder.svg"}
                  alt={`Visualization ${currentIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain"
                />
                <p className="mt-2 text-gray-600">
                  Captured: {new Date(selectedImage.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between p-4 border-t">
            <Button color="white" onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button
              color="white"
              onClick={handleNext}
              disabled={currentIndex === visualizations.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisualizationGallery;
