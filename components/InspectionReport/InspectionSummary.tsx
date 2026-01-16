"use client";

import React, { useState } from "react";
import { Camera, Cog, ShipWheel, AirVent, Plug, Star, ChevronDown, ChevronUp, CheckCircle, XCircle, Play, Car, RockingChair, SquareStack, AlertTriangle } from "lucide-react";
import { InspectionImageType } from "@/lib/data";
import ImagePreview from "@/components/common/ImagePreview";

interface FieldData {
  damage?: string;
  remarks?: string;
  image?: string;
  [key: string]: any;
}

interface FieldDefinition {
  name: string;
  label: string;
  type: number;
  sub_type: number;
  fieldType?: string;
}

interface InspectionSummaryProps {
  formValues: Record<string, any>;
  allFields: {
    exterior: FieldDefinition[];
    engine: FieldDefinition[];
    mechanical: FieldDefinition[];
    ac: FieldDefinition[];
    electrical: FieldDefinition[];
    interior: FieldDefinition[];
    seats: FieldDefinition[];
  };
}

const InspectionSummary: React.FC<InspectionSummaryProps> = ({ formValues, allFields }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    exterior: false,
    engine: false,
    mechanical: false,
    ac: false,
    electrical: false,
    interior: false,
    seats: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getSectionStats = (fields: FieldDefinition[]) => {
    let perfectCount = 0;
    let imperfectCount = 0;

    fields.forEach((field) => {
      const fieldData = formValues[field.name] as FieldData | undefined;
      const damage = fieldData?.damage;
      if (!damage) return;

      if (damage === "no") {
        perfectCount += 1;
      } else if (damage === "yes") {
        imperfectCount += 1;
      }
    });

    const totalFields = fields.length;
    const emptyCount = totalFields - perfectCount - imperfectCount;
    const totalConsidered = perfectCount + imperfectCount;
    const rating = totalConsidered > 0 ? Number(((perfectCount / totalConsidered) * 5).toFixed(1)) : 0;

    return { perfectCount, imperfectCount, emptyCount, rating, totalConsidered, totalFields };
  };

  const generateSummaryText = (perfectCount: number, imperfectCount: number, totalConsidered: number): string => {
    if (totalConsidered === 0) {
      return "No assessment data filled yet for this section.";
    }
    if (imperfectCount === 0) {
      return `All ${totalConsidered} assessed parts are in perfect condition.`;
    }
    if (perfectCount === 0) {
      return `All ${totalConsidered} assessed parts need attention.`;
    }
    const perfectText = `${perfectCount} perfect part${perfectCount !== 1 ? "s" : ""}`;
    const imperfectText = `${imperfectCount} part${imperfectCount !== 1 ? "s" : ""} need${imperfectCount === 1 ? "s" : ""} attention`;
    return `${perfectText}. ${imperfectText}.`;
  };

  const sections = [
    {
      id: "exterior",
      title: "Exterior",
      icon: Camera,
      fields: allFields.exterior,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "engine",
      title: "Engine & Transmission",
      icon: Cog,
      fields: allFields.engine,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "mechanical",
      title: "Steering, Suspension & Brakes",
      icon: ShipWheel,
      fields: allFields.mechanical,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "ac",
      title: "Air Conditioner",
      icon: AirVent,
      fields: allFields.ac,
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      id: "electrical",
      title: "Electrical",
      icon: Plug,
      fields: allFields.electrical,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "interior",
      title: "Interior",
      icon: SquareStack,
      fields: allFields.interior,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      id: "seats",
      title: "Seats",
      icon: RockingChair,
      fields: allFields.seats,
      bgColor: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  const carDetails = {
    registration_number: formValues.registration_number || "N/A",
    registartion_year: formValues.registartion_year || "N/A",
    km_driven: formValues.km_driven || "N/A",
    rc_image: formValues.rc_image,
    insurance_image: formValues.insurance_image,
  };

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 rounded-xl p-4 shadow-lg">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        <div className="relative">
          <h2 className="text-base font-bold text-white mb-1 drop-shadow-lg">Inspection Summary</h2>
          <p className="text-primary-50 text-[11px] font-medium">Review all inspection details before submission</p>
        </div>
      </div>

      {/* Car Details Section */}
      <div className="group bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300">
        <div className="relative px-3 py-2.5 bg-gradient-to-r from-primary-50 via-blue-50/80 to-primary-50 border-b border-slate-200/60">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 shadow-sm">
              <Car className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Car Details</h3>
          </div>
        </div>
        <div className="p-3 space-y-3">
          {/* Basic Information - Compact Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
            <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-200/60">
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Registration Number</p>
              <p className="text-xs font-bold text-slate-900">{carDetails.registration_number}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-200/60">
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Registration Year</p>
              <p className="text-xs font-bold text-slate-900">{carDetails.registartion_year}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50/80 border border-slate-200/60">
              <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">KM Driven</p>
              <p className="text-xs font-bold text-slate-900">{typeof carDetails.km_driven === 'number' ? carDetails.km_driven.toLocaleString() : carDetails.km_driven}</p>
            </div>
          </div>

          {/* Document Images - Compact with smaller images */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-200/60 hover:border-blue-300/50 hover:shadow-sm transition-all duration-200">
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-semibold text-slate-700 uppercase tracking-wide mb-1">RC Image</p>
                <p className="text-[10px] text-slate-600">{carDetails.rc_image ? "Click to preview" : "No image uploaded"}</p>
              </div>
              <div className="flex-shrink-0">
                {carDetails.rc_image ? (
                  <div className="w-16 h-16 rounded border border-blue-200/60 bg-white overflow-hidden">
                    <ImagePreview
                      src={carDetails.rc_image}
                      alt="RC Image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50/50 border border-slate-200/60 hover:border-emerald-300/50 hover:shadow-sm transition-all duration-200">
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-semibold text-slate-700 uppercase tracking-wide mb-1">Insurance Image</p>
                <p className="text-[10px] text-slate-600">{carDetails.insurance_image ? "Click to preview" : "No image uploaded"}</p>
              </div>
              <div className="flex-shrink-0">
                {carDetails.insurance_image ? (
                  <div className="w-16 h-16 rounded border border-emerald-200/60 bg-white overflow-hidden">
                    <ImagePreview
                      src={carDetails.insurance_image}
                      alt="Insurance Image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {sections.map((section) => {
        const { perfectCount, imperfectCount, emptyCount, rating, totalConsidered } = getSectionStats(section.fields);
        const Icon = section.icon;
        const isExpanded = expandedSections[section.id];

        const summaryText = generateSummaryText(perfectCount, imperfectCount, totalConsidered);

        return (
          <div
            key={section.id}
            className="group bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-300"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all duration-300"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`relative p-2 rounded-lg ${section.bgColor} flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${section.iconColor}`} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 truncate mb-1">{section.title}</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 transition-all duration-200 ${star <= Math.round(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {rating}/5
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Perfect: {perfectCount}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100">
                      Imperfect: {imperfectCount}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      Empty: {emptyCount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-tight line-clamp-1">{summaryText}</p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2 p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 border-t border-slate-200/60 bg-gradient-to-b from-slate-50/30 to-white">
                <div className="pt-2 space-y-4">
                  {(() => {
                    const perfectFields: Array<{ field: FieldDefinition; fieldData: FieldData }> = [];
                    const imperfectFields: Array<{ field: FieldDefinition; fieldData: FieldData }> = [];
                    const emptyFields: Array<{ field: FieldDefinition; fieldData: FieldData }> = [];

                    section.fields.forEach((field) => {
                      const fieldData = formValues[field.name] as FieldData | undefined;
                      const damage = fieldData?.damage;

                      if (damage === "no") {
                        perfectFields.push({ field, fieldData: fieldData || {} });
                      } else if (damage === "yes") {
                        imperfectFields.push({ field, fieldData: fieldData || {} });
                      } else {
                        emptyFields.push({ field, fieldData: fieldData || {} });
                      }
                    });

                    const renderFieldCard = (field: FieldDefinition, fieldData: FieldData) => {
                      const damage = fieldData?.damage;
                      const remarks = fieldData?.remarks;
                      const image = fieldData?.image;
                      const treadDepth = fieldData?.treadDepth || fieldData?.tread_depth;
                      const electricalType = fieldData?.electrical_type;
                      const isTyre = field.type === InspectionImageType.TYRES;
                      const isElectrical = field.fieldType === "electrical";
                      const isVideoField = field.fieldType === "exhaust" || field.fieldType === "gearShifting" || field.fieldType === "engineSound";
                      const hasImage = image && !isVideoField;
                      const hasVideo = image && isVideoField;

                      return (
                        <div
                          key={field.name}
                          className="flex flex-row gap-3 p-2.5 rounded-lg bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                        >
                          {/* Left Side - Details */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-slate-600">
                                <span className="font-medium">Damage:</span> {damage ? damage.toUpperCase() : "Not selected"}
                              </p>
                              {isTyre && treadDepth && (
                                <p className="text-xs text-slate-600">
                                  <span className="font-medium">Tread depth:</span> {treadDepth} mm
                                </p>
                              )}
                              {isElectrical && electricalType && (
                                <p className="text-xs text-slate-600">
                                  <span className="font-medium">Type:</span> {electricalType.charAt(0).toUpperCase() + electricalType.slice(1)}
                                </p>
                              )}
                              {remarks && remarks.trim() && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  <span className="font-medium">Remarks:</span> {remarks}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Side - Image or Video */}
                          <div className="flex-shrink-0 w-20 h-20 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-center overflow-hidden">
                            {hasImage ? (
                              <ImagePreview
                                src={image}
                                alt={field.label}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : hasVideo ? (
                              <div className="w-full h-full rounded-lg relative group overflow-hidden bg-slate-900 cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                const container = e.currentTarget;
                                const video = container.querySelector('video') as HTMLVideoElement;
                                if (video) {
                                  video.controls = true;
                                  if (video.requestFullscreen) video.requestFullscreen();
                                  else if ((video as any).webkitRequestFullscreen) (video as any).webkitRequestFullscreen();
                                  else if ((video as any).mozRequestFullScreen) (video as any).mozRequestFullScreen();
                                  else if ((video as any).msRequestFullscreen) (video as any).msRequestFullscreen();
                                }
                              }}>
                                <video
                                  src={image}
                                  className="w-full h-full object-contain rounded-lg"
                                  playsInline preload="metadata"
                                  muted style={{ objectFit: 'contain' }}
                                  onLoadedMetadata={(e) => { e.currentTarget.style.objectFit = 'contain'; }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play className="h-3 w-3 text-white fill-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 text-center px-2">
                                No media
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <>
                        {/* Perfect Section */}
                        {perfectFields.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-emerald-100">
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                Perfect
                                <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                  {perfectFields.length}
                                </span>
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {perfectFields.map(({ field, fieldData }) => renderFieldCard(field, fieldData))}
                            </div>
                          </div>
                        )}

                        {/* Imperfect Section */}
                        {imperfectFields.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-red-100">
                                <XCircle className="h-4 w-4 text-red-600" />
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                Imperfect
                                <span className="ml-2 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                  {imperfectFields.length}
                                </span>
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {imperfectFields.map(({ field, fieldData }) => renderFieldCard(field, fieldData))}
                            </div>
                          </div>
                        )}

                        {/* Empty Section */}
                        {emptyFields.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 rounded-lg bg-slate-100">
                                <AlertTriangle className="h-4 w-4 text-slate-600" />
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm">
                                Empty
                                <span className="ml-2 text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">
                                  {emptyFields.length}
                                </span>
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {emptyFields.map(({ field, fieldData }) => renderFieldCard(field, fieldData))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InspectionSummary;

