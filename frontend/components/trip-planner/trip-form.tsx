"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TripCriteria } from "@/lib/api-trip";
import { cn } from "@/lib/utils";

const tripFormSchema = z.object({
  startDate: z.date({
    message: "A start date is required.",
  }),
  days: z.number().min(1, "At least 1 day"),
  budgetLevel: z.enum(["low", "medium", "high"]),
  styles: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one style.",
  }),
  hasCar: z.boolean(),
  areas: z.array(z.string()),
  notes: z.string().optional(),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

const TRAVEL_STYLES = [
  { id: "cafe", label: "Cafe Hopping" },
  { id: "nature", label: "Nature & Adventure" },
  { id: "culture", label: "Culture & Temples" },
  { id: "nightlife", label: "Nightlife & Party" },
  { id: "food", label: "Local Food" },
  { id: "art", label: "Art & Craft" },
  { id: "shopping", label: "Shopping" },
];

const PREFERRED_AREAS = [
  { id: "old_city", label: "Old City (Tha Phae)" },
  { id: "nimman", label: "Nimman & Maya" },
  { id: "riverside", label: "Ping Riverside" },
  { id: "mountains", label: "Doi Suthep / Mountains" },
  { id: "chang_moi", label: "Chang Moi / Tha Phae" },
  { id: "santitham", label: "Santitham (Local Vibe)" },
];

interface TripPlannerFormProps {
  onSubmit: (data: TripCriteria) => void;
  isLoading: boolean;
}

export function TripPlannerForm({ onSubmit, isLoading }: TripPlannerFormProps) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      days: 3,
      budgetLevel: "medium",
      styles: [],
      areas: [],
      hasCar: false,
      notes: "",
    },
  });

  function handleSubmit(data: TripFormValues) {
    onSubmit({
      startDate: format(data.startDate, "yyyy-MM-dd"),
      days: data.days,
      travelerProfile: {
        style: data.styles,
        areas: data.areas,
        budgetLevel: data.budgetLevel,
        hasCar: data.hasCar,
        notes: data.notes,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-black uppercase text-lg">
                  Start Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-bold rounded-none border-2 border-neo-black shadow-sm active:shadow-none hover:bg-gray-50 focus:ring-0 focus:shadow-neo transition-all",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-5 w-5 opacity-100" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-none border-2 border-neo-black shadow-neo"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="rounded-none font-sans"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="font-bold text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black uppercase text-lg">
                  Duration (Days)
                </FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(parseInt(val, 10))}
                  defaultValue={field.value?.toString()}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-none border-2 border-neo-black font-bold shadow-sm focus:shadow-neo focus:ring-0">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-none border-2 border-neo-black shadow-neo">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <SelectItem
                        key={num}
                        value={num.toString()}
                        className="font-bold focus:bg-neo-lime focus:text-neo-black"
                      >
                        {num} {num === 1 ? "Day" : "Days"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="font-bold text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="budgetLevel"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="font-black uppercase text-lg">
                Budget Level
              </FormLabel>
              <FormControl>
                <div className="flex space-x-4">
                  {["low", "medium", "high"].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant="outline"
                      className={cn(
                        "capitalize flex-1 h-16 rounded-none border-2 border-neo-black font-black text-lg transition-all shadow-sm",
                        field.value === level
                          ? "bg-neo-black text-white hover:bg-neo-black hover:text-white shadow-neo"
                          : "bg-white hover:bg-gray-50 hover:shadow-neo hover:-translate-y-1"
                      )}
                      onClick={() => field.onChange(level)}
                    >
                      {level}{" "}
                      {level === "low"
                        ? "💸"
                        : level === "medium"
                        ? "💸💸"
                        : "💸💸💸"}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="font-bold text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="styles"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="font-black uppercase text-lg">
                  Travel Styles
                </FormLabel>
                <FormDescription className="font-bold text-gray-500">
                  Select what you're interested in.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TRAVEL_STYLES.map((style) => (
                  <FormField
                    key={style.id}
                    control={form.control}
                    name="styles"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(style.id);
                      return (
                        <FormItem
                          key={style.id}
                          className={cn(
                            "flex flex-row items-center space-x-3 space-y-0 rounded-none border-2 border-neo-black p-4 transition-all cursor-pointer",
                            isChecked
                              ? "bg-neo-lime shadow-neo-sm translate-x-[2px] translate-y-[2px]"
                              : "bg-white shadow-neo hover:shadow-neo-lg hover:-translate-y-1"
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, style.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== style.id
                                      )
                                    );
                              }}
                              className="data-[state=checked]:bg-neo-black data-[state=checked]:text-white border-2 border-neo-black rounded-none w-5 h-5"
                            />
                          </FormControl>
                          <FormLabel className="font-bold cursor-pointer uppercase text-sm">
                            {style.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage className="font-bold text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="areas"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="font-black uppercase text-lg">
                  Preferred Areas
                </FormLabel>
                <FormDescription className="font-bold text-gray-500">
                  Where do you want to stay or spend most time?
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PREFERRED_AREAS.map((area) => (
                  <FormField
                    key={area.id}
                    control={form.control}
                    name="areas"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(area.id);
                      return (
                        <FormItem
                          key={area.id}
                          className={cn(
                            "flex flex-row items-center space-x-3 space-y-0 rounded-none border-2 border-neo-black p-4 transition-all cursor-pointer",
                            isChecked
                              ? "bg-neo-purple text-white shadow-neo-sm translate-x-[2px] translate-y-[2px]"
                              : "bg-white shadow-neo hover:shadow-neo-lg hover:-translate-y-1"
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, area.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== area.id
                                      )
                                    );
                              }}
                              className="data-[state=checked]:bg-white data-[state=checked]:text-neo-purple border-2 border-neo-black rounded-none w-5 h-5"
                            />
                          </FormControl>
                          <FormLabel className="font-bold cursor-pointer uppercase text-sm">
                            {area.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage className="font-bold text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasCar"
          render={({ field }) => (
            <FormItem
              className={cn(
                "flex flex-row items-center space-x-4 space-y-0 rounded-none border-2 border-neo-black p-6 transition-all",
                field.value
                  ? "bg-neo-purple/10 border-neo-purple"
                  : "bg-white shadow-sm"
              )}
            >
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="w-6 h-6 border-2 border-neo-black rounded-none data-[state=checked]:bg-neo-purple data-[state=checked]:border-neo-black"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-black uppercase text-lg">
                  I have a car / rental car
                </FormLabel>
                <FormDescription className="font-bold text-gray-500">
                  This helps in planning travel distances.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-black uppercase text-lg">
                Additional Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific requests? (e.g. Vegetarian food, love sunset spots)"
                  className="resize-none h-32 rounded-none border-2 border-neo-black font-medium shadow-sm focus:shadow-neo focus:ring-0 text-base p-4"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-bold text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full h-16 text-xl font-black uppercase rounded-none border-2 border-neo-black bg-neo-pink text-white shadow-neo hover:shadow-neo-lg hover:-translate-y-1 hover:bg-neo-pink/90 active:translate-y-0 active:shadow-none transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Generating Plan...
            </>
          ) : (
            "Generate Itinerary ✨"
          )}
        </Button>
      </form>
    </Form>
  );
}
