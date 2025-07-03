"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { QRCode, CreateQRCodeData, QRCodeStyling as QRCodeStylingType } from "@/lib/qr-types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Download, Palette, Settings, Eye } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  redirect_url: z.string().url("Please enter a valid URL"),
  styling: z.object({
    width: z.number().min(100).max(1000),
    height: z.number().min(100).max(1000),
    margin: z.number().min(0).max(50),
    dotsType: z.enum(["rounded", "dots", "classy", "classy-rounded", "square", "extra-rounded"]),
    dotsColor: z.string(),
    dotsGradientEnabled: z.boolean(),
    dotsGradientType: z.enum(["linear", "radial"]),
    dotsGradientRotation: z.number().min(0).max(360),
    dotsGradientStartColor: z.string(),
    dotsGradientEndColor: z.string(),
    backgroundColor: z.string(),
    backgroundTransparent: z.boolean(),
    backgroundGradientEnabled: z.boolean(),
    backgroundGradientType: z.enum(["linear", "radial"]),
    backgroundGradientRotation: z.number().min(0).max(360),
    backgroundGradientStartColor: z.string(),
    backgroundGradientEndColor: z.string(),
    errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]),
    hideBackgroundDots: z.boolean(),
    imageSize: z.number().min(0.1).max(1),
    imageMargin: z.number().min(0).max(50),
  }),
  image_url: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface QRCodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateQRCodeData) => Promise<void>;
  initialData?: QRCode | null;
  loading?: boolean;
  mode?: "create" | "edit";
}

const defaultStyling: QRCodeStylingType = {
  width: 300,
  height: 300,
  margin: 10,
  dotsType: "rounded",
  dotsColor: "#000000",
  dotsGradientEnabled: false,
  dotsGradientType: "linear",
  dotsGradientRotation: 0,
  dotsGradientStartColor: "#000000",
  dotsGradientEndColor: "#666666",
  backgroundColor: "#ffffff",
  backgroundTransparent: false,
  backgroundGradientEnabled: false,
  backgroundGradientType: "linear",
  backgroundGradientRotation: 0,
  backgroundGradientStartColor: "#ffffff",
  backgroundGradientEndColor: "#f0f0f0",
  errorCorrectionLevel: "Q",
  hideBackgroundDots: true,
  imageSize: 0.4,
  imageMargin: 20,
};

// QR Code style presets
const qrPresets = {
  classic: {
    name: "Classic",
    dotsType: "square" as const,
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    backgroundTransparent: false,
    dotsGradientEnabled: false,
    backgroundGradientEnabled: false,
  },
  modern: {
    name: "Modern",
    dotsType: "rounded" as const,
    dotsColor: "#1a1a1a",
    backgroundColor: "#f8f8f8",
    backgroundTransparent: false,
    dotsGradientEnabled: false,
    backgroundGradientEnabled: false,
  },
  gradient: {
    name: "Gradient",
    dotsType: "rounded" as const,
    dotsColor: "#000000",
    dotsGradientEnabled: true,
    dotsGradientStartColor: "#3b82f6",
    dotsGradientEndColor: "#1d4ed8",
    backgroundColor: "#ffffff",
    backgroundTransparent: false,
    backgroundGradientEnabled: false,
  },
  vibrant: {
    name: "Vibrant",
    dotsType: "extra-rounded" as const,
    dotsColor: "#000000",
    dotsGradientEnabled: true,
    dotsGradientStartColor: "#f59e0b",
    dotsGradientEndColor: "#ef4444",
    backgroundColor: "#fef3c7",
    backgroundTransparent: false,
    backgroundGradientEnabled: false,
  },
};

const QRCodeFormDialog: React.FC<QRCodeFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  loading = false,
  mode = "create",
}) => {
  const [qrCode, setQrCode] = useState<any>(null); // QRCodeStyling instance
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Load QRCodeStyling on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoaded(true);
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      redirect_url: "",
      styling: defaultStyling,
      image_url: "",
    },
  });

  // Watch form values for live preview
  const watchedValues = form.watch();
  
  // Only watch styling changes for edit mode to prevent unnecessary QR regeneration
  const watchedStyling = form.watch("styling");
  const watchedRedirectUrl = form.watch("redirect_url");
  const watchedImageUrl = form.watch("image_url");

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && mode === "edit") {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        redirect_url: initialData.redirect_url,
        styling: initialData.styling,
        image_url: initialData.image_url || "",
      });
    } else if (mode === "create") {
      form.reset({
        name: "",
        description: "",
        redirect_url: "",
        styling: defaultStyling,
        image_url: "",
      });
    }
  }, [initialData, mode, form]);

  // Generate QR code when values change
  useEffect(() => {
    if (!open || !isLoaded) return;
    
    const generateQRCode = async () => {
      setIsGenerating(true);
      
      try {
        // Dynamically import QRCodeStyling on client side
        const QRCodeStylingModule = await import('qr-code-styling');
        const QRCodeStyling = QRCodeStylingModule.default;
        
        const styling = watchedStyling;
        
        // Create gradient objects if enabled
        const dotsGradient = styling.dotsGradientEnabled ? {
          type: styling.dotsGradientType,
          rotation: styling.dotsGradientRotation * Math.PI / 180,
          colorStops: [
            { offset: 0, color: styling.dotsGradientStartColor },
            { offset: 1, color: styling.dotsGradientEndColor },
          ],
        } : undefined;

        const backgroundGradient = (styling.backgroundGradientEnabled && !styling.backgroundTransparent) ? {
          type: styling.backgroundGradientType,
          rotation: styling.backgroundGradientRotation * Math.PI / 180,
          colorStops: [
            { offset: 0, color: styling.backgroundGradientStartColor },
            { offset: 1, color: styling.backgroundGradientEndColor },
          ],
        } : undefined;

        // QR code should always point to our QR endpoint, not the redirect URL
        const data = initialData && mode === "edit" 
          ? `${window.location.origin}/qr/${initialData.code}`
          : watchedRedirectUrl || "https://example.com";
        
        const options = {
          width: styling.width,
          height: styling.height,
          type: "canvas" as const,
          data,
          image: watchedImageUrl || undefined,
          margin: styling.margin,
          qrOptions: {
            typeNumber: 0 as const,
            mode: "Byte" as const,
            errorCorrectionLevel: styling.errorCorrectionLevel,
          },
          imageOptions: {
            hideBackgroundDots: styling.hideBackgroundDots,
            imageSize: styling.imageSize,
            margin: styling.imageMargin,
            crossOrigin: "anonymous" as const,
          },
          dotsOptions: {
            color: styling.dotsGradientEnabled ? undefined : styling.dotsColor,
            gradient: dotsGradient,
            type: styling.dotsType,
          },
          backgroundOptions: {
            color: styling.backgroundTransparent 
              ? "transparent" 
              : styling.backgroundGradientEnabled 
                ? undefined 
                : styling.backgroundColor,
            gradient: backgroundGradient,
          },
        };

        const newQrCode = new QRCodeStyling(options);
        setQrCode(newQrCode);

        // Clear previous QR code and append new one
        if (qrRef.current) {
          qrRef.current.innerHTML = "";
          newQrCode.append(qrRef.current);
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    const timeoutId = setTimeout(() => {
      generateQRCode();
    }, 300); // Debounce to avoid too frequent updates

    return () => clearTimeout(timeoutId);
  }, [
    watchedStyling, 
    watchedImageUrl, 
    mode === "create" ? watchedRedirectUrl : null, // Only watch redirect URL in create mode
    open, 
    isLoaded, 
    initialData?.code, 
    mode
  ]);

  const applyPreset = (presetKey: keyof typeof qrPresets) => {
    const preset = qrPresets[presetKey];
    const currentStyling = form.getValues("styling");
    
    form.setValue("styling", {
      ...currentStyling,
      ...preset,
    });
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    qrCode.download({ name: "qr-code", extension: "png" });
  };

  const handleSubmit = async (data: FormValues) => {
    const submitData: CreateQRCodeData = {
      name: data.name,
      description: data.description || undefined,
      redirect_url: data.redirect_url,
      styling: data.styling,
      image_url: data.image_url || undefined,
    };

    await onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-full max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {mode === "create" ? "Create New QR Code" : "Edit QR Code"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Create a new QR code with custom styling and live preview." 
              : "Update your QR code settings and styling with live preview."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Panel - Settings */}
              <div className="lg:col-span-3">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Basic Information
                    </TabsTrigger>
                    <TabsTrigger value="styling" className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Styling & Design
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>QR Code Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Website Homepage"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A descriptive name for your QR code
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Additional details about this QR code..."
                                className="min-h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional description for your reference
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="redirect_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Redirect URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Where users will be redirected when they scan the QR code
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo/Image URL (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/logo.png"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              URL of an image to display in the center of the QR code
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {mode === "edit" && initialData && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            Current QR Code
                          </h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Code:</span>{" "}
                              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                                {initialData.code}
                              </code>
                            </p>
                            <p>
                              <span className="font-medium">Scans:</span> {initialData.scan_count}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              <span className={initialData.is_active ? "text-green-600" : "text-red-600"}>
                                {initialData.is_active ? "Active" : "Inactive"}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="styling" className="mt-6">
                    <div className="space-y-6">
                      {/* Style Presets */}
                      <div>
                        <Label className="text-base font-medium">Quick Presets</Label>
                                                 <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">
                          {Object.entries(qrPresets).map(([key, preset]) => (
                            <Button
                              key={key}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => applyPreset(key as keyof typeof qrPresets)}
                              className="h-auto py-3 px-4 flex flex-col items-center gap-1"
                            >
                              <div className="text-sm font-medium">{preset.name}</div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Size Settings */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Size & Dimensions</Label>
                        
                                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <FormField
                            control={form.control}
                            name="styling.width"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Width</FormLabel>
                                <FormControl>
                                  <div className="space-y-2">
                                    <Slider
                                      min={100}
                                      max={1000}
                                      step={10}
                                      value={[field.value]}
                                      onValueChange={(value) => field.onChange(value[0])}
                                    />
                                    <div className="text-center text-sm text-muted-foreground">
                                      {field.value}px
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="styling.height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height</FormLabel>
                                <FormControl>
                                  <div className="space-y-2">
                                    <Slider
                                      min={100}
                                      max={1000}
                                      step={10}
                                      value={[field.value]}
                                      onValueChange={(value) => field.onChange(value[0])}
                                    />
                                    <div className="text-center text-sm text-muted-foreground">
                                      {field.value}px
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                                                     <FormField
                             control={form.control}
                             name="styling.margin"
                             render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Margin</FormLabel>
                                 <FormControl>
                                   <div className="space-y-2">
                                     <Slider
                                       min={0}
                                       max={50}
                                       step={1}
                                       value={[field.value]}
                                       onValueChange={(value) => field.onChange(value[0])}
                                     />
                                     <div className="text-center text-sm text-muted-foreground">
                                       {field.value}px
                                     </div>
                                   </div>
                                 </FormControl>
                               </FormItem>
                             )}
                           />

                           <div className="flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                             <div className="text-center">
                               <div className="text-lg font-semibold">{Math.round((watchedValues.styling?.width || 300) * (watchedValues.styling?.height || 300) / 1000)}K</div>
                               <div className="text-xs text-muted-foreground">Pixels</div>
                             </div>
                           </div>
                         </div>
                      </div>

                      <Separator />

                      {/* Dots Style */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Dots Style</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="styling.dotsType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dots Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select dots type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="rounded">Rounded</SelectItem>
                                    <SelectItem value="dots">Dots</SelectItem>
                                    <SelectItem value="classy">Classy</SelectItem>
                                    <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                                    <SelectItem value="square">Square</SelectItem>
                                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="styling.dotsColor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dots Color</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input
                                      type="color"
                                      className="w-16 h-10 p-1 rounded"
                                      {...field}
                                    />
                                    <Input
                                      type="text"
                                      placeholder="#000000"
                                      className="flex-1"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Dots Gradient */}
                        <FormField
                          control={form.control}
                          name="styling.dotsGradientEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Dots Gradient</FormLabel>
                                <FormDescription>
                                  Use gradient colors for the dots instead of solid color
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {watchedValues.styling?.dotsGradientEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                            <FormField
                              control={form.control}
                              name="styling.dotsGradientStartColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gradient Start Color</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        className="w-16 h-10 p-1 rounded"
                                        {...field}
                                      />
                                      <Input
                                        type="text"
                                        placeholder="#000000"
                                        className="flex-1"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="styling.dotsGradientEndColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gradient End Color</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        className="w-16 h-10 p-1 rounded"
                                        {...field}
                                      />
                                      <Input
                                        type="text"
                                        placeholder="#666666"
                                        className="flex-1"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Background Style */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Background Style</Label>
                        
                        <FormField
                          control={form.control}
                          name="styling.backgroundTransparent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Transparent Background</FormLabel>
                                <FormDescription>
                                  Make the background transparent
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {!watchedValues.styling?.backgroundTransparent && (
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="styling.backgroundColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Background Color</FormLabel>
                                  <FormControl>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        className="w-16 h-10 p-1 rounded"
                                        {...field}
                                      />
                                      <Input
                                        type="text"
                                        placeholder="#ffffff"
                                        className="flex-1"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="styling.backgroundGradientEnabled"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Enable Background Gradient</FormLabel>
                                    <FormDescription>
                                      Use gradient colors for the background
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {watchedValues.styling?.backgroundGradientEnabled && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-green-200 dark:border-green-800">
                                <FormField
                                  control={form.control}
                                  name="styling.backgroundGradientStartColor"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Gradient Start Color</FormLabel>
                                      <FormControl>
                                        <div className="flex gap-2">
                                          <Input
                                            type="color"
                                            className="w-16 h-10 p-1 rounded"
                                            {...field}
                                          />
                                          <Input
                                            type="text"
                                            placeholder="#ffffff"
                                            className="flex-1"
                                            {...field}
                                          />
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="styling.backgroundGradientEndColor"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Gradient End Color</FormLabel>
                                      <FormControl>
                                        <div className="flex gap-2">
                                          <Input
                                            type="color"
                                            className="w-16 h-10 p-1 rounded"
                                            {...field}
                                          />
                                          <Input
                                            type="text"
                                            placeholder="#f0f0f0"
                                            className="flex-1"
                                            {...field}
                                          />
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Advanced Settings */}
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Advanced Settings</Label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="styling.errorCorrectionLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Error Correction Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="L">Low (7%)</SelectItem>
                                    <SelectItem value="M">Medium (15%)</SelectItem>
                                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                                    <SelectItem value="H">High (30%)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Higher levels allow more damage tolerance but create denser QR codes
                                </FormDescription>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="styling.hideBackgroundDots"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Hide Background Dots</FormLabel>
                                  <FormDescription>
                                    Hide dots behind the logo/image
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {watchedValues.image_url && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="styling.imageSize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image Size</FormLabel>
                                  <FormControl>
                                    <div className="space-y-2">
                                      <Slider
                                        min={0.1}
                                        max={1}
                                        step={0.1}
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                      />
                                      <div className="text-center text-sm text-muted-foreground">
                                        {Math.round(field.value * 100)}%
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="styling.imageMargin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image Margin</FormLabel>
                                  <FormControl>
                                    <div className="space-y-2">
                                      <Slider
                                        min={0}
                                        max={50}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                      />
                                      <div className="text-center text-sm text-muted-foreground">
                                        {field.value}px
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Panel - Live Preview */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Live Preview</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={downloadQRCode}
                        disabled={!qrCode}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="p-6 border rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center min-h-[350px]">
                      {isGenerating ? (
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-zinc-500">Generating...</p>
                        </div>
                      ) : (
                        <div 
                          ref={qrRef} 
                          className="flex items-center justify-center"
                          style={{ minHeight: watchedValues.styling?.height || 300 }}
                        />
                      )}
                    </div>

                                         <div className="space-y-3">
                       {initialData && mode === "edit" && (
                         <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                           <Label className="text-sm font-medium text-green-900 dark:text-green-100">
                             QR Code URL
                           </Label>
                           <p className="text-sm text-green-700 dark:text-green-300 mt-1 break-all font-mono">
                             {typeof window !== 'undefined' ? `${window.location.origin}/qr/${initialData.code}` : '...'}
                           </p>
                         </div>
                       )}
                       
                       {watchedValues.redirect_url && (
                         <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                           <Label className="text-sm font-medium text-blue-900 dark:text-blue-100">
                             Redirects To
                           </Label>
                           <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 break-all">
                             {watchedValues.redirect_url}
                           </p>
                         </div>
                       )}
                     </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-3 bg-white dark:bg-zinc-800 rounded-lg border">
                        <div className="font-medium">{watchedValues.styling?.width || 300}x{watchedValues.styling?.height || 300}</div>
                        <div className="text-zinc-500">Size</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-zinc-800 rounded-lg border">
                        <div className="font-medium">{watchedValues.styling?.errorCorrectionLevel || 'Q'}</div>
                        <div className="text-zinc-500">Error Level</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : mode === "create" ? "Create QR Code" : "Update QR Code"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeFormDialog; 