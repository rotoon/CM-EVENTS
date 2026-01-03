"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  { id: "cafe" },
  { id: "nature" },
  { id: "culture" },
  { id: "nightlife" },
  { id: "food" },
  { id: "art" },
  { id: "shopping" },
];

const PREFERRED_AREAS = [
  { id: "old_city" },
  { id: "nimman" },
  { id: "riverside" },
  { id: "mountains" },
  { id: "chang_moi" },
  { id: "santitham" },
];

interface TripPlannerFormProps {
  onSubmit: (data: TripCriteria) => void;
  isLoading: boolean;
}

export function TripPlannerForm({ onSubmit, isLoading }: TripPlannerFormProps) {
  const t = useTranslations("tripPlanner.form");
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
        {/* Basic Info Group */}
        <div className="bg-neo-lime/10 border-4 border-neo-black p-6 md:p-8 space-y-8 relative">
          <div className="absolute -top-5 left-6 bg-neo-lime border-4 border-neo-black px-4 py-1 font-black uppercase italic shadow-neo-sm">
            {t("coreDetails")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-black uppercase text-xl flex items-center gap-2">
                    <span className="bg-neo-black text-white px-2 py-0.5 text-base">
                      01
                    </span>
                    {t("startDate")}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-16 pl-4 text-left font-black text-xl rounded-none border-4 border-neo-black shadow-neo active:shadow-none hover:bg-white hover:-translate-y-1 focus:ring-0 focus:shadow-neo-lg transition-all",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t("pickDate")}</span>
                          )}
                          <CalendarIcon className="ml-auto h-6 w-6 opacity-100" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-none border-4 border-neo-black shadow-neo-lg"
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
                  <FormMessage className="font-bold text-neo-pink" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase text-xl flex items-center gap-2">
                    <span className="bg-neo-black text-white px-2 py-0.5 text-base">
                      02
                    </span>
                    {t("howManyDays")}
                  </FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(parseInt(val, 10))}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full !h-16 rounded-none border-4 border-neo-black font-black !text-xl shadow-neo hover:shadow-neo-lg transition-all focus:ring-0 bg-white">
                        <SelectValue placeholder={t("selectDuration")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-none border-4 border-neo-black shadow-neo-lg">
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <SelectItem
                          key={num}
                          value={num.toString()}
                          className="font-black text-lg uppercase focus:bg-neo-lime focus:text-neo-black cursor-pointer"
                        >
                          {num} {num === 1 ? t("day") : t("days")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-bold text-neo-pink" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Budget Group */}
        <FormField
          control={form.control}
          name="budgetLevel"
          render={({ field }) => (
            <FormItem className="space-y-6">
              <FormLabel className="font-black uppercase text-xl flex items-center gap-2">
                <span className="bg-neo-black text-white px-2 py-0.5 text-base">
                  03
                </span>
                {t("budgetVibe")}
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["low", "medium", "high"].map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant="outline"
                      className={cn(
                        "capitalize h-20 rounded-none border-4 border-neo-black font-black text-xl transition-all relative overflow-hidden group",
                        field.value === level
                          ? "bg-neo-black text-white hover:bg-neo-black hover:text-white shadow-neo-lg translate-x-1 translate-y-1"
                          : "bg-white hover:bg-neo-lime hover:shadow-neo hover:-translate-y-1"
                      )}
                      onClick={() => field.onChange(level)}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 md:gap-4">
                        <span className="relative w-8 h-8 md:w-12 md:h-12 group-hover:scale-110 transition-transform">
                          <Image
                            src={`/stickers/budget_${level}.png`}
                            alt={level}
                            fill
                            className="object-contain"
                          />
                        </span>
                        <span className="text-base md:text-xl">{level}</span>
                      </span>
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="font-bold text-neo-pink" />
            </FormItem>
          )}
        />

        {/* Styles Group (Interactive Cards) */}
        <FormField
          control={form.control}
          name="styles"
          render={() => (
            <FormItem>
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                  <FormLabel className="font-black uppercase text-xl flex items-center gap-2">
                    <span className="bg-neo-black text-white px-2 py-0.5 text-base">
                      04
                    </span>
                    {t("styleTitle")}
                  </FormLabel>
                  <FormDescription className="font-bold text-neo-black/60 uppercase tracking-widest text-xs mt-1">
                    {t("styleDesc")}
                  </FormDescription>
                </div>
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
                        <div
                          onClick={() => {
                            const newValue = isChecked
                              ? field.value.filter(
                                  (v: string) => v !== style.id
                                )
                              : [...field.value, style.id];
                            field.onChange(newValue);
                          }}
                          className={cn(
                            "group cursor-pointer p-4 border-4 border-neo-black transition-all flex flex-col items-center justify-center gap-3 aspect-square text-center",
                            isChecked
                              ? "bg-neo-lime shadow-none translate-x-1 translate-y-1"
                              : "bg-white shadow-neo hover:shadow-neo-lg hover:-translate-y-1"
                          )}
                        >
                          <div className="relative w-14 h-14 md:w-20 md:h-20 group-hover:rotate-12 transition-transform">
                            <Image
                              src={`/stickers/${style.id}.png`}
                              alt={t(`styles.${style.id}`)}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="font-black uppercase text-sm leading-none">
                            {t(`styles.${style.id}`)}
                          </span>
                        </div>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage className="font-bold text-neo-pink" />
            </FormItem>
          )}
        />

        {/* Areas Group */}
        <FormField
          control={form.control}
          name="areas"
          render={() => (
            <FormItem>
              <div className="mb-6">
                <FormLabel className="font-black uppercase text-xl flex items-center gap-2">
                  <span className="bg-neo-black text-white px-2 py-0.5 text-base">
                    05
                  </span>
                  {t("baseOperations")}
                </FormLabel>
                <FormDescription className="font-bold text-neo-black/60 uppercase tracking-widest text-xs mt-1">
                  {t("areaDesc")}
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PREFERRED_AREAS.map((area) => (
                  <FormField
                    key={area.id}
                    control={form.control}
                    name="areas"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(area.id);
                      return (
                        <div
                          onClick={() => {
                            const newValue = isChecked
                              ? field.value.filter((v: string) => v !== area.id)
                              : [...field.value, area.id];
                            field.onChange(newValue);
                          }}
                          className={cn(
                            "cursor-pointer p-5 border-4 border-neo-black transition-all flex items-center gap-4",
                            isChecked
                              ? "bg-neo-purple text-white shadow-none translate-x-1 translate-y-1"
                              : "bg-white shadow-neo hover:shadow-neo-lg hover:-translate-x-1"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 border-2 border-neo-black flex items-center justify-center font-black",
                              isChecked
                                ? "bg-white text-neo-purple"
                                : "bg-neo-bg"
                            )}
                          >
                            {isChecked ? "✓" : ""}
                          </div>
                          <span className="font-black uppercase text-sm italic">
                            {t(`areas.${area.id}`)}
                          </span>
                        </div>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage className="font-bold text-neo-pink" />
            </FormItem>
          )}
        />

        {/* Extra Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="hasCar"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "h-full flex flex-col justify-center gap-2 p-6 border-4 border-neo-black transition-all cursor-pointer",
                    field.value
                      ? "bg-neo-pink text-white shadow-none translate-x-1 translate-y-1"
                      : "bg-white shadow-neo hover:bg-neo-pink/5 hover:-translate-y-1"
                  )}
                  onClick={() => field.onChange(!field.value)}
                >
                  <FormLabel className="font-black uppercase text-xl cursor-pointer">
                    {t("transport")}
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 group-hover:translate-x-2 transition-transform">
                      <Image
                        src="/stickers/transport_car.png"
                        alt="Car"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs md:text-sm leading-tight uppercase">
                      {t("hasCar")}
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black uppercase text-xl flex items-center gap-2">
                    <span className="bg-neo-black text-white px-2 py-0.5 text-base">
                      06
                    </span>
                    {t("notesTitle")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("notesPlaceholder")}
                      className="resize-none h-24 rounded-none border-4 border-neo-black font-bold shadow-neo focus:shadow-neo-lg focus:ring-0 text-lg p-4 bg-white"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="w-full h-20 text-3xl font-black uppercase rounded-none border-4 border-neo-black bg-neo-pink text-white shadow-neo-lg hover:shadow-neo hover:-translate-y-1 hover:bg-neo-pink/90 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 group"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              {t("submit")}
              <Sparkles className="h-10 w-10 group-hover:rotate-45 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
