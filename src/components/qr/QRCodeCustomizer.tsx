"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import QRCodeStyling from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Download, Eye, RefreshCw, Square, Instagram, Briefcase, Github, Sunset, Zap, Circle } from "lucide-react";

const formSchema = z.object({
  data: z.string().min(1, "Data is required"),
  width: z.number().min(100).max(1000),
  height: z.number().min(100).max(1000),
  margin: z.number().min(0).max(50),
  image: z.string().optional(),
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
  cornersSquareType: z.enum(["dot", "square", "extra-rounded", "rounded", "dots", "classy", "classy-rounded"]).optional(),
  cornersSquareColor: z.string().optional(),
  cornersDotType: z.enum(["dot", "square", "rounded", "dots", "classy", "classy-rounded", "extra-rounded"]).optional(),
  cornersDotColor: z.string().optional(),
  errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]),
  hideBackgroundDots: z.boolean(),
  imageSize: z.number().min(0.1).max(1),
  imageMargin: z.number().min(0).max(50),
});

type FormValues = z.infer<typeof formSchema>;

// Template Icons
const templateIcons = {
  default: Square,
  social: Instagram,
  business: Briefcase,
  github: Github,
  sunset: Sunset,  
  neon: Zap,
  transparent: Circle,
};

// QR Code Templates
const qrTemplates = {
  default: {
    name: "Default",
    description: "Clean black and white design",
    data: "https://example.com",
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    backgroundTransparent: false,
    dotsType: "rounded" as const,
    dotsGradientEnabled: false,
    backgroundGradientEnabled: false,
  },
  social: {
    name: "Social Media",
    description: "Instagram-inspired gradient",
    data: "https://instagram.com/username",
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    backgroundTransparent: false,
    dotsType: "rounded" as const,
    dotsGradientEnabled: true,
    dotsGradientType: "linear" as const,
    dotsGradientStartColor: "#f9ce34",
    dotsGradientEndColor: "#ee2a7b",
    dotsGradientRotation: 45,
    backgroundGradientEnabled: false,
  },
  business: {
    name: "Professional",
    description: "Corporate blue theme",
    data: "https://company.com",
    dotsColor: "#1e40af",
    backgroundColor: "#ffffff",
    backgroundTransparent: false,
    dotsType: "square" as const,
    dotsGradientEnabled: true,
    dotsGradientType: "linear" as const,
    dotsGradientStartColor: "#1e40af",
    dotsGradientEndColor: "#0ea5e9",
    dotsGradientRotation: 90,
    backgroundGradientEnabled: true,
    backgroundGradientType: "radial" as const,
    backgroundGradientStartColor: "#f8fafc",
    backgroundGradientEndColor: "#e2e8f0",
    backgroundGradientRotation: 0,
  },
  github: {
    name: "GitHub",
    description: "Developer-friendly dark theme",
    data: "https://github.com/username",
    dotsColor: "#ffffff",
    backgroundColor: "#0d1117",
    backgroundTransparent: false,
    dotsType: "rounded" as const,
    dotsGradientEnabled: false,
    backgroundGradientEnabled: true,
    backgroundGradientType: "linear" as const,
    backgroundGradientStartColor: "#0d1117",
    backgroundGradientEndColor: "#21262d",
    backgroundGradientRotation: 135,
  },
  sunset: {
    name: "Sunset",
    description: "Warm gradient colors",
    data: "https://example.com",
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    backgroundTransparent: false,
    dotsType: "extra-rounded" as const,
    dotsGradientEnabled: true,
    dotsGradientType: "radial" as const,
    dotsGradientStartColor: "#ff7e5f",
    dotsGradientEndColor: "#feb47b",
    dotsGradientRotation: 0,
    backgroundGradientEnabled: true,
    backgroundGradientType: "linear" as const,
    backgroundGradientStartColor: "#fef3ec",
    backgroundGradientEndColor: "#fde8e8",
    backgroundGradientRotation: 180,
  },
  neon: {
    name: "Neon",
    description: "Cyberpunk aesthetic",
    data: "https://example.com",
    dotsColor: "#000000",
    backgroundColor: "#000000",
    backgroundTransparent: false,
    dotsType: "dots" as const,
    dotsGradientEnabled: true,
    dotsGradientType: "linear" as const,
    dotsGradientStartColor: "#00f5ff",
    dotsGradientEndColor: "#ff00ff",
    dotsGradientRotation: 45,
    backgroundGradientEnabled: true,
    backgroundGradientType: "radial" as const,
    backgroundGradientStartColor: "#1a0033",
    backgroundGradientEndColor: "#000000",
    backgroundGradientRotation: 0,
  },
  transparent: {
    name: "Transparent",
    description: "No background for overlays",
    data: "https://example.com",
    dotsColor: "#000000",
    backgroundColor: "#ffffff",
    backgroundTransparent: true,
    dotsType: "rounded" as const,
    dotsGradientEnabled: false,
    backgroundGradientEnabled: false,
  },
};

const QRCodeCustomizer: React.FC = () => {
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: "https://example.com",
      width: 300,
      height: 300,
      margin: 10,
      image: "",
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
      cornersSquareColor: "#000000",
      cornersDotColor: "#000000",
      errorCorrectionLevel: "Q",
      hideBackgroundDots: true,
      imageSize: 0.4,
      imageMargin: 20,
    },
  });

  const applyTemplate = (templateKey: keyof typeof qrTemplates) => {
    const template = qrTemplates[templateKey];
    const currentData = form.getValues("data");
    
    // Apply template values while preserving user's data if they've changed it
    form.reset({
      ...form.getValues(),
      ...template,
      data: currentData !== "https://example.com" ? currentData : template.data,
    });
  };

  const generateQRCode = (values: FormValues) => {
    setIsGenerating(true);
    
    try {
      // Create gradient objects if enabled
      const dotsGradient = values.dotsGradientEnabled ? {
        type: values.dotsGradientType,
        rotation: values.dotsGradientRotation * Math.PI / 180, // Convert to radians
        colorStops: [
          { offset: 0, color: values.dotsGradientStartColor },
          { offset: 1, color: values.dotsGradientEndColor },
        ],
      } : undefined;

      const backgroundGradient = (values.backgroundGradientEnabled && !values.backgroundTransparent) ? {
        type: values.backgroundGradientType,
        rotation: values.backgroundGradientRotation * Math.PI / 180, // Convert to radians
        colorStops: [
          { offset: 0, color: values.backgroundGradientStartColor },
          { offset: 1, color: values.backgroundGradientEndColor },
        ],
      } : undefined;

      const options = {
        width: values.width,
        height: values.height,
        type: "canvas" as const,
        data: values.data,
        image: values.image || undefined,
        margin: values.margin,
        qrOptions: {
          typeNumber: 0 as const,
          mode: "Byte" as const,
          errorCorrectionLevel: values.errorCorrectionLevel,
        },
        imageOptions: {
          hideBackgroundDots: values.hideBackgroundDots,
          imageSize: values.imageSize,
          margin: values.imageMargin,
          crossOrigin: "anonymous" as const,
        },
        dotsOptions: {
          color: values.dotsGradientEnabled ? undefined : values.dotsColor,
          gradient: dotsGradient,
          type: values.dotsType,
        },
        backgroundOptions: {
          color: values.backgroundTransparent 
            ? "transparent" 
            : values.backgroundGradientEnabled 
              ? undefined 
              : values.backgroundColor,
          gradient: backgroundGradient,
        },
        cornersSquareOptions: values.cornersSquareType ? {
          color: values.cornersSquareColor,
          type: values.cornersSquareType,
        } : undefined,
        cornersDotOptions: values.cornersDotType ? {
          color: values.cornersDotColor,
          type: values.cornersDotType,
        } : undefined,
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

  const downloadQRCode = async (extension: "png" | "svg" | "jpeg" | "webp" = "png") => {
    if (qrCode) {
      try {
        await qrCode.download({ name: "qr-code", extension });
      } catch (error) {
        console.error("Error downloading QR code:", error);
      }
    }
  };

  // Generate initial QR code
  useEffect(() => {
    generateQRCode(form.getValues());
  }, [form]);

  // Watch for form changes and regenerate QR code
  const watchedValues = form.watch();
  useEffect(() => {
    const subscription = form.watch(() => {
      generateQRCode(form.getValues());
    });
    return () => subscription.unsubscribe();
  }, [form, watchedValues]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              QR Code Customizer
            </CardTitle>
            <CardDescription>
              Customize your QR code with various styling options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form className="space-y-6">
                {/* Templates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Templates</h3>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                    {Object.entries(qrTemplates).map(([key, template]) => {
                      const IconComponent = templateIcons[key as keyof typeof templateIcons];
                      return (
                        <div key={key} className="flex flex-col">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => applyTemplate(key as keyof typeof qrTemplates)}
                            className="h-auto p-3 text-left justify-start"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <IconComponent className="w-4 h-4 flex-shrink-0" />
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="font-medium text-sm leading-none">{template.name}</div>
                                <div className="text-xs text-muted-foreground leading-none">{template.description}</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data (URL or Text)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter URL or text to encode"
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width: {field.value}px</FormLabel>
                          <FormControl>
                            <Slider
                              min={100}
                              max={1000}
                              step={10}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height: {field.value}px</FormLabel>
                          <FormControl>
                            <Slider
                              min={100}
                              max={1000}
                              step={10}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="margin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Margin: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={50}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Styling Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Styling Options</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="dotsColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dots Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input type="color" {...field} className="w-16 h-10 p-1" />
                                <Input {...field} placeholder="#000000" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dotsGradientEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Use Dots Gradient</FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("dotsGradientEnabled") && (
                        <div className="space-y-3 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <FormField
                            control={form.control}
                            name="dotsGradientType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gradient Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="linear">Linear</SelectItem>
                                    <SelectItem value="radial">Radial</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={form.control}
                              name="dotsGradientStartColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Color</FormLabel>
                                  <FormControl>
                                    <Input type="color" {...field} className="w-full h-10 p-1" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="dotsGradientEndColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Color</FormLabel>
                                  <FormControl>
                                    <Input type="color" {...field} className="w-full h-10 p-1" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="dotsGradientRotation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rotation: {field.value}°</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={360}
                                    step={15}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="backgroundColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input 
                                  type="color" 
                                  {...field} 
                                  className="w-16 h-10 p-1" 
                                  disabled={form.watch("backgroundTransparent")}
                                />
                                <Input 
                                  {...field} 
                                  placeholder="#ffffff" 
                                  disabled={form.watch("backgroundTransparent")}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="backgroundTransparent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Transparent Background</FormLabel>
                              <FormDescription className="text-xs">
                                Perfect for overlaying on other designs
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="backgroundGradientEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">Use Background Gradient</FormLabel>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                disabled={form.watch("backgroundTransparent")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("backgroundGradientEnabled") && !form.watch("backgroundTransparent") && (
                        <div className="space-y-3 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900">
                          <FormField
                            control={form.control}
                            name="backgroundGradientType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gradient Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="linear">Linear</SelectItem>
                                    <SelectItem value="radial">Radial</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <FormField
                              control={form.control}
                              name="backgroundGradientStartColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Color</FormLabel>
                                  <FormControl>
                                    <Input type="color" {...field} className="w-full h-10 p-1" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="backgroundGradientEndColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Color</FormLabel>
                                  <FormControl>
                                    <Input type="color" {...field} className="w-full h-10 p-1" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="backgroundGradientRotation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rotation: {field.value}°</FormLabel>
                                <FormControl>
                                  <Slider
                                    min={0}
                                    max={360}
                                    step={15}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="dotsType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dots Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dots style" />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="errorCorrectionLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Error Correction Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select error correction level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Low (7%)</SelectItem>
                            <SelectItem value="M">Medium (15%)</SelectItem>
                            <SelectItem value="Q">Quartile (25%)</SelectItem>
                            <SelectItem value="H">High (30%)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Image Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Logo/Image Options</h3>
                  
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/logo.png" />
                        </FormControl>
                        <FormDescription>
                          URL of the image to place in the center of the QR code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hideBackgroundDots"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Hide Background Dots</FormLabel>
                          <FormDescription>
                            Hide QR dots that would be covered by the image
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Size: {Math.round(field.value * 100)}%</FormLabel>
                        <FormControl>
                          <Slider
                            min={0.1}
                            max={1}
                            step={0.1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageMargin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Margin: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={50}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              Preview
            </CardTitle>
            <CardDescription>
              Live preview of your customized QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center items-center min-h-[300px] bg-zinc-50 dark:bg-zincx-900 rounded-lg">
              <div ref={qrRef} className="flex items-center justify-center" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => downloadQRCode("png")} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
              <Button onClick={() => downloadQRCode("svg")} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download SVG
              </Button>
              <Button onClick={() => downloadQRCode("jpeg")} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download JPEG
              </Button>
              <Button onClick={() => downloadQRCode("webp")} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download WebP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeCustomizer;
