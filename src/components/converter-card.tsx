"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { conversionCategories, ConversionCategory, Unit } from "@/lib/conversions";
import { suggestCategory, SuggestCategoryInput, SuggestCategoryOutput } from "@/ai/flows/smart-category-suggestion";
import { useDebounce } from "@/hooks/use-debounce";

export function ConverterCard() {
  const [selectedCategory, setSelectedCategory] = React.useState<ConversionCategory>(conversionCategories[0]);
  const [fromUnit, setFromUnit] = React.useState<string>(conversionCategories[0].units[0].symbol);
  const [toUnit, setToUnit] = React.useState<string>(conversionCategories[0].units[1].symbol);
  const [inputValue, setInputValue] = React.useState<string>("1");
  const [outputValue, setOutputValue] = React.useState<string>("");
  const [suggestedCategories, setSuggestedCategories] = React.useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = React.useState(false);

  const debouncedInputValue = useDebounce(inputValue, 500);

  const handleCategoryChange = (categoryName: string) => {
    const category = conversionCategories.find((c) => c.name === categoryName);
    if (category) {
      setSelectedCategory(category);
      setFromUnit(category.units[0].symbol);
      setToUnit(category.units.length > 1 ? category.units[1].symbol : category.units[0].symbol);
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  React.useEffect(() => {
    const performConversion = async () => {
      const numValue = parseFloat(inputValue);
      if (isNaN(numValue) || !fromUnit || !toUnit) {
        setOutputValue("");
        return;
      }
      const result = await selectedCategory.convert(numValue, fromUnit, toUnit);
      if (typeof result === 'number' && !isNaN(result)) {
        setOutputValue(result.toLocaleString(undefined, {
          maximumFractionDigits: 5,
          useGrouping: false,
        }));
      } else {
        setOutputValue("");
      }
    };
    performConversion();
  }, [inputValue, fromUnit, toUnit, selectedCategory]);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedInputValue) {
        setSuggestedCategories([]);
        return;
      }
      setIsSuggesting(true);
      try {
        const result: SuggestCategoryOutput = await suggestCategory({ input: debouncedInputValue });
        setSuggestedCategories(result.suggestedCategories);
      } catch (error) {
        console.error("Error fetching category suggestions:", error);
        setSuggestedCategories([]);
      } finally {
        setIsSuggesting(false);
      }
    };
    fetchSuggestions();
  }, [debouncedInputValue]);
  
  const fromUnitInfo = selectedCategory.units.find(u => u.symbol === fromUnit);
  const toUnitInfo = selectedCategory.units.find(u => u.symbol === toUnit);

  return (
    <Card className="shadow-2xl rounded-2xl bg-white dark:bg-gray-800 border-none">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-800 dark:text-white">
          UniConvert
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
          <Select value={selectedCategory.name} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full h-12 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {conversionCategories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  <div className="flex items-center gap-2">
                    <cat.icon className="h-5 w-5" />
                    <span>{cat.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI Suggestions */}
        {(isSuggesting || suggestedCategories.length > 0) && (
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
              AI Suggestions
              {isSuggesting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.map((catName) => (
                <Button
                  key={catName}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleCategoryChange(catName)}
                >
                  {catName}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Value */}
        <div className="space-y-2">
          <label htmlFor="input-value" className="text-sm font-medium text-gray-600 dark:text-gray-300">Value</label>
          <Input
            id="input-value"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-12 text-lg rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            placeholder="Enter value"
          />
        </div>

        {/* Unit Selection */}
        <div className="flex items-center justify-between space-x-2">
          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">From</label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-full h-12 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {selectedCategory.units.map((unit) => (
                  <SelectItem key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="icon" className="mt-8 self-center rounded-full bg-accent hover:bg-accent/90" onClick={handleSwapUnits}>
            <ArrowRightLeft className="h-5 w-5 text-white" />
          </Button>

          <div className="w-full space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">To</label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-full h-12 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {selectedCategory.units.map((unit) => (
                  <SelectItem key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result Display */}
        <div className="space-y-2 pt-4">
           <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Result</label>
          <div className="flex items-center justify-between p-4 h-16 bg-primary/10 rounded-lg">
            <span className="text-2xl font-bold text-primary truncate">
              {outputValue || "0"}
            </span>
             <span className="text-lg text-primary/80 font-medium">
              {toUnitInfo?.symbol}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
