import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, CalendarDays, Check, CheckCircle2, CreditCard, Loader2, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { localClient } from "../../../api/apollo/localClient";
import authService from "../../../features/auth/auth.service";
import { ASSIGN_COUPON_TO_PRACTICE, VALIDATE_COUPON_BY_CODE } from "../../practice/dashboard/graphql/subscription.query";
import { CREATE_PRACTICE_INFO, CREATE_PRACTICE_SUBSCRIPTION, GET_PAYMENT_SETTINGS } from "../graphql/clients.query";
import { CREATE_PRACTICE_PERMISSIONS, GET_PERMISSION_MODULES_MASTER } from "../graphql/permissions.queries";


interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

type PaymentType =
    | "PAY_PER_PATIENT"
    | "PAY_PER_MONTH";

export default function AddPracticeForm({ onClose, onSuccess }: Props) {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [isAssigningCoupon, setIsAssigningCoupon] = useState(false);

    const { data: modulesData } = useQuery(GET_PERMISSION_MODULES_MASTER, {
        client: localClient
    });

    const [updatePermissions] = useMutation(CREATE_PRACTICE_PERMISSIONS, {
        client: localClient
    });

    const [createPracticeInfo] = useMutation(CREATE_PRACTICE_INFO, {
        client: localClient
    });

    const [assignCoupon] = useMutation(ASSIGN_COUPON_TO_PRACTICE, {
        client: localClient
    });

    // Change from useMutation to useLazyQuery
    const [validateCoupon] = useLazyQuery(VALIDATE_COUPON_BY_CODE, {
        client: localClient,
        fetchPolicy: "network-only"
    });

    const [formData, setFormData] = useState({
        practice_name: "",
        abn_number: "",
        practice_type: "",
        practice_phone: "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        type: "PRACTICE_ADMIN",
        logo: "",
        termsAccepted: false
    });

    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>("PAY_PER_PATIENT");

    // Coupon related state
    const [couponCodeInput, setCouponCodeInput] = useState("");
    const [validatedCoupon, setValidatedCoupon] = useState<any>(null);
    const [couponValidationError, setCouponValidationError] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: checkbox.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Update the handleValidateCoupon function:
    const handleValidateCoupon = async () => {
        if (!couponCodeInput.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsValidatingCoupon(true);
        setCouponValidationError("");

        try {
            const result = await validateCoupon({
                variables: {
                    code: couponCodeInput.toUpperCase().trim()
                }
            });

            const coupons = (result as any).data?.coupons || [];
            const coupon = coupons[0];

            if (!coupon) {
                setCouponValidationError("Invalid coupon code");
                setValidatedCoupon(null);
                return;
            }

            // Check if coupon is valid based on date range
            const now = new Date();
            const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
            const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

            if (validFrom && now < validFrom) {
                setCouponValidationError(`Coupon is not valid until ${validFrom.toLocaleDateString()}`);
                setValidatedCoupon(null);
                return;
            }

            if (validUntil && now > validUntil) {
                setCouponValidationError("This coupon has expired");
                setValidatedCoupon(null);
                return;
            }

            // Check usage limit
            if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
                setCouponValidationError("This coupon has reached its maximum usage limit");
                setValidatedCoupon(null);
                return;
            }

            // IMPORTANT: Map the discount type correctly
            // Your database might store discount_type as "percentage" or "percent" or "%"
            let discountType = coupon.discount_type;
            let discountValue = coupon.discount_value;

            // Normalize discount type
            if (discountType === "%" || discountType === "percent" || discountType === "percentage") {
                discountType = "PERCENTAGE";
            } else if (discountType === "$" || discountType === "fixed" || discountType === "amount") {
                discountType = "FIXED";
            }

            // Check if the coupon code itself indicates percentage (e.g., "OFF20%")
            const couponCode = coupon.code.toUpperCase();
            if (couponCode.includes('%') && discountType !== "PERCENTAGE") {
                // Extract percentage from code like "OFF20%"
                const match = couponCode.match(/(\d+)%/);
                if (match) {
                    discountType = "PERCENTAGE";
                    discountValue = parseInt(match[1]);
                    console.log(`Detected percentage discount from code: ${discountValue}%`);
                }
            }

            const applicablePaymentType = coupon.applicable_payment_type || "BOTH";

            // Transform coupon data to match expected format
            const validatedCouponData = {
                id: coupon.id,
                code: coupon.code,
                discount_type: discountType,
                discount_value: discountValue,
                duration_months: coupon.duration_months || 0,
                max_uses: coupon.max_uses,
                used_count: coupon.used_count,
                expiry_date: coupon.valid_until,
                applicable_payment_type: applicablePaymentType,
                is_valid: true,
                message: "Coupon is valid",
                practice_usage_json: coupon.practice_usage_json || {}
            };

            console.log("Validated Coupon:", validatedCouponData);

            setValidatedCoupon(validatedCouponData);

            // Show appropriate success message
            const discountText = discountType === "PERCENTAGE"
                ? `${discountValue}% off`
                : `$${discountValue} off`;
            toast.success(`Coupon "${coupon.code}" is valid! (${discountText})`);

            // Auto-select payment type if coupon is specific to one type
            if (applicablePaymentType && applicablePaymentType !== "BOTH") {
                const paymentType = applicablePaymentType === "PAY_PER_MONTH"
                    ? "PAY_PER_MONTH"
                    : "PAY_PER_PATIENT";
                setSelectedPaymentType(paymentType);
            }

        } catch (error: any) {
            console.error("Coupon validation error:", error);
            setCouponValidationError(error?.message || "Failed to validate coupon");
            setValidatedCoupon(null);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    // Calculate price after coupon discount
    const calculateDiscountedPrice = (originalPrice: number): number => {
        if (!validatedCoupon) return originalPrice;

        let discountedPrice = originalPrice;

        console.log("=== CALCULATING DISCOUNT ===");
        console.log("Original Price:", originalPrice);
        console.log("Discount Type:", validatedCoupon.discount_type);
        console.log("Discount Value:", validatedCoupon.discount_value);

        if (validatedCoupon.discount_type === "PERCENTAGE") {
            // For percentage discount (e.g., 20% off)
            discountedPrice = originalPrice * (1 - validatedCoupon.discount_value / 100);
            console.log(`Applied ${validatedCoupon.discount_value}% discount`);
        } else if (validatedCoupon.discount_type === "FIXED") {
            // For fixed amount discount (e.g., $20 off)
            discountedPrice = Math.max(0, originalPrice - validatedCoupon.discount_value);
            console.log(`Applied $${validatedCoupon.discount_value} fixed discount`);
        }

        discountedPrice = Math.round(discountedPrice * 100) / 100;
        console.log("Discounted Price:", discountedPrice);
        console.log("============================");

        return discountedPrice;
    };

    // Assign coupon to practice after creation
    const assignCouponToPractice = async (practiceId: string) => {
        if (!validatedCoupon) return;

        setIsAssigningCoupon(true);

        try {
            const now = new Date();
            const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            // Calculate expiry date
            let expiresAt: string | null = null;
            if (validatedCoupon.duration_months) {
                const expiryDate = new Date(now);
                expiryDate.setMonth(expiryDate.getMonth() + validatedCoupon.duration_months);
                expiresAt = expiryDate.toISOString();
            }

            // Update practice_usage_json
            const practiceUsage = { ...(validatedCoupon.practice_usage_json || {}) };

            // Clean corrupted keys (from previous bad saves)
            delete practiceUsage["0"];
            delete practiceUsage["1"];

            practiceUsage[practiceId] = {
                count: (practiceUsage[practiceId]?.count || 0) + 1,
                periods: [...(practiceUsage[practiceId]?.periods || []), currentMonthKey],
                appliedAt: now.toISOString(),
                expiresAt: expiresAt,
            };

            await assignCoupon({
                variables: {
                    id: validatedCoupon.id,
                    used_count: (validatedCoupon.used_count || 0) + 1,
                    practice_usage_json: practiceUsage,
                },
            });

            toast.success(`Coupon "${validatedCoupon.code}" applied successfully!`);

            // Store coupon info for subscription creation
            return {
                couponId: validatedCoupon.id,
                discountType: validatedCoupon.discount_type,
                discountValue: validatedCoupon.discount_value,
                originalPrice: latestPrice,
                discountedPrice: calculateDiscountedPrice(latestPrice)
            };

        } catch (error: any) {
            console.error('ASSIGN COUPON ERROR:', error);
            toast.error(error?.message || 'Failed to assign coupon');
            return null;
        } finally {
            setIsAssigningCoupon(false);
        }
    };

    const validateForm = () => {
        if (
            !formData.practice_name ||
            !formData.abn_number ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.mobile ||
            !formData.address ||
            !formData.city ||
            !formData.state ||
            !formData.postcode ||
            !formData.practice_phone ||
            !formData.practice_type
        ) {
            toast.error("Please fill in all fields");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }

        if (!formData.termsAccepted) {
            toast.error("You must accept the terms and conditions");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        const abnRegex = /^\d{6,11}$/;
        if (!abnRegex.test(formData.abn_number)) {
            toast.error("Please enter a valid ABN number");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) return;

        const signupPayload = {
            practiceName: formData.practice_name,
            abnNumber: formData.abn_number,
            practiceType: formData.practice_type,
            practicePhone: formData.practice_phone,
            practiceAddress: formData.address,
            practiceCity: formData.city,
            practiceState: formData.state,
            practicePostcode: formData.postcode,
            firstName: formData.first_name,
            lastName: formData.last_name,
            email: formData.email,
            mobileNumber: formData.mobile,
            password: formData.password,
            practiceLogo: formData.logo,
            type: formData.type || "PRACTICE_ADMIN"
        };

        try {
            setIsLoading(true);

            const result = await authService.signup(signupPayload);

            if (result.success) {

                const practiceId = result.user?.id;

                if (practiceId) {

                    /* =========================
                        CREATE PRACTICE INFO
                    ========================= */

                    await createPracticeInfo({
                        variables: {
                            object: {
                                id: practiceId,
                                practice_name: formData.practice_name,
                                abn_number: formData.abn_number,
                                practice_type: formData.practice_type,
                                practice_phone: formData.practice_phone,
                                address: formData.address,
                                city: formData.city,
                                state: formData.state,
                                postcode: formData.postcode
                            }
                        }
                    });

                    /* =========================
                        APPLY COUPON IF EXISTS
                    ========================= */

                    let couponInfo = null;
                    if (validatedCoupon) {
                        couponInfo = await assignCouponToPractice(practiceId);
                    }

                    /* =========================
                        CREATE SUBSCRIPTION
                    ========================= */

                    const startDate = new Date();
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + 30);

                    // Calculate final price with coupon
                    let finalPrice = latestPrice;
                    let appliedDiscount = null;

                    if (couponInfo) {
                        finalPrice = couponInfo.discountedPrice;
                        appliedDiscount = {
                            type: couponInfo.discountType,
                            value: couponInfo.discountValue,
                            originalPrice: couponInfo.originalPrice
                        };
                    }

                    await localClient.mutate({
                        mutation: CREATE_PRACTICE_SUBSCRIPTION,
                        variables: {
                            object: {
                                practice_id: practiceId,
                                current_payment_type: selectedPaymentType,
                                current_price: finalPrice,
                                pending_payment_type: null,
                                pending_price: null,
                                subscription_start_date: startDate.toISOString(),
                                subscription_end_date: endDate.toISOString(),
                                pending_start_date: null,
                                is_active: true,
                                applied_coupon_id: validatedCoupon?.id || null,
                                coupon_discount_applied: appliedDiscount ? JSON.stringify(appliedDiscount) : null
                            }
                        }
                    });

                    /* =========================
                        CREATE PERMISSIONS
                    ========================= */

                    try {
                        const modules = (modulesData as any)?.practice_permission_modules_master ?? [];

                        if (modules.length > 0) {
                            const allPermissions = modules.map((module: any) => ({
                                module: module.module_key,
                                path: module.path,
                                actions: [...module.actions]
                            }));

                            await updatePermissions({
                                variables: {
                                    practiceId,
                                    permissions: allPermissions,
                                    defaultPermission: allPermissions
                                }
                            });
                        }
                    } catch (permError) {
                        console.error("Permission setup error:", permError);
                    }
                }

                toast.success("New practice account is created successfully!");

                if (validatedCoupon) {
                    toast.success(`Coupon ${validatedCoupon.code} applied! ${validatedCoupon.discount_type === "PERCENTAGE" ? `${validatedCoupon.discount_value}% off` : `$${validatedCoupon.discount_value} off`} applied to first month!`);
                }

                setTimeout(() => {
                    onSuccess();
                    navigate("/superadmin/clients");
                }, 1500);

            } else {
                setError(result.message as string);
            }

        } catch (err: any) {
            setError(err?.message || "Something went wrong while creating the practice");
        } finally {
            setIsLoading(false);
        }
    };


    const {
        data: paymentSettingsData
    } = useQuery(GET_PAYMENT_SETTINGS, {
        client: localClient
    });

    const paymentSettingsDataAny = paymentSettingsData as any;
    const paymentSettings = paymentSettingsDataAny?.payment_settings?.[0];

    const originalPrice = selectedPaymentType === "PAY_PER_MONTH"
        ? paymentSettings?.pay_per_month_amount || 0
        : paymentSettings?.pay_per_patient_amount || 0;

    const latestPrice = calculateDiscountedPrice(originalPrice);

    // Check if coupon is applicable to selected payment type
    const isCouponApplicable = validatedCoupon && (
        validatedCoupon.applicable_payment_type === "BOTH" ||
        validatedCoupon.applicable_payment_type === selectedPaymentType
    );

    useEffect(() => {
        if (validatedCoupon && paymentSettings) {
            const originalPrice = selectedPaymentType === "PAY_PER_MONTH"
                ? paymentSettings?.pay_per_month_amount || 0
                : paymentSettings?.pay_per_patient_amount || 0;

            const discounted = calculateDiscountedPrice(originalPrice);

            console.log("=== COUPON EFFECT DEBUG ===");
            console.log("Coupon:", validatedCoupon.code);
            console.log("Discount Type:", validatedCoupon.discount_type);
            console.log("Discount Value:", validatedCoupon.discount_value);
            console.log("Selected Payment Type:", selectedPaymentType);
            console.log("Original Price:", originalPrice);
            console.log("Calculated Discounted Price:", discounted);
            console.log("===========================");
        }
    }, [validatedCoupon, selectedPaymentType, paymentSettings]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a2b3c]/60 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20">

                <div className="px-10 py-4 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-[#1a2b3c] ">
                            Register New Practice
                        </h2>
                        <p className="text-gray-500 font-medium mt-1">
                            Fill in the details to create a practice account
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-400"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center gap-3">
                            <CheckCircle2 size={20} />
                            <span className="font-bold text-sm">{success}</span>
                        </div>
                    )}

                    <form id="practice-form" onSubmit={handleSubmit} className="space-y-10">

                        {/* Practice Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6">
                                Practice Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* ... existing practice fields ... */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name *</label>
                                    <input type="text" name="practice_name" value={formData.practice_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ABN Number *</label>
                                    <input type="text" name="abn_number" value={formData.abn_number} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type *</label>
                                    <input name="practice_type" value={formData.practice_type} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Phone *</label>
                                    <input type="tel" name="practice_phone" value={formData.practice_phone} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City/Suburb *</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input name="state" value={formData.state} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
                                    <input type="text" name="postcode" value={formData.postcode} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6">
                                Primary Contact
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* ... existing contact fields ... */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                            </div>
                        </div>
                        {/* Coupon Section */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6 flex items-center gap-2">
                                <Ticket size={22} />
                                Apply Coupon
                            </h3>

                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={couponCodeInput}
                                        onChange={(e) => {
                                            setCouponCodeInput(e.target.value.toUpperCase());
                                            setCouponValidationError("");
                                        }}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                        disabled={!!validatedCoupon}
                                    />

                                    {!validatedCoupon ? (
                                        <button
                                            type="button"
                                            onClick={handleValidateCoupon}
                                            disabled={isValidatingCoupon || !couponCodeInput.trim()}
                                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                        >
                                            {isValidatingCoupon ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Validating...
                                                </>
                                            ) : (
                                                "Apply Coupon"
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValidatedCoupon(null);
                                                setCouponCodeInput("");
                                                setCouponValidationError("");
                                            }}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {couponValidationError && (
                                    <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        {couponValidationError}
                                    </div>
                                )}

                                {/* {validatedCoupon && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <Check size={18} />
                                            <span className="font-semibold">Coupon Applied!</span>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <p><strong>Code:</strong> {validatedCoupon.code}</p>
                                            <p><strong>Discount:</strong> {validatedCoupon.discount_type === "PERCENTAGE"
                                                ? `${validatedCoupon.discount_value}% off`
                                                : `$${validatedCoupon.discount_value} off`}
                                            </p>
                                            {validatedCoupon.duration_months && (
                                                <p><strong>Valid for:</strong> {validatedCoupon.duration_months} months</p>
                                            )}
                                            {validatedCoupon.applicable_payment_type && validatedCoupon.applicable_payment_type !== "BOTH" && (
                                                <p><strong>Applicable to:</strong> {validatedCoupon.applicable_payment_type === "PAY_PER_MONTH" ? "Pay Per Month" : "Pay Per Patient"}</p>
                                            )}
                                        </div>
                                    </div>
                                )} */}
                                {validatedCoupon && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-700 mb-2">
                                            <Check size={18} />
                                            <span className="font-semibold">Coupon Applied!</span>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <p><strong>Code:</strong> {validatedCoupon.code}</p>
                                            <p><strong>Discount:</strong> {validatedCoupon.discount_type === "PERCENTAGE"
                                                ? `${validatedCoupon.discount_value}% OFF`
                                                : `$${validatedCoupon.discount_value} OFF`}
                                            </p>
                                            {validatedCoupon.duration_months > 0 && (
                                                <p><strong>Valid for:</strong> {validatedCoupon.duration_months} months</p>
                                            )}
                                            {validatedCoupon.applicable_payment_type && validatedCoupon.applicable_payment_type !== "BOTH" && (
                                                <p><strong>Applicable to:</strong> {validatedCoupon.applicable_payment_type === "PAY_PER_MONTH" ? "Pay Per Month" : "Pay Per Patient"}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Subscription Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6">
                                Subscription Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* PAY PER PATIENT */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedPaymentType("PAY_PER_PATIENT")}
                                    className={`border rounded-2xl p-5 text-left transition-all ${selectedPaymentType === "PAY_PER_PATIENT"
                                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                                        : "border-gray-200 bg-white hover:border-orange-300"
                                        } ${validatedCoupon && !isCouponApplicable && validatedCoupon.applicable_payment_type === "PAY_PER_MONTH"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                    disabled={validatedCoupon && validatedCoupon.applicable_payment_type === "PAY_PER_MONTH"}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                            ACTIVE
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold">Pay Per Patient</h3>
                                    <p className="text-sm text-gray-500">Billing based on patients</p>

                                    <div className="mt-4 text-sm">
                                        {(() => {
                                            const perPatientPrice = paymentSettings?.pay_per_patient_amount || 0;
                                            const isApplicable = validatedCoupon && (
                                                validatedCoupon.applicable_payment_type === "BOTH" ||
                                                validatedCoupon.applicable_payment_type === "PAY_PER_PATIENT"
                                            );

                                            return (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="w-4 h-4 text-orange-500" />
                                                        <span>Price per patient: <span className="font-semibold">${perPatientPrice}</span></span>
                                                    </div>

                                                    {isApplicable && (
                                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                            <div className="flex items-start gap-2">
                                                                <div className="text-green-700 text-sm">
                                                                    <p>
                                                                        {validatedCoupon.discount_type === "PERCENTAGE"
                                                                            ? `${validatedCoupon.discount_value}% discount`
                                                                            : `$${validatedCoupon.discount_value} discount`
                                                                        } will be applied to your month-end bill
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </button>

                                {/* PAY PER MONTH */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedPaymentType("PAY_PER_MONTH")}
                                    className={`border rounded-2xl p-5 text-left transition-all ${selectedPaymentType === "PAY_PER_MONTH"
                                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                                        : "border-gray-200 bg-white hover:border-orange-300"
                                        } ${validatedCoupon && !isCouponApplicable && validatedCoupon.applicable_payment_type === "PAY_PER_PATIENT"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                                    disabled={validatedCoupon && validatedCoupon.applicable_payment_type === "PAY_PER_PATIENT"}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <CalendarDays className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                            ACTIVE
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold">Pay Per Month</h3>
                                    <p className="text-sm text-gray-500">Monthly subscription</p>

                                    <div className="mt-4 flex items-center gap-2 text-sm">
                                        <CalendarDays className="w-4 h-4 text-blue-500" />
                                        {(() => {
                                            const perMonthPrice = paymentSettings?.pay_per_month_amount || 0;
                                            const discountedPerMonthPrice = calculateDiscountedPrice(perMonthPrice);
                                            const isApplicable = validatedCoupon && (
                                                validatedCoupon.applicable_payment_type === "BOTH" ||
                                                validatedCoupon.applicable_payment_type === "PAY_PER_MONTH"
                                            );

                                            return isApplicable ? (
                                                <div className="flex flex-col">
                                                    <div>
                                                        <span className="line-through text-gray-400 mr-2">
                                                            ${perMonthPrice}
                                                        </span>
                                                        <span className="text-green-600 font-bold text-lg">
                                                            ${discountedPerMonthPrice}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-green-600">
                                                        You save ${(perMonthPrice - discountedPerMonthPrice).toFixed(2)} with this coupon!
                                                    </div>
                                                </div>
                                            ) : (
                                                <span>Price: <span className="font-semibold">${perMonthPrice}</span></span>
                                            );
                                        })()}
                                    </div>
                                </button>
                            </div>

                            {validatedCoupon && !isCouponApplicable && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                                    <AlertCircle size={16} className="inline mr-2" />
                                    This coupon is only applicable to {validatedCoupon.applicable_payment_type === "PAY_PER_MONTH" ? "Pay Per Month" : "Pay Per Patient"} subscription.
                                </div>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                    className="mt-1.5 h-4 w-4"
                                />
                                <span className="text-gray-600 text-sm leading-relaxed">
                                    I agree to the{" "}
                                    <a href="#" className="text-orange-600 hover:underline font-medium">
                                        Terms & Conditions
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-orange-600 hover:underline font-medium">
                                        Privacy Policy
                                    </a>
                                    . I confirm that I have the authority to register this practice and that all
                                    provided information is accurate.
                                </span>
                            </label>
                        </div>

                    </form>
                </div>

                <div className="px-10 py-4 border-t bg-gray-50 flex justify-end gap-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-gray-500 hover:text-gray-600 bg-gray-200 rounded-2xl"
                    >
                        Cancel
                    </button>

                    <button
                        form="practice-form"
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#f47521] hover:bg-[#d9651d] text-white px-10 py-3 rounded-2xl font-black flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                Creating Account...
                            </>
                        ) : (
                            "Create Practice Account"
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}