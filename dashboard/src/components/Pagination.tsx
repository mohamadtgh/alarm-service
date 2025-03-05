import { Button } from "@rewind-ui/core";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-700">Page {currentPage}</div>
      <div className="flex gap-2">
        <Button color="white" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button color="white" size="sm" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
