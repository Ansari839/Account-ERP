"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

const VariantForm = ({ onSubmit, variant, onClose }) => {
  const [name, setName] = useState(variant?.name || "");
  const [options, setOptions] = useState(variant?.options || []);
  const [currentOption, setCurrentOption] = useState("");
  const [description, setDescription] = useState(variant?.description || "");

  const handleOptionKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentOption.trim() && !options.includes(currentOption.trim())) {
        setOptions([...options, currentOption.trim()]);
      }
      setCurrentOption("");
    }
  };

  const removeOption = (optionToRemove) => {
    setOptions(options.filter(option => option !== optionToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, options, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Variant Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
            placeholder="e.g., Size, Color"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="options" className="text-right">
            Options
          </Label>
          <div className="col-span-3">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {options.map(option => (
                <div key={option} className="flex items-center gap-1 bg-gray-200 rounded-md px-2 py-1 text-sm">
                  {option}
                  <button type="button" onClick={() => removeOption(option)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <Input
                id="options"
                value={currentOption}
                onChange={(e) => setCurrentOption(e.target.value)}
                onKeyDown={handleOptionKeyDown}
                className="flex-grow border-none focus:ring-0"
                placeholder="Add options..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add an option.</p>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="ml-2">
          Save
        </Button>
      </div>
    </form>
  );
};

export default VariantForm;
