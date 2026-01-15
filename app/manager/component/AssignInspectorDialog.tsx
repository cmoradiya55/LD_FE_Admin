"use client";

import { X, UserCheck, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/common';
import { Button } from '@/components/Button/Button';
import { CarData } from '@/lib/CarData';
import { Inspector } from '@/app/manager/carList/carListComponent';

interface AssignInspectorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCar: CarData | null;
    selectedInspector: Inspector | null;
    onInspectorSelect: (inspector: Inspector) => void;
    onAssign: () => void;
    isLoadingInspectors: boolean;
    isInspectorsError: boolean;
    activeInspectors: Inspector[];
}

const AssignInspectorDialog = ({
    isOpen,
    onClose,
    selectedCar,
    selectedInspector,
    onInspectorSelect,
    onAssign,
    isLoadingInspectors,
    isInspectorsError,
    activeInspectors,
}: AssignInspectorDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 lg:pb-4" onClick={onClose}>
            <div className="bg-white w-full sm:w-96 max-h-[90vh] rounded-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Assign Inspector</h3>
                        <button onClick={onClose} className="text-white bg-white/10 p-1.5 rounded-full">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    {selectedCar && (
                        <div className="mt-4 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <div className="h-14 w-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                <Image src={selectedCar.image} alt={selectedCar.name} width={56} height={56} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">{selectedCar.name}</h4>
                                <p className="text-xs text-white/80">{selectedCar.price}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoadingInspectors ? (
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="flex flex-col items-center gap-4">
                                <LoadingSpinner size="lg" />
                                <p className="text-slate-600 text-sm">Loading inspectors...</p>
                            </div>
                        </div>
                    ) : isInspectorsError ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <UserCheck className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">Error loading inspectors</p>
                            <p className="text-xs text-slate-500 mt-1">Please try again later</p>
                        </div>
                    ) : activeInspectors.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <UserCheck className="h-8 w-8 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">No verified inspectors available</p>
                            <p className="text-xs text-slate-500 mt-1">Check back later</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Select Inspector</p>
                            {activeInspectors.map((inspector: Inspector) => {
                                const isSelected = selectedInspector?.id === inspector.id;
                                return (
                                    <div
                                        key={inspector.id}
                                        onClick={() => onInspectorSelect(inspector)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-blue-300'
                                            }`}
                                    >
                                        <div className={`h-14 w-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ${isSelected ? 'ring-blue-500' : 'ring-slate-200'}`}>
                                            {inspector.imageUrl ? (
                                                <Image src={inspector.imageUrl} alt={inspector.name} width={56} height={56} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                                    <span className="text-base font-bold text-white">
                                                        {inspector.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-base font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{inspector.name}</h3>
                                            <p className="text-sm text-slate-600 truncate flex items-center gap-1.5 mt-1">
                                                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                                {inspector.phone}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {isSelected ? (
                                                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                                </div>
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {selectedInspector && (
                    <div className="border-t border-slate-200 bg-slate-50/50 p-4">
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={onAssign} className="flex-1">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Assign
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignInspectorDialog;

