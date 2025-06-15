
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateRangeSelectorProps {
  onDateRangeChange: (range: { start: Date; end: Date; type: 'month' | 'custom' }) => void;
}

const DateRangeSelector = ({ onDateRangeChange }: DateRangeSelectorProps) => {
  const [dateType, setDateType] = useState<'month' | 'custom'>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    const start = new Date(month + '-01');
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    onDateRangeChange({ start, end, type: 'month' });
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onDateRangeChange({ start: startDate, end: endDate, type: 'custom' });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold">Date Range</h3>
      
      <Select value={dateType} onValueChange={(value) => setDateType(value as 'month' | 'custom')}>
        <SelectTrigger>
          <SelectValue placeholder="Select date type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Monthly View</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {dateType === 'month' && (
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      )}

      {dateType === 'custom' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  if (date && endDate) handleCustomDateChange();
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  if (startDate && date) handleCustomDateChange();
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
