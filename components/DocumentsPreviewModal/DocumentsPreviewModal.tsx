'use client';

import React, { useState } from 'react';
import { X, User, CreditCard, IdCard, Sparkles, XCircle, CheckCircle } from 'lucide-react';
import ImagePreview from '../common/ImagePreview';
import { Button } from '../Button/Button';
import { verifyDocumentDetails } from '@/utils/axios/auth';
import { toast } from 'sonner';

type ManagerDocuments = {
    selfieImage: string | null;
    aadharFrontImage: string | null;
    aadharBackImage: string | null;
    panImage: string | null;
    aadharNumber: string | null;
    panNumber: string | null;
    name: string;
};

type DocumentsPreviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    documents: ManagerDocuments | null;
    onAccept?: () => void;
    onReject?: (reason: string) => void;
    userId?: number;
    documentStatus?: number;
};

const DocumentsPreviewModal: React.FC<DocumentsPreviewModalProps> = ({
    isOpen,
    onClose,
    documents,
    onAccept,
    onReject,
    userId = 4,
    documentStatus,
}) => {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    // Check if document is already verified (status 3) or was verified in this session
    const isDocumentVerified = documentStatus === 3 || isVerified;

    if (!isOpen || !documents) return null;

    const handleRejectClick = () => {
        setShowRejectForm(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setIsRejecting(true);
        try {
            const payload = {
                userId: userId,
                status: 4,
                remarks: rejectReason.trim()
            };

            const response = await verifyDocumentDetails(payload);
            if (response && response.code === 201) {
                toast.success('Document rejection submitted successfully!');
                setRejectReason('');
                setShowRejectForm(false);
                if (onReject) {
                    onReject(rejectReason.trim());
                }
                onClose();
            } else {
                throw new Error(response?.message || 'Failed to reject documents');
            }
        } catch (error: any) {
            console.error('Error rejecting documents:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject documents. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsRejecting(false);
        }
    };

    const handleRejectCancel = () => {
        setShowRejectForm(false);
        setRejectReason('');
    };

    const handleClose = () => {
        setShowRejectForm(false);
        setRejectReason('');
        onClose();
    };

    const handleAccept = async () => {
        setIsVerifying(true);
        try {
            const payload = {
                userId: userId,
                status: 3
            };

            const response = await verifyDocumentDetails(payload);
            if (response?.code === 201) {
                setIsVerified(true);
                toast.success('Document verification successful!');
                if (onAccept) {
                    onAccept();
                }
            } else {
                throw new Error(response?.message || 'Failed to verify documents');
            }
        } catch (error: any) {
            console.error('Error verifying documents:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to verify documents. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Gradient Background */}
                <div className="relative bg-primary-50 px-6 py-5 shadow-md">
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary-100 backdrop-blur-sm rounded-xl">
                                <Sparkles className="h-5 w-5 text-primary-500" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-primary-500 uppercase tracking-wider">
                                    Document Verification
                                </p>
                                <h2 className="text-xl font-bold text-primary-600 mt-0.5">
                                    {documents.name}
                                </h2>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="p-2 rounded-xl bg-primary-100 backdrop-blur-sm text-primary-500 hover:bg-primary-200 transition-all duration-200 hover:scale-110"
                            onClick={handleClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 thin-scrollbar">
                    {/* Profile Photo Section */}
                    <div className="group">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-800">Profile Photo</h3>
                        </div>
                        {documents.selfieImage ? (
                            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="max-w-[300px] mx-auto h-[250px]">
                                    <ImagePreview
                                        src={documents.selfieImage}
                                        alt="Profile Photo"
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-400 font-medium">No profile photo available</p>
                            </div>
                        )}
                    </div>

                    {/* Aadhar Card Section */}
                    <div className="group">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                                <IdCard className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-800">Aadhar Card</h3>
                        </div>

                        {documents.aadharNumber && (
                            <div className="mb-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 p-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold text-emerald-700">Aadhar Number:</span>
                                    <span className="ml-2 font-mono text-gray-900">{documents.aadharNumber}</span>
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">Front Side</p>
                                {documents.aadharFrontImage ? (
                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-full h-[250px]">
                                            <ImagePreview
                                                src={documents.aadharFrontImage}
                                                alt="Aadhar Front"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                                        <IdCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs text-gray-400">No image</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">Back Side</p>
                                {documents.aadharBackImage ? (
                                    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-full h-[250px]">
                                            <ImagePreview
                                                src={documents.aadharBackImage}
                                                alt="Aadhar Back"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                                        <IdCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs text-gray-400">No image</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PAN Card Section */}
                    <div className="group">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                                <CreditCard className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-800">PAN Card</h3>
                        </div>

                        {documents.panNumber && (
                            <div className="mb-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold text-amber-700">PAN Number:</span>
                                    <span className="ml-2 font-mono text-gray-900">{documents.panNumber}</span>
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">PAN Card Image</p>
                            {documents.panImage ? (
                                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-[250px] w-[300px] mx-auto">
                                        <ImagePreview
                                            src={documents.panImage}
                                            alt="PAN Card"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
                                    <CreditCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">No image</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - Action Buttons */}
                {!isDocumentVerified && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                        {!showRejectForm ? (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={handleRejectClick}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                </div>
                                <div className="flex items-center justify-end">
                                    <Button
                                        variant="accept"
                                        type="button"
                                        onClick={handleAccept}
                                        disabled={isVerifying}
                                    >
                                        <CheckCircle className="text-white mr-2 h-4 w-4" />
                                        {isVerifying ? 'Verifying...' : 'Accept'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Please provide a reason for rejection..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-black"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={handleRejectCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={handleRejectSubmit}
                                        disabled={!rejectReason.trim() || isRejecting}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        {isRejecting ? 'Submitting...' : 'Submit Rejection'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentsPreviewModal;

