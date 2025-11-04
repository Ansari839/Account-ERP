
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  
  export default function TrialBalanceFilter({ natures, selectedNature, onNatureChange }) {
    return (
      <div className="mb-4">
        <Select value={selectedNature} onValueChange={onNatureChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by nature" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Natures</SelectItem>
            {natures.map((nature) => (
              <SelectItem key={nature} value={nature}>
                {nature}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
